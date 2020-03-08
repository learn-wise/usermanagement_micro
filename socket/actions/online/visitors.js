const { Month, Year } = require('./helper/util');

const {
  ONLINE_VISITORS,
  ONLINE_VISITORS_INITIAL,
  ONLINES_TOTAL_VISIT_LIST,
  VISITORS_MONTHLY_STATE_COUNTRY,
  VISITORS_MONTHLY_STATE_CITY,
  VISITORS_YEARLY_STATE_COUNTRY,
} = require('./store/actionTypes');

const {
  online_Visitors,
  Visitors_State_List,
  online_Visitors_Total_List,
} = require('./store/channels');

module.exports = (socket, redis, PubSub) => {
  PubSub.on('message', async (_channel, message) => {
    if (message === online_Visitors) {
      redis.get(online_Visitors, (_err, reply) => {
        socket.emit(ONLINE_VISITORS, { onlinesCount: reply });
      });
    }
    if (message === online_Visitors_Total_List) {
      redis.hgetall(online_Visitors_Total_List, (_err, reply) => {
        socket.emit(ONLINES_TOTAL_VISIT_LIST, reply);
      });
    }
    if (message === Visitors_State_List) {
      // Map
      redis.hgetall(`visitors:state:country:month:${Year}:${Month}`, (_err, reply) => {
        socket.emit(VISITORS_MONTHLY_STATE_COUNTRY, reply);
      });
      redis.hgetall(`visitors:state:city:month:${Month}`, (_err, reply) => {
        socket.emit(VISITORS_MONTHLY_STATE_CITY, reply);
      });
      redis.hgetall(`visitors:state:country:year:${Year}`, (_err, reply) => {
        socket.emit(VISITORS_YEARLY_STATE_COUNTRY, reply);
      });
    }
  });
  redis.hgetall(online_Visitors_Total_List, (_err, reply) => {
    socket.emit(ONLINES_TOTAL_VISIT_LIST, reply);
  });
  redis.get(online_Visitors, (_err, reply) => {
    socket.emit(ONLINE_VISITORS_INITIAL, { onlinesCount: reply });
  });
};
