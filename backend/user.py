from flask import request, jsonify
from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models import User
import os

user_ns = Namespace('user', description="A namespace for User defined operations")

UPLOAD_FOLDER = 'images/'

@user_ns.route('/uploadpic')
class Upload(Resource):
    @jwt_required()
    def post(self):
        if 'picture' not in request.files:
            return {"error": "No file part"}, 400
        
        file = request.files['picture']
        user_name = request.form.get('user_name')

        if file.filename == '':
            return {"error": "No selected file"}, 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

            # Update user's profile picture in database
            user = User.query.filter_by(username=user_name).first()
            if user:
                user.picture = filename
                user.save()

            return {"message": "Picture Uploaded Successfully", "filename": filename}, 200
        else:
            return {"error": "File type not allowed"}, 400

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS