const socket = io();

let username = localStorage.getItem("username");
let user_id = localStorage.getItem("user_id");
let role = localStorage.getItem("role");

let currentRoom = "general";


// ---------- LOGIN CHECK ----------

window.onload = function(){

if(!username){

alert("Login first");
window.location.href="/login";
return;

}

socket.emit("joinUser",{
username:username,
user_id:user_id,
role:role
});

};



// ---------- SEND MESSAGE ----------

function sendMessage(){

const input=document.getElementById("messageInput");
const text=input.value;

if(text==="") return;

socket.emit("chatMessage",{

user_id:user_id,
username:username,
room:currentRoom,
text:text

});

input.value="";

}



// ---------- RECEIVE MESSAGE ----------

socket.on("message",function(data){

const msgBox=document.getElementById("messages");

const div=document.createElement("div");

div.innerHTML="<b>"+data.user+"</b>: "+data.text;

msgBox.appendChild(div);

msgBox.scrollTop=msgBox.scrollHeight;

});



// ---------- ROOM LIST ----------

socket.on("roomList",function(rooms){

const roomList=document.getElementById("roomList");

roomList.innerHTML="";

rooms.forEach(room=>{

const li=document.createElement("li");

li.innerText=room;

li.onclick=function(){

joinRoom(room);

};

roomList.appendChild(li);

});

});



// ---------- JOIN ROOM ----------

function joinRoom(room){

currentRoom=room;

socket.emit("joinRoom",{
room:room,
username:username
});

document.getElementById("messages").innerHTML="";

}



// ---------- LOAD MESSAGES ----------

socket.on("loadMessages",function(messages){

const msgBox=document.getElementById("messages");

msgBox.innerHTML="";

messages.forEach(data=>{

const div=document.createElement("div");

div.innerHTML="<b>"+data.user+"</b>: "+data.text;

msgBox.appendChild(div);

});

});