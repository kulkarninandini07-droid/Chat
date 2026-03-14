const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let rooms = ["general"];
let admin = null;

// store messages per room
let roomMessages = {
    general: []
};

io.on("connection", socket => {

    socket.emit("roomList", rooms);

    socket.on("joinUser", username => {

        socket.username = username;

        // assign admin
        if(!admin){
            admin = username;
            socket.role = "admin";
        } else {
            socket.role = "member";
        }

        socket.join("general");
        socket.currentRoom = "general";

        io.to("general").emit("message", {
            user: "System",
            text: username + " joined #general",
            room: "general"
        });

        // load previous messages
        socket.emit("loadMessages", roomMessages["general"]);
    });

    socket.on("chatMessage", data => {

        const message = data.text;

        // ADMIN COMMAND: CREATE ROOM
        if(message.startsWith("/create-room")){

            if(socket.role !== "admin"){
                socket.emit("message", {
                    user: "System",
                    text: "Only admin can create rooms",
                    room: socket.currentRoom
                });
                return;
            }

            const parts = message.split(" ");
            const roomName = parts[1];

            if(!roomName) return;

            if(!rooms.includes(roomName)){

                rooms.push(roomName);
                roomMessages[roomName] = [];

                io.emit("roomList", rooms);

                io.emit("message", {
                    user: "System",
                    text: "Room #" + roomName + " created",
                    room: socket.currentRoom
                });

            }

            return;
        }

        // ADMIN COMMAND: ANNOUNCEMENT
        if(message.startsWith("/announce")){

    if(socket.role !== "admin"){
        socket.emit("message", {
            user: "System",
            text: "Only admin can send announcements",
            room: socket.currentRoom
        });
        return;
    }

    const announcement = message.replace("/announce ", "");

    const msg = {
        user: "Announcement",
        text: announcement,
        type: "announcement"
    };

    io.emit("message", msg);

    return;
}

        // NORMAL MESSAGE
        const msg = {
            user: data.user,
            text: data.text,
            room: data.room
        };

        if(!roomMessages[data.room]){
            roomMessages[data.room] = [];
        }

        roomMessages[data.room].push(msg);

        io.to(data.room).emit("message", msg);

    });

    socket.on("joinRoom", room => {

        if(socket.currentRoom){

            socket.leave(socket.currentRoom);

            io.to(socket.currentRoom).emit("message", {
                user: "System",
                text: socket.username + " left the room",
                room: socket.currentRoom
            });
        }

        socket.join(room);
        socket.currentRoom = room;

        io.to(room).emit("message", {
            user: "System",
            text: socket.username + " joined #" + room,
            room: room
        });

        // send previous messages
        if(roomMessages[room]){
            socket.emit("loadMessages", roomMessages[room]);
        }

    });

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});