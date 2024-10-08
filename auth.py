from models import User
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, request, jsonify, make_response, url_for, current_app, copy_current_request_context
from flask_restx import Api, Resource, fields, Namespace
from flask_mail import Message
from threading import Thread

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
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')

        # Check if username already exists
        db_user = User.query.filter_by(username=username).first()
        if db_user is not None:
            return {"message": "Username already exists. Please try a different one", "response":"danger"}, 400

        db_email = User.query.filter_by(email=email).first()
        if db_email is not None:
            return {"message": "Email is already in use. Please try a different one", "response":"danger"}, 400

        # Wrap the process_signup function with the current request context
        @copy_current_request_context
        def async_process_signup(data):
            process_signup(data)

        # Start the signup process in a separate thread
        thread = Thread(target=async_process_signup, args=(data,))
        thread.start()

        return {"message": "Your signup request is being processed. Please check your email to confirm your account.", "response":"success"}, 202

def process_signup(data):
    try:
        # Lazy Import : Prevents circular import error.
        from main import create_mail
        app, mail, serializer = create_mail()

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Generate confirmation token with user data
        token_data = {
            'username': username,
            'email': email,
            'password': password
        } 

        token = serializer.dumps(token_data, salt='email-confirm')

        # Create confirmation link
        with app.test_request_context():
            base_url = 'https://quickgather-5069dcada862.herokuapp.com/'  
            confirm_url = f"{base_url}{url_for('confirm_email', token=token)}"

        # Send email
        msg = Message('You are few steps away !! Confirm Your Email',
                      sender='nairrohan151@gmail.com',
                      recipients=[email])
        msg.body = f'Click the following link to confirm your email and create your account:\n {confirm_url}'
        
        with app.app_context():
            mail.send(msg)

    except Exception as e:
        # Log the error
        current_app.logger.error(f"Error in signup process: {str(e)}")

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
    @jwt_required(refresh=True)
    def post(self):
        try:
            current_user = get_jwt_identity()
            print(f"Refreshing token for user: {current_user}")
            new_access_token = create_access_token(identity=current_user)
            return make_response(jsonify({"accessToken": new_access_token}), 200)
        except Exception as e:
            print(f"Error in refresh: {str(e)}")
            return make_response({"error": "Token refresh failed"}, 422)


 