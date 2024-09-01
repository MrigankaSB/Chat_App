const chatform = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});



const socket = io();

///join chat room
socket.emit('joinRoom', { username, room })

//get room and users
socket.on('roomusers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

//message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatform.addEventListener('submit', (e) => {
    e.preventDefault();


    const msg = e.target.elements.msg.value;

    //emit message to server
    socket.emit('chatMessage', msg)

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})


//output message to dom
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<div class = "card" style = "padding: 1em;"><h5 class="card-title">${message.username} <span>${message.time}</span></h5>
    <p class="card-text">${message.text}
    </p></div>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to dom

function outputRoomName(room) {
    roomName.innerText = room;

}

//add users to dom
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
