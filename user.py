from flask import request, jsonify
from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models import User
import os
import boto3
from decouple import config

user_ns = Namespace('user', description="A namespace for User defined operations")

UPLOAD_FOLDER = 'images/'

s3 = boto3.client('s3', aws_access_key_id = config('AWS_ACCESS_KEY_ID'), aws_secret_access_key= config('AWS_SECRET_ACCESS_KEY'))

@user_ns.route('/uploadpic')
class Upload(Resource):

    @jwt_required()
    def get(self):
        username = request.args.get('username')
        user = User.query.filter_by(username=username).first()
        if user:
            return {"image_path": user.picture}
        else:
            return {"error": "User not found"}, 404


    @jwt_required()
    def post(self):
        if 'picture' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['picture']
        user_name = request.form.get('user_name')

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        if file and allowed_file(file.filename):
            filename = user_name + secure_filename(file.filename)
            s3.upload_fileobj(file, config("S3_BUCKET"), filename)

            # Update user's profile picture in database
            user = User.query.filter_by(username=user_name).first()
            if user:
                user.picture = f'https://{config("S3_BUCKET")}.s3.amazonaws.com/{filename}'
                user.save()

            return {"message": "Picture Uploaded Successfully. Refresh the Page", "filename": user.picture, "response":"success"}, 200
        else:
            return {"error": "File type not allowed", "response":"danger"}, 400

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS