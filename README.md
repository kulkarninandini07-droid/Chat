CYBERCHAT

A real-time web chat application built using Flask, Flask-SocketIO, and Supabase that allows users to log in and communicate instantly.

The system uses WebSockets for live communication and Supabase for authentication/database integration.

Features


1. User Login System


2. Real-Time Messaging


3. Instant message broadcasting using Socket.IO


4. Web-based interface


5. Structured backend and frontend architecture


6. Supabase integration for backend services



Tech Stack


Backend

1. Python

2. Flask

3. Flask-SocketIO

4. Supabase

Frontend

1. HTML

2. CSS

3. JavaScript

4. Socket.IO Client


Project Structure

CHAT

[i] backend

  a. app
   1. __init__.py
   2. commands.py
   3. config.py
   4. routes.py
   5. sockets.py
   6. supabase_client.py

  b. __pycache__
  
       run.py

[ii] frontend

   a. app.js
   
   b. index.html
   
   c. login.html
   
   d. style.css



Setup Instructions

1️. Clone the Repository

git clone https://github.com/your-username/chat-app.git

cd chat-app

2️. Install Required Libraries

pip install flask flask-socketio supabase

3️. Configure Supabase


Open:


backend/app/supabase_client.py


Add your credentials:


from supabase import create_client


SUPABASE_URL = "your_supabase_url"

SUPABASE_KEY = "your_supabase_key"


supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

 Run the Application


Go inside backend folder and run:


python run.py


Server will start on:


http://127.0.0.1:5000


How It Works


a. User opens login.html


b. User enters username


c. User joins the chat system


d. Messages are sent through Socket.IO


e. Server broadcasts messages to all connected users in real-time


Concepts Demonstrated


a. WebSockets


b. Real-time communication


c. Client-server architecture


d. Event-driven programming


e. Backend API routing


f. Authentication with Supabase


Future Improvements


a. Chat rooms


b. Message history


c. User authentication with passwords


d. File sharing


e. Typing indicators


f. Online user list


Author

Team Supernova
