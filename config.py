# config is used to access variables from the enviorment. 
from decouple import config
import os 
from datetime import timedelta

# Gives us the path to ....IWillBeThere/backend
BASE_DIR = os.path.dirname(os.path.realpath(__file__))

class Config:
    # Used for signing/ hiding cookies / tokens from being tampered with.
    SECRET_KEY= config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)

class DevConfig(Config):
    # SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, 'dev.db')
    SQLALCHEMY_DATABASE_URI ='postgresql://postgres:Database4833@localhost:5432/userDB'
    DEBUG = True
    SQLALCHEMY_ECHO=True 
    JWT_SECRET_KEY = config('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    MAIL_SERVER=config('MAIL_SERVER')
    MAIL_USERNAME=config('MAIL_USERNAME')
    MAIL_PASSWORD=config('MAIL_PASSWORD')
    MAIL_PORT=config('MAIL_PORT', cast=int)
    MAIL_USE_TLS =config('MAIL_USE_TLS', cast=bool)
    MAIL_USE_SSL = config('MAIL_USE_SSL', cast=bool, default=False)
    MAIL_DEFAULT_SENDER = config('MAIL_DEFAULT_SENDER')
    AWS_ACCESS_KEY_ID=config('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY=config('AWS_SECRET_ACCESS_KEY')


class ProdConfig(Config): 
    raw_uri = config('DATABASE_URL')
    # Replace the postgres:// prefix with postgresql://
    SQLALCHEMY_DATABASE_URI = raw_uri.replace("postgres://", "postgresql://", 1)
    DEBUG = config('DEBUG')
    SQLALCHEMY_ECHO=config('ECHO', cast=bool)
    JWT_SECRET_KEY = config('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    MAIL_SERVER=config('MAIL_SERVER')
    MAIL_USERNAME=config('MAIL_USERNAME')
    MAIL_PASSWORD=config('MAIL_PASSWORD')
    MAIL_PORT=config('MAIL_PORT', cast=int)
    MAIL_USE_TLS =config('MAIL_USE_TLS', cast=bool)
    MAIL_USE_SSL = config('MAIL_USE_SSL', cast=bool, default=False)
    MAIL_DEFAULT_SENDER = config('MAIL_DEFAULT_SENDER')
    AWS_ACCESS_KEY_ID=config('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY=config('AWS_SECRET_ACCESS_KEY')

class TestConfig(Config):
    pass


