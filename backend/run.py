from flask import Flask, send_from_directory, request, jsonify
from app import socketio
from app.supabase_client import supabase

app = Flask(__name__)
socketio.init_app(app)

# ---------- FRONTEND ROUTES ----------

@app.route("/")
def index():
    return send_from_directory("../frontend", "index.html")


@app.route("/login")
def login_page():
    return send_from_directory("../frontend", "login.html")


@app.route("/app.js")
def js():
    return send_from_directory("../frontend", "app.js")


@app.route("/style.css")
def css():
    return send_from_directory("../frontend", "style.css")


# ---------- LOGIN API ----------

@app.route("/login", methods=["POST"])
def login():

    data = request.json

    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    response = supabase.table("users").select("*").eq("username", username).execute()
    print("SUPABASE RESPONSE:", response.data)

    if len(response.data) == 0:
        return jsonify({"status": "error"})

    user = response.data[0]

    if user["password"] != password or user["role"].lower() != role.lower():
        return jsonify({"status": "error"})

    return jsonify({
        "status": "success",
        "user_id": user["id"],
        "username": user["username"],
        "role": user["role"]
    })


# ---------- SOCKETS ----------

from app import sockets


# ---------- START SERVER ----------

if __name__ == "__main__":
    socketio.run(app, host="127.0.0.1", port=5000, debug=True)