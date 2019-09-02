const Redis = require('redis')
// const subscriber = Redis.createClient()
const subscriber  = Redis.createClient().setMaxListeners(100);

const pubSubClass = class PubSub {
    // publish(channel, message) {
    //     publisher.publish(channel, message)
    // }

    subscribe(channel) {
        subscriber.subscribe(channel)
    }
    unsubscribe(){
        subscriber.removeAllListeners()
    }
    on(event, cb) {
        subscriber.on(event, (channel, message) => {
            cb(channel, message)
        })
    }
};

module.exports = new pubSubClass();