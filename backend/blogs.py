from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields, Namespace
from models import Blog, User
from exts import db
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required


blog_ns = Namespace('blog', description="A namespace for blog")

blog_model = blog_ns.model(
    "Blog",
    {
        "id": fields.Integer(),
        "title": fields.String(),
        "description":fields.String(),
        "username":fields.String()
    }
)

blog_model_get = blog_ns.model(
    "Blog",
    {
        "username":fields.String()
    }
)


@blog_ns.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {"message":"Hello World"}
    

@blog_ns.route('/blogs/<string:username>')
class BlogsResource(Resource):

    @blog_ns.expect(blog_model_get)
    @blog_ns.marshal_list_with(blog_model)
    def get(self, username):
        db_user =  User.query.filter_by(username = username).first()
        return db_user.blogs


@blog_ns.route('/blogs')
class BlogsResource(Resource):

    @blog_ns.expect(blog_model_get)
    @blog_ns.marshal_list_with(blog_model)
    def get(self):
        data = request.get_json()
        db_user =  User.query.filter_by(username = data.get('username')).first()
        return db_user.blogs

    @blog_ns.expect(blog_model)
    @jwt_required()
    def post(self):
        data = request.get_json()
        db_user =  User.query.filter_by(username = data.get('username')).first()
        new_blog = Blog(
            title = data.get('title'),
            description = data.get('description')
        )
        new_blog.users.append(db_user)
        new_blog.save()
        return jsonify({"message" : "Blog Created"})


@blog_ns.route('/blog/<int:id>')
class BlogResource(Resource):
    @blog_ns.marshal_with(blog_model)
    def get(self, id): 
        blog = Blog.query.get_or_404(id)
        return blog
    
    @blog_ns.marshal_with(blog_model)
    @jwt_required()
    def put(self, id):
        blog_to_update = Blog.query.get_or_404(id)
        data = request.get_json()
        blog_to_update.update(data.get("title"), data.get("description"))
        return blog_to_update

    @blog_ns.marshal_with(blog_model)
    @jwt_required()
    def delete(self, id):
        blog_to_delete = Blog.query.get_or_404(id)
        blog_to_delete.delete()
        return blog_to_delete