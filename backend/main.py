from flask import Flask, request
from flask_restx import Api, Resource, fields, Namespace
from config import DevConfig
from models import Blog
from exts import db
from flask_migrate import Migrate


app = Flask(__name__)
app.config.from_object(DevConfig)

db.init_app(app)

migrate = Migrate(app, db)

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


@api.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {"message":"Hello World"}
    
@api.route('/blogs')
class BlogsResource(Resource):

    @api.marshal_list_with(blog_model)
    def get(self):
        blogs = Blog.query.all()
        return blogs

    @api.marshal_with(blog_model)
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
    def put(self, id):
        blog_to_update = Blog.query.get_or_404(id)
        data = request.get_json()
        blog_to_update.update(data.get("title"), data.get("description"))
        return blog_to_update

    @api.marshal_with(blog_model)
    def delete(self, id):
        blog_to_delete = Blog.query.get_or_404(id)
        blog_to_delete.delete()
        return blog_to_delete



@app.shell_context_processor
def make_shell_context():

    return {"db":db, "Blog":Blog}


if __name__ == "__main__":
    app.run()