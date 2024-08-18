from flask import Flask, request, jsonify, session, render_template, current_app, make_response, url_for, redirect
from flask_restx import Api
from config import DevConfig, ProdConfig
from models import Blog, User, User_info, ChatMessage
from exts import db
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required
from blogs import blog_ns
from auth import auth_ns
from user import user_ns
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer

def create_app(config):
    app = Flask(__name__, static_url_path='/', static_folder ='./client/build')
    app.config.from_object(config)

    db.init_app(app)
    migrate = Migrate(app, db)
    JWTManager(app)
    mail = Mail(app)

    api = Api(app, doc='/docs')
    api.add_namespace(blog_ns)
    api.add_namespace(auth_ns)
    api.add_namespace(user_ns)

    CORS(app, resources={r"/*": {"origins": "*"}})


    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    @app.errorhandler(404)
    def not_found(err):
        return app.send_static_file('index.html')

    @app.shell_context_processor
    def make_shell_context():
        return {"db": db, "Blog": Blog, "User": User, "User_info": User_info, "ChatMessage": ChatMessage}

    return app, mail

app, mail = create_app(ProdConfig)
socketio = SocketIO(app, cors_allowed_origins="*")

serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

def create_mail():
    return app, mail, serializer

@app.route('/confirm/<token>')
def confirm_email(token):
    try:
        token_data = serializer.loads(token, salt='email-confirm', max_age=3600)  # 1 hour expiration
    except:
        return redirect("http://localhost:3000/Failure")

    # Check if user already exists
    existing_user = User.query.filter_by(username=token_data['username']).first()
    if existing_user:
        return redirect("http://localhost:3000/Failure")

    # Create new user
    new_user = User(
        username=token_data['username'],
        email=token_data['email'],
        password=generate_password_hash(token_data['password']),
    )
    db.session.add(new_user)
    db.session.commit()

    return redirect("http://localhost:3000/Success")

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
        db.session.add(new_message)
        db.session.commit()
        
        print(f'User {username} said: {message_text} in room {room}')
        
        # Broadcast the message to all clients in the room
        emit('message_confirm', {'msg': message_text, 'username': username}, room=room)
    else:
        emit('error', {'msg': 'Invalid user or blog'}, room=request.sid)

if __name__ == '__main__':
    socketio.run(app, debug=True)