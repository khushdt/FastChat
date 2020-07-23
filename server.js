const path = require('path') ;
const http = require('http') ;
const express = require('express') ;
const socketio = require('socket.io') ;
const formatMessage = require('./utils/messages');
const {userJoin , getCurrentUser , userLeave , getRoomUsers} = require('./utils/users')

const app = express() ;
const server = http.createServer(app) ;
const io = socketio(server) ; 

//set static folder
app.use(express.static(path.join(__dirname, 'public'))); 

const botName = 'FastChat Bot' ;

// run when a client connects

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
  
      socket.join(user.room);
  
      // Welcome current user
      socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
  
      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(botName, `${user.username} has joined the chat`)
        );
  
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });
  
    
    // listern for chatmessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
    
        io.to(user.room).emit('message', formatMessage(user.username, msg));
      });

     // when disconnecting
     socket.on('disconnect' , ()=> {
        const user = userLeave(socket.id) ;

        if(user){
            io.to(user.room).emit('message' , formatMessage( botName ,` ${user.username} has left the room `)) ;
        }
    }) ;

}) ;

const PORT = process.env.PORT || 3000;
server.listen(PORT , ()=> console.log('Server is running on 3000 ')) ;
