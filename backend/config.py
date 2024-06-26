# config is used to access variables from the enviorment. 
from decouple import config
import os 



# Gives us the path to ....IWillBeThere/backend
BASE_DIR = os.path.dirname(os.path.realpath(__file__))

class Config:
    # Used for signing/ hiding cookies / tokens from being tampered with.
    SECRET_KEY= config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)

class DevConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, 'dev.db')
    DEBUG = True
    SQLALCHEMY_ECHO=True 

class ProdConfig(Config): 
    pass

class TestConfig(Config):
    pass


