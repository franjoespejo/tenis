# Tennis game with socket.io

This is the source code for a poc using socket.io as main component for a game system.

The tennis game is composed of two parts.

- Server socket.io (express will also run on it)
- Client unity program

The server with socket.io owns all the logic, and handles all the communication. 

# Deployment


To run the main server (socket.io) 
I assume you have a GNU/Linux Server, with:
-GIT
-NPM
-NODE
-PM2

Therefore you must follow the bellow steps:

- git clone https://github.com/franjoespejo/tenis/
- npm install
- pm2 start index.js
