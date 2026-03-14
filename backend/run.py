from flask import Flask, send_from_directory
from app import socketio

app = Flask(__name__)
socketio.init_app(app)

@app.route("/")
def index():
    return send_from_directory("../frontend", "index.html")

@app.route("/app.js")
def js():
    return send_from_directory("../frontend", "app.js")

@app.route("/style.css")
def css():
    return send_from_directory("../frontend", "style.css")

from app import sockets

if __name__ == "__main__":
    socketio.run(app, host="127.0.0.1", port=5000, debug=True)
