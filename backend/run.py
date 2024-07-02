from main import create_config
from config import DevConfig
from flask_socketio import SocketIO

app = create_config(DevConfig)
socketio = SocketIO(app)

if __name__ == "__main__":
    socketio.run(app, debug=True)