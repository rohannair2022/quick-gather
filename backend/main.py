from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields, Namespace
from config import DevConfig
from models import Blog, User
from exts import db
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required


app = Flask(__name__)
app.config.from_object(DevConfig)

db.init_app(app)

migrate = Migrate(app, db)

JWTManager(app) 

api = Api(app,doc='/docs')

#model (serializer)
# This helps us set the json file. 
blog_model = api.model(
    "Blog",
    {
        "id": fields.Integer(),
        "title": fields.String(),
        "description":fields.String()
    }
)

signup_model = api.model(
    "Signup",
    {
        "username": fields.String(),
        "email": fields.String(),
        "password": fields.String()
    }
)

login_model = api.model(
    "Login",
    {
        "username": fields.String(),
        "password": fields.String()
    }
)

@api.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {"message":"Hello World"}
    

@api.route('/signup')
class Signup(Resource):
    @api.expect(signup_model)
    def post(self):
        data = request.get_json() 

        username = data.get('username')

        db_user = User.query.filter_by(username = username).first()

        if db_user is not None:
            return jsonify({"message":"Username already exits."})

        new_user = User(username = data.get("username"), 
                        email = data.get("email"), 
                        password = generate_password_hash(data.get("password"))
                    )
        new_user.save()

        return jsonify({"message":"User Created"})

@api.route('/login')
class Login(Resource):
    @api.expect(login_model)
    def post(self):
        data = request.get_json()

        username = data.get('username')
        password = data.get('password')

        db_user =  User.query.filter_by(username = username).first()

        if db_user and check_password_hash(db_user.password, password):
            
            access_token = create_access_token(identity=db_user.username)
            refresh_token = create_refresh_token(identity=db_user.username)

            return jsonify(
                {"accessToken": access_token, "refreshToken": refresh_token}
            )


@api.route('/blogs')
class BlogsResource(Resource):

    @api.marshal_list_with(blog_model)
    @jwt_required()
    def get(self):
        blogs = Blog.query.all()
        return blogs

    @api.marshal_with(blog_model)
    @jwt_required()
    def post(self):
        data = request.get_json()
        new_blog = Blog(
            title = data.get('title'),
            description = data.get('description')
        )
        new_blog.save()
        return new_blog, 201


@api.route('/blog/<int:id>')
class BlogResource(Resource):
    @api.marshal_with(blog_model)
    def get(self, id): 
        blog = Blog.query.get_or_404(id)
        return blog
    
    @api.marshal_with(blog_model)
    @jwt_required()
    def put(self, id):
        blog_to_update = Blog.query.get_or_404(id)
        data = request.get_json()
        blog_to_update.update(data.get("title"), data.get("description"))
        return blog_to_update

    @api.marshal_with(blog_model)
    @jwt_required()
    def delete(self, id):
        blog_to_delete = Blog.query.get_or_404(id)
        blog_to_delete.delete()
        return blog_to_delete



@app.shell_context_processor
def make_shell_context():

    return {"db":db, "Blog":Blog}


if __name__ == "__main__":
    app.run()