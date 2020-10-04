const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Pega o nome do aluno e sala
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Aluno enrou na sala
socket.emit('joinRoom', { username, room });

// Pega sala e alunos
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Mensagem do servidor
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Rolagem para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Envio de mensagem
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Pega texto da mensagem
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Manda mensagem pro servidor
  socket.emit('chatMessage', msg);

  // Limpa campo da mensagem
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Exibir mensagem na tela
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Adiciona nome da sala na tela
function outputRoomName(room) {
  roomName.innerText = room;
}

// Adiciona alunos na tela
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
