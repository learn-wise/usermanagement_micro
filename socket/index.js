const io = require('socket.io')();
const onlinesCounter = require('./actions/onlinesCounter')
// const redisAdapter = require('socket.io-redis');
// io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

const usersSocket = io.of('/users')
const visitorsSocket = io.of('/visitors')

usersSocket.on('connection', (socket) => {
  onlinesCounter.users(socket)
});

visitorsSocket.on('connection', (socket) => {
  onlinesCounter.visitors(socket)
});

io.on('connection', (socket) => {

  console.log('socket connected...')
  onlinesCounter.connect()

  socket.on('disconnect', (reason) => { 
    console.log('socket disconnected...')
    onlinesCounter.disconnect()
  });
  
});

io.listen(8000);
console.log('Socket Server listening on port::', 8000);