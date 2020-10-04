const users = [];

// Adiciona usuário no chat
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

// Retorna o usuário atual
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// Usuário sai do chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Retorna usuários da sala
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };