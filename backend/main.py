from flask import Flask, request, jsonify, session, render_template
from flask_restx import Api, Resource, fields, Namespace
from config import DevConfig
from models import Blog, User, User_info, ChatMessage
from exts import db
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required
from blogs import blog_ns
from auth import auth_ns
from user import user_ns
from flask_cors import CORS
from flask_socketio import SocketIO,emit,join_room, leave_room
from flask_mail import Mail, Message


def create_config(config):
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)

    migrate = Migrate(app, db)
    
    JWTManager(app) 

    # Generates Swagger Documentation / Helps builing RestFul services. 
    """
        Some Benefits of the API restx module is that it performs input validation and response marhsalling.
        Something that flask alone cannot do. 
        Marshal : Used to set the type of output 
        Expect : Defines the type of input required. 
    """
    api = Api(app,doc='/docs')
    # Namespace allows us to group related API endpoints together. 

    api.add_namespace(blog_ns)
    api.add_namespace(auth_ns)
    api.add_namespace(user_ns)

    # Define the DB and Tables
    @app.shell_context_processor
    def make_shell_context():

        return {"db":db, "Blog":Blog, "User":User, "User_info":User_info, "ChatMessage":ChatMessage}

    return app


app = create_config(DevConfig)
# CORS is important to bypass the browsers same-origin policy. Different ports are considered 
# different origin regardless if they have the same URL. The browsers same - origin policy states 
# that any data that is accessed or requested should come from the same URL. 
CORS(app,resources={r"/*":{"origins":"*"}})

socketio = SocketIO(app,cors_allowed_origins="*")

def create_mail():
    mail = Mail(app)
    return mail

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']  # This should be the blog_id
    join_room(room)
    print(f'User {username} has joined room {room}')
    emit('join_confirm', {'msg': f'{username} has joined the room {room}.'}, room=room)
    
    # Send stored messages to the client
    messages = ChatMessage.get_messages_for_blog(room)
    emit('message_history', {'messages': [
        {'username': msg.user.username, 'message': msg.message} for msg in messages
    ]})

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    print(f'User {username} has left the room {room}')
    emit('leave_confirm', {'msg': f'{username} has left the room {room}.'}, room=room)

@socketio.on("message")
def on_message(data):
    username = data['username']
    room = data['room']  
    message_text = data['message']
    
    user = User.query.filter_by(username=username).first()
    blog = Blog.query.get(room)
    
    if user and blog:
        # Store the message
        new_message = ChatMessage(user_id=user.id, blog_id=blog.id, message=message_text)
        new_message.save()
        
        print(f'User {username} said: {message_text} in room {room}')
        
        # Broadcast the message to all clients in the room
        emit('message_confirm', {'msg': message_text, 'username': username}, room=room)
    else:
        emit('error', {'msg': 'Invalid user or blog'}, room=request.sid)

if __name__ == '__main__':
    socketio.run(app, debug=True)