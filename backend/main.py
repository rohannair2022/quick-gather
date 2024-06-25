from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields, Namespace
from config import DevConfig
from models import Blog, User
from exts import db
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required
from blogs import blog_ns
from auth import auth_ns
from flask_cors import CORS



def create_config(config):
    app = Flask(__name__)
    app.config.from_object(DevConfig)

    CORS(app)

    db.init_app(app)

    migrate = Migrate(app, db)
    JWTManager(app) 

    api = Api(app,doc='/docs')
    api.add_namespace(blog_ns)
    api.add_namespace(auth_ns)

    @app.shell_context_processor
    def make_shell_context():

        return {"db":db, "Blog":Blog, "User":User}

    return app