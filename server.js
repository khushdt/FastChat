const path = require('path') ;
const http = require('http') ;
const express = require('express') ;
const socketio = require('socket.io') ;
const formatMessage = require('./utils/messages');

const app = express() ;
const server = http.createServer(app) ;
const io = socketio(server) ; 

//set static folder
app.use(express.static(path.join(__dirname, 'public'))); 

const botName = 'FastChat Bot' ;

// run when a client connects

io.on('connection' , socket => {
    
    socket.on('joinRoom' , ({username , room}) => {

            
    //welcome new user
    socket.emit('message' , formatMessage( botName ,'Welcome to FastChat')) ;
    //when a user connects
    socket.broadcast.emit('message' , formatMessage( botName ,'a user has joined the chat'));
    }) ;
    
    // listern for chatmessage
    socket.on('chatMessage' , msg => {
        io.emit('message' , formatMessage( 'USER' , msg) );
    }) ;

     // when disconnecting
     socket.on('disconnect' , ()=> {
        io.emit('message' , formatMessage( botName ,'a user has left the chat')) ;
    }) ;

}) ;

const PORT = 3000  ;

server.listen(PORT , ()=> console.log('Server is running on 3000 ')) ;
