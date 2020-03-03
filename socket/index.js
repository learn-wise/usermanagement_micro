const session = require('express-session');
const io = require('socket.io')();
let sessionMiddleware = session({
  secret: '930611040afsan_nightmare',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
});
io.use((socket, next) => sessionMiddleware(socket.request, {}, next));
const onlinesCounter = require('./actions/onlineCounter');
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

const usersSocket = io.of('/users');
const visitorsSocket = io.of('/visitors');

usersSocket.on('connection', socket => onlinesCounter.users(socket));

visitorsSocket.on('connection', socket => onlinesCounter.visitors(socket));

io.on('connection', socket => {
  onlinesCounter.connect();
  socket.on('disconnect', _reason => onlinesCounter.disconnect());
});

io.listen(8000);
console.clear();
console.log('Socket Server listening on port::', 8000);
