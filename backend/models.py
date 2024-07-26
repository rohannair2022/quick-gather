# db = SQLAlCHEMY()
## We initalize the app config in the main.py file 
from exts import db 
# We create the db (database) using the following commands:
# export FLASK_APP = main.py
# flask shell 
# db.drop_all()
# db.create_all()
from datetime import datetime

# addtionally migrate the chnages using flask db upgrade

user_channel = db.Table('user_chanel', 
                        db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
                        db.Column('blog_id', db.Integer(), db.ForeignKey('blog.id')))

# Table Blog: id (primary), title, description
class Blog(db.Model):
    id = db.Column(db.Integer(), primary_key = True)
    title = db.Column(db.String(30), nullable=False)
    description = db.Column(db.Text(), nullable=False)
    users = db.relationship('User', secondary=user_channel, backref='blogs')

    def __repr__(self):
        return f'Blog Name {self.title}'
    
    """
    By calling db.session.add(self), you're telling SQLAlchemy to add this specific instance 
    of Blog (or any other model) as a new row in the corresponding table. 
    It doesn't immediately execute this operation against the database but stages it in the session.

    When you commit a session, all the operations staged in the session (like adding, deleting, or updating rows) 
    are executed against the database in a single transaction
    """

    def save(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update_content(self, title, description):
        self.title = title
        self.description = description 
        db.session.commit()
    
# Table User: id (primary), username, email, password 
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), unique=True, nullable=False)
    email = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    picture = db.Column(db.String(255), nullable=False, default='images/default.jpg')
    
    def __repr__(self):
        return f"User {self.username}"
    
    def save(self):
        db.session.add(self)
        db.session.commit()

# Table User: user_id, blog_id, blog_title, blog_travel, blog_mood 
class User_info(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    blog_id = db.Column(db.Integer, db.ForeignKey('blog.id'), nullable=True)
    blog_budget = db.Column(db.String(30), nullable=False)
    blog_travel = db.Column(db.String(30), nullable=False)
    blog_mood = db.Column(db.String(30), nullable=False)

    # Relationships
    user = db.relationship('User', backref=db.backref('user_infos', lazy=True))
    blog = db.relationship('Blog', backref=db.backref('user_infos', lazy=True))

    def __repr__(self):
        return f"User_info(user_id={self.user_id}, blog_id={self.blog_id})"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    blog_id = db.Column(db.Integer, db.ForeignKey('blog.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', backref=db.backref('chat_messages', lazy=True))
    blog = db.relationship('Blog', backref=db.backref('chat_messages', lazy=True))

    def __repr__(self):
        return f"ChatMessage(id={self.id}, user_id={self.user_id}, blog_id={self.blog_id})"

    def save(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_messages_for_blog(cls, blog_id, limit=50):
        return cls.query.filter_by(blog_id=blog_id).order_by(cls.timestamp).limit(limit).all()