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
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    MAIL_SERVER=config('MAIL_SERVER')
    MAIL_USERNAME=config('MAIL_USERNAME')
    MAIL_PASSWORD=config('MAIL_PASSWORD')
    MAIL_PORT=config('MAIL_PORT', cast=int)
    MAIL_USE_TLS =config('MAIL_USE_TLS', cast=bool)
    MAIL_USE_SSL = config('MAIL_USE_SSL', cast=bool, default=False)
    MAIL_DEFAULT_SENDER = config('MAIL_DEFAULT_SENDER')
    CELERY_BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

class ProdConfig(Config): 
    pass

class TestConfig(Config):
    pass


