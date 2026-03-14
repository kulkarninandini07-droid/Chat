from flask_socketio import emit

def handle_command(user, room, text, rooms):

    parts = text.split()

    command = parts[0]

    if command == "/create-room":

        if len(parts) < 2:
            return

        room_name = parts[1]

        if room_name not in rooms:
            rooms[room_name] = []

        emit("roomList", list(rooms.keys()), broadcast=True)


    elif command == "/announce":

        message = " ".join(parts[1:])

        emit("message", {
            "type": "announcement",
            "text": message
        }, broadcast=True)


    elif command == "/users":

        user_list = ", ".join(rooms.keys())

        emit("message", {
            "user": "System",
            "text": f"Rooms: {user_list}",
            "room": room
        })