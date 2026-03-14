const socket = io();

let username = "";
let currentRoom = "general";

function joinSystem(){

    username = document.getElementById("username").value;

    if(username === ""){
        alert("Enter username");
        return;
    }

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("chatPage").style.display = "block";

    socket.emit("joinUser", username);
}

function sendMessage(){

    const input = document.getElementById("messageInput");
    const message = input.value;

    if(message === "") return;

    socket.emit("chatMessage", {
        user: username,
        room: currentRoom,
        text: message
    });

    input.value = "";
}

socket.on("message", data => {

    const msgBox = document.getElementById("messages");

    // Allow announcements everywhere
    if(data.room && data.room !== currentRoom && data.type !== "announcement") return;

    const div = document.createElement("div");

    const time = new Date().toLocaleTimeString();

    if(data.type === "announcement"){

        div.innerHTML = "<span class='announcement'>📢 [" + time + "] " + data.text + "</span>";

    }
    else if(data.user === "System"){

        div.innerHTML = "<span class='system'>[" + time + "] " + data.text + "</span>";

    }
    else{

        div.innerHTML = "<b>" + data.user + "</b> (" + time + "): " + data.text;

    }

    msgBox.appendChild(div);

    msgBox.scrollTop = msgBox.scrollHeight;

});

socket.on("roomList", rooms => {

    const roomList = document.getElementById("roomList");

    roomList.innerHTML = "";

    rooms.forEach(room => {

        const li = document.createElement("li");

        li.innerText = "#" + room;

        li.onclick = () => joinRoom(room);

        roomList.appendChild(li);

    });

});

function joinRoom(room){

    currentRoom = room;

    socket.emit("joinRoom", room);

    document.getElementById("messages").innerHTML = "";

}

socket.on("loadMessages", messages => {

    const msgBox = document.getElementById("messages");

    msgBox.innerHTML = "";

    messages.forEach(data => {

        const div = document.createElement("div");

        const time = new Date().toLocaleTimeString();

        if(data.user === "System"){
            div.innerHTML = "<span class='system'>[" + time + "] " + data.text + "</span>";
        }
        else{
            div.innerHTML = "<b>" + data.user + "</b>: " + data.text;
        }

        msgBox.appendChild(div);

    });

});