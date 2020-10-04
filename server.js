const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Definindo o diretório público
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Grupou! Bot';

// Quando usuários conectam...
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Mensagem de boas-vindas ao usuário
        socket.emit('message', formatMessage(botName, 'Bem vindo ao Grupou!'));

        // Transmite quando um usuário conecta
        socket.broadcast.to(user.room).emit(
            'message',
            formatMessage(botName, `${user.username} entrou no chat.`)
        );

        // Informação sobre usuários e sala
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen as mensagens do chat
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Executa quando um usuário desconecta
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} saiu do chat.`)
            );

            // Informação sobre usuários e sala
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server executando na porta ${PORT}`));