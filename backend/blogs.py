from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields, Namespace
from models import Blog, User, User_info, ChatMessage
from exts import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required
from statistics import mode


blog_ns = Namespace('blog', description="A namespace for blog")

blog_model = blog_ns.model(
    "Blog",
    {
        "id": fields.Integer(),
        "title": fields.String(),
        "description": fields.String(),
        "username": fields.String(),  
        "mood": fields.String(),
        "travel": fields.String(),
        "budget": fields.String()
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
            description = data.get('description'),
        )
        new_blog.users.append(db_user)
        new_blog.save()

        new_info = User_info(
            user_id = db_user.id,
            blog_id = new_blog.id,
            blog_budget = data.get('budget'),
            blog_travel = data.get('travel'),
            blog_mood = data.get('mood'),
        )

        new_info.save()

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
        data = request.get_json()
        db_user =  User.query.filter_by(username = data.get('username')).first()
        user_id = db_user.id
        blog_id = blog_to_delete.id

        for i in db_user.blogs:
            if i.id == blog_id:
                db_user.blogs.remove(i)

        for j in blog_to_delete.users:
            if j.id == user_id:
                blog_to_delete.users.remove(i)
        
        if len(blog_to_delete.users) == 0:
            ChatMessage.query.filter_by(blog_id=blog_to_delete.id).delete()
            User_info.query.filter_by(blog_id=blog_to_delete.id).delete()
            blog_to_delete.delete()


        db.session.commit()

        db_user_info = User_info.query.filter_by(user_id = user_id, blog_id = blog_id)
        db_user_info.delete()

        return blog_to_delete

@blog_ns.route('/users/<int:id>')
class BlogResource(Resource):
    @jwt_required()
    def get(self, id): 
        blog = Blog.query.get_or_404(id)
        return [user.picture for user in blog.users]
    

@blog_ns.route('/join/<int:id>')
class BlogResource(Resource):
    @jwt_required()
    @blog_ns.expect(blog_model)
    def put(self, id):
        try:
            data = request.get_json()
            blog_to_add = Blog.query.get_or_404(int(id))
            user_to_add = User.query.filter_by(username=data.get('username')).first_or_404()
            blog_to_add.users.append(user_to_add)
            user_to_add.blogs.append(blog_to_add)
            new_info = User_info(
                user_id = user_to_add.id,
                blog_id = blog_to_add.id,
                blog_budget = data.get('budget'),
                blog_travel = data.get('travel'),
                blog_mood = data.get('mood'),
            )
            new_info.save()

            return {"message":"Success"}
        except:
            return {"message":"Group ID does not exist"}

@blog_ns.route('/stats/<int:id>')
class BlogResource(Resource):
    @jwt_required()
    def get(self, id):
        try:
            blog_to_stat = Blog.query.get(int(id))
            users = User_info.query.filter_by(blog_id=blog_to_stat.id).all()

            budgets = [float(user.blog_budget) for user in users]  # Convert to float
            moods = [user.blog_mood for user in users]
            travels = [int(user.blog_travel) for user in users]  # Convert to int

            count_num = len(users)
            min_budget = min(budgets)
            most_common_mood = mode(moods)
            avg_travel = round(sum(travels) / count_num) if count_num > 0 else 0

            return {
                "message": "Success",
                "number": count_num,
                "mood": most_common_mood,
                "budget": min_budget,
                "travel": avg_travel
            }
        except Exception as e:
            print(f"Error: {str(e)}")
            return {"message": "An error occurred", "error": str(e)}
