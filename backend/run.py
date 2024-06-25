from main import create_config
from config import DevConfig

if __name__ == "__main__":
    app = create_config(DevConfig)
    app.run()