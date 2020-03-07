const Redis = require('redis');
const PubSub = require('../util/pubSub');
const redis = Redis.createClient({
  retry_strategy: function(options) {
    if (options.error && options.error.code === 'ECONNREFUSED')
      return new Error('The server refused the connection');
    if (options.total_retry_time > 1000 * 60 * 60) return new Error('Retry time exhausted');
    if (options.attempt > 10) return undefined;
    return Math.min(options.attempt * 100, 3000);
  },
}).setMaxListeners(0);

const redisListener = redis.duplicate().setMaxListeners(100);
const Onlines = {};
const usersSockets = require('./online/users');
const visitorsSockets = require('./online/visitors');
const mapSockets = require('./online/map');

Onlines.keyEvents = ['sadd', 'incrby', 'hincrby', 'hset'];

Onlines.users = socket => usersSockets(socket, redis, PubSub);

Onlines.visitors = socket => {
  visitorsSockets(socket, redis, PubSub);
  mapSockets(socket, redis, PubSub);
};

Onlines.disconnect = _socket =>
  PubSub.unsubscribe(Onlines.keyEvents.map(el => `__keyevent@0__:${el}`));

Onlines.connect = _socket => {
  redisListener.config('SET', 'notify-keyspace-events', 'Eh$s');
  Onlines.keyEvents.forEach(el => PubSub.subscribe(`__keyevent@0__:${el}`));
};

module.exports = Onlines;
