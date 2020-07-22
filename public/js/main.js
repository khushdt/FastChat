const chatForm = document.getElementById('chat-form')  ;
const chatMessages = document.querySelector('.chat-messages') ;

// GET username and room form URL 
const {username  , room } = Qs.parse(location.search , {
    ignoreQueryPrefix : true 
}) ;

const socket = io(); 

//JOIN CHATROOM
    socket.emit('joinRoom' , {username , room}) ;

// message from server
socket.on('message' , message => {
    console.log(message) ;

    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight ;
}) ;

//message submit 

chatForm.addEventListener('submit' , (e)=> {
    e.preventDefault() ;
    //getting message text
    const msg = e.target.elements.msg.value ;

    // emmitin message to server
    socket.emit('chatMessage' , msg) ;

    //clearing input
    e.target.elements.msg.value = '' ;
    e.target.elements.msg.focus() ;
}) ;

//Output message 
function outputMessage (message) {
    const div = document.createElement('div') ;
    div.classList.add('message') ;
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>` ;

    document.querySelector('.chat-messages').appendChild(div) ;
}