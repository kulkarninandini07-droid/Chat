from flask_socketio import emit, join_room
from app import socketio
from app.supabase_client import supabase

users = {}

rooms = {
    "general": [],
    "admin-room": [],
    "manager-room": [],
    "employee-room": []
}

@socketio.on("connect")
def handle_connect():
    print("Client connected")


# USER JOIN
@socketio.on("joinUser")
def handle_join_user(data):

    username = data["username"]
    user_id = data["user_id"]
    role = data["role"]

    users[username] = {
        "user_id": user_id,
        "role": role,
        "room": "general"
    }

    join_room("general")

    print(username, "joined with role:", role)

    emit("message", {
        "user": "System",
        "text": f"{username} joined the system",
        "room": "general"
    }, broadcast=True)

    # 🔒 FILTER ROOMS BASED ON ROLE
    visible_rooms = []

    if role == "admin":
        visible_rooms = list(rooms.keys())

    elif role == "manager":
        visible_rooms = ["general", "manager-room", "employee-room"]

    elif role == "employee":
        visible_rooms = ["general", "employee-room"]

    emit("roomList", visible_rooms)


# SEND MESSAGE
@socketio.on("chatMessage")
def handle_message(data):

    username = data["username"]
    room = data["room"]
    text = data["text"]

    message = {
        "user": username,
        "text": text,
        "room": room
    }

    if room not in rooms:
        rooms[room] = []

    rooms[room].append(message)

    supabase.table("messages").insert({
        "user": username,
        "room": room,
        "text": text
    }).execute()

    emit("message", message, to=room)


# JOIN ROOM
@socketio.on("joinRoom")
def handle_join_room(data):

    room = data["room"]
    username = data["username"]

    print(username, "joining room:", room)

    join_room(room)

    if room not in rooms:
        rooms[room] = []

    emit("loadMessages", rooms[room])

    emit("loadMessages", rooms[room])
@socketio.on("createRoom")
def handle_create_room(data):

    room = data["room"]

    # Prevent duplicate rooms
    if room in rooms:
        emit("message", {
            "user": "System",
            "text": "Room already exists",
            "room": "general"
        })
        return

    rooms[room] = []

    print("New room created:", room)

    # Broadcast new room to everyone
    emit("roomList", list(rooms.keys()), broadcast=True)