from flask import Flask, request, jsonify, session, render_template
# Used to set up the API endpoints.
from flask_restx import Api, Resource, fields, Namespace
from config import DevConfig
from models import Blog, User, User_info
from exts import db
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required
from blogs import blog_ns
from auth import auth_ns
from user import user_ns
from flask_cors import CORS
from flask_socketio import SocketIO,emit,join_room, leave_room


def create_config(config):
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    
    #CORS(app)

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

        return {"db":db, "Blog":Blog, "User":User, "User_info":User_info}

    return app


app = create_config(DevConfig)
# CORS is important to bypass the browsers same-origin policy. Different ports are considered 
# different origin regardless if they have the same URL. The browsers same - origin policy states 
# that any data that is accessed or requested should come from the same URL. 
CORS(app,resources={r"/*":{"origins":"*"}})

socketio = SocketIO(app,cors_allowed_origins="*")


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    print(f'User {username} has joined room {room}')
    join_room(room)
    emit('join_confirm', {'msg': f'{username} has joined the room {room}.'}, room=room)
    emit('status', {'msg': f'{username} has joined the room.'}, room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    print(f'User {username} has left the room {room}')
    emit('leave_confirm', {'msg': f'{username} has left the room {room}.'}, room=room)
    emit('status', {'msg': f'{username} has left the room.'}, room=room)
    leave_room(room)


"""

@socketio.on('message')
def on_message(data):
    username = data['username']
    room = data['room']
    message = data['message']
    emit('message', {'username': username, 'message': message}, room=room)"""

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)