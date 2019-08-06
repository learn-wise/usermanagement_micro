const io = require('socket.io')();
const onlinesCounter = require('./actions/onlinesCounter')

// Users_Socket
const usersSocket = io.of('/users')
usersSocket.on('connection', (socket) => {
  onlinesCounter.users(socket)
});

io.listen(8000);
console.log('Socket Server listening on port::', 8000);