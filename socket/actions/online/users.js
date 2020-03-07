const col = require('chalk');
/* eslint-disable default-case */
const {
  ONLINES_INITIAL,
  USERS_ONLINE,
  ONLINES_TOTAL_LIST,
  ONLINES_LIST,
  TOTAL_USERS_LIST,
  TOTAL_VERIFIED_USERS_LIST,
} = require('./store/actionTypes');

const {
  online_Users_List,
  online_Users_Total_List,
  online_Users_Count,
  Total_Users_Count,
  Total_Verified_User,
} = require('./store/channels');

module.exports = (socket, redis, PubSub) => {
  PubSub.on('message', (channel, message) => {
    console.log(
      col.bold.dim('-->>'),
      col.bold.green(message),
      col.italic.cyanBright.bold(channel.split(':')[1]),
    );
    switch (message) {
      case online_Users_Count:
        redis.get(message, (_err, reply) => socket.emit(USERS_ONLINE, { onlinesCount: +reply }));
        break;
      case online_Users_List:
        redis.hgetall(online_Users_Total_List, (_err, reply) => {
          socket.emit(ONLINES_TOTAL_LIST, reply);
        });
        break;
      case Total_Users_Count:
        redis.hgetall(Total_Users_Count, (_err, reply) => {
          socket.emit(TOTAL_USERS_LIST, reply);
        });
        break;
      case Total_Verified_User:
        redis.hgetall(Total_Verified_User, (_err, reply) => {
          socket.emit(TOTAL_VERIFIED_USERS_LIST, reply);
        });
        break;
    }
  });
  redis.hgetall(Total_Users_Count, (_err, reply) => {
    socket.emit(TOTAL_USERS_LIST, reply);
  });
  redis.hgetall(Total_Verified_User, (_err, reply) => {
    socket.emit(TOTAL_VERIFIED_USERS_LIST, reply);
  });

  redis.hgetall(online_Users_Total_List, (_err, reply) => {
    socket.emit(ONLINES_TOTAL_LIST, reply);
  });

  // initial count
  redis.get(online_Users_Count, (_err, reply) => {
    socket.emit(ONLINES_INITIAL, { onlinesCount: +reply });
  });

  // Users Online List Per Day
  redis.scard(online_Users_List, (_err, reply) => {
    socket.emit(ONLINES_LIST, { onlinesListCount: +reply });
  });

  //users online list initial numbers
  redis.hgetall(online_Users_Total_List, (_err, reply) => {
    socket.emit(ONLINES_TOTAL_LIST, reply);
  });
};
