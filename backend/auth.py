from models import User
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, request, jsonify, make_response, url_for, current_app
from flask_restx import Api, Resource, fields, Namespace
from flask_mail import Message

auth_ns = Namespace('auth', description="A namespace for our Authentication")

signup_model = auth_ns.model(
    "Signup",
    {
        "username": fields.String(),
        "email": fields.String(),
        "password": fields.String()
    }
)

login_model = auth_ns.model(
    "Login",
    {
        "username": fields.String(),
        "password": fields.String()
    }
)

@auth_ns.route('/signup')
class Signup(Resource):
    @auth_ns.expect(signup_model)
    def post(self):
        try:
            # Lazy Import : Prevents circular import error.
            from main import create_mail

            mail, serializer = create_mail()

            data = request.get_json() 

            username = data.get('username')
            db_user = User.query.filter_by(username = username).first()

            if db_user is not None:
                return jsonify({"message":"Username already exits."})

            # Generate confirmation token with user data
            token_data = {
                'username': username,
                'email': data.get('email'),
                'password': data.get('password')
            }

            token = serializer.dumps(token_data, salt='email-confirm')

            # Create confirmation link
            confirm_url = url_for('confirm_email', token=token, _external=True)

            # Send email
            msg = Message('You are few steps away !! Confirm Your Email',
                        sender='nairrohan151@gmail.com',
                        recipients=[data.get('email')])
            msg.body = f'Click the following link to confirm your email and create your account:\n {confirm_url}'
            mail.send(msg)
            
            return jsonify({
                "message": "Please check your email to confirm your account"
                })
        except:
            return jsonify({"message": "Please check your email to confirm your account"}), 200


@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()

        username = data.get('username')
        password = data.get('password')

        db_user =  User.query.filter_by(username = username).first()

        if db_user and check_password_hash(db_user.password, password):
            
            # Creation of random alphanumeric characters. 
            access_token = create_access_token(identity=db_user.username)
            refresh_token = create_refresh_token(identity=db_user.username)

            return jsonify(
                {"accessToken": access_token, "refreshToken": refresh_token, "message": "Success", "username": data.get('username')}
            )
        else:
            return jsonify({
                "message" : "Username or Password is wrong."
            })
    
    # Remove on deployment
    @auth_ns.marshal_list_with(login_model)
    def get(self):
        users = User.query.all()
        return users

@auth_ns.route('/refresh')
class RefreshResource(Resource):
    @jwt_required(refresh = True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return make_response(jsonify({"accessToken":new_access_token})), 200

 