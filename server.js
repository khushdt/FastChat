const path = require('path') ;
const http = require('http') ;
const express = require('express') ;
const socketio = require('socket.io') ;

const app = express() ;
const server = http.createServer(app) ;
const io = socketio(server) ; 

//set static folder
app.use(express.static(path.join(__dirname, 'public'))); 

// run when a client connects

io.on('connection' , socket => {
    
    //welcome new user
    socket.emit('message' , 'Welcome to FastChat') ;
    //when a user connects
    socket.broadcast.emit('message' , 'a user has joined the chat');

    // when disconnecting
    socket.on('disconnect' , ()=> {
        io.emit('message' , 'a user has left the chat') ;
    }) ;
 
    // listern for chatmessage
    socket.on('chatMessage' , msg => {
        io.emit('message' , msg) ;
    }) ;


}) ;

const PORT = 3000  ;

server.listen(PORT , ()=> console.log('Server is running on 3000 ')) ;
