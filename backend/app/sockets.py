from flask_socketio import emit, join_room
from app import socketio
from app.commands import handle_command

@socketio.on("connect")
def handle_connect():
    print("Client connected")

users = {}
rooms = {
    "general": []
}

@socketio.on("joinUser")
def handle_join_user(username):

    users[username] = "general"

    join_room("general")

    print(username, "joined general")

    emit("message", {
        "user": "System",
        "text": f"{username} joined the system",
        "room": "general"
    }, broadcast=True)

    emit("roomList", list(rooms.keys()), broadcast=True)



@socketio.on("chatMessage")
def handle_message(data):

    print("MESSAGE RECEIVED:", data)

    user = data["user"]
    room = data["room"]
    text = data["text"]

    message = {
        "user": user,
        "text": text,
        "room": room
    }

    if room not in rooms:
        rooms[room] = []

    rooms[room].append(message)

    emit("message", message, broadcast=True)


@socketio.on("joinRoom")
def handle_join_room(room):

    join_room(room)

    if room not in rooms:
        rooms[room] = []

    emit("loadMessages", rooms[room])