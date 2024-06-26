# db = SQLAlCHEMY()
## We initalize the app config in the main.py file 
from exts import db 
# We create the db (database) using the following commands:
# export FLASK_APP = main.py
# flask shell 
# db.create_all()

# Table Blog: id (primary), title, description
class Blog(db.Model):
    id = db.Column(db.Integer(), primary_key = True)
    title = db.Column(db.String(), nullable=False)
    description = db.Column(db.String(), nullable=False)

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
    
    def update(self, title, description):
        self.title = title
        self.description = description 

# Table User: id (primary), username, email, password 
class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(80), nullable=False)
    password = db.Column(db.Text(), nullable = False)

    def __repr__(self):
        return f"User {self.username}"
    
    def save(self):
        db.session.add(self)
        db.session.commit()