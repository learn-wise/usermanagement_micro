const Redis = require('redis')
const subscriber = Redis.createClient();
const publisher  = Redis.createClient();

const pubSubClass = class PubSub {
    publish(channel, message) {
        publisher.publish(channel, message)
    }

    subscribe(channel) {
        subscriber.subscribe(channel)
    }

    on(event, cb) {
        subscriber.on(event, (channel, message) => {
            cb(channel, message)
        })
    }
};

module.exports = new pubSubClass();