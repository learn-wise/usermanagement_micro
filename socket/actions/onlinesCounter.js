const 
  Redis = require('redis'),
  PubSub = require('../util/pubsub'),
  redis = Redis.createClient({
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') { return new Error('The server refused the connection'); }
        if (options.total_retry_time > 1000 * 60 * 60) { return new Error('Retry time exhausted'); }
        if (options.attempt > 10) { return undefined; }
        return Math.min(options.attempt * 100, 3000);
    }
  }).setMaxListeners(0),
  moment = require('moment'),
  Onlines = {};
  
let {
  ONLINES_INITIAL,
  USERS_ONLINE,
  ONLINES_TOTAL_LIST,
  ONLINES_LIST,
  ONLINE_VISITORS,
  ONLINE_VISITORS_INITIAL,
  ONLINES_TOTAL_VISIT_LIST,
  TOTAL_USERS_LIST,
  TOTAL_VERIFIED_USERS_LIST,
  VISITORS_MONTHLY_STATE,
} = require('./actionTypes');

Onlines.users =(socket)=> {
  const Day                 = moment().format('YYYY/MM/D'),
    online_Users_List       = `online:users:list:${Day}`,
    online_Users_Total_List = 'online:users:TList',
    online_Users_Count      = 'online:users:count',
    Total_Users_Count       = "total:users:TList",
    Total_Verified_User     = "total:Verified:UserList";
  // online counter
  PubSub.on("message", (channel, message) => {
    console.log("-->>",message)
    if (message === online_Users_Count) {
      redis.get(message, (err, reply) => { 
        socket.emit(USERS_ONLINE,{onlinesCount:+reply}) 
      })
    }
    if(message === online_Users_List){
      console.log('>>>>>')
        redis.hgetall(online_Users_Total_List,(err,reply)=>{ socket.emit(ONLINES_TOTAL_LIST,reply) })
    }
    if(message === Total_Users_Count){
      redis.hgetall(Total_Users_Count,(err,reply)=>{ 
        socket.emit(TOTAL_USERS_LIST,reply)
      })
    }
    if(message === Total_Verified_User){
      redis.hgetall(Total_Verified_User,(err,reply)=>{ 
        socket.emit(TOTAL_VERIFIED_USERS_LIST,reply)
      })
    }
    
  })
  redis.hgetall(Total_Users_Count,(err,reply)=>{ 
    socket.emit(TOTAL_USERS_LIST,reply)
  })

  redis.hgetall(Total_Verified_User,(err,reply)=>{ 
    socket.emit(TOTAL_VERIFIED_USERS_LIST,reply)
  })

  redis.hgetall(online_Users_Total_List,(err,reply)=>{
    socket.emit(ONLINES_TOTAL_LIST,reply)
  })

  // initial count
  redis.get(online_Users_Count,(err,reply)=>{
      socket.emit(ONLINES_INITIAL,{onlinesCount:+reply})
  })

  // Users Online List Per Day
  redis.scard( online_Users_List ,(err,reply)=>{
      socket.emit(ONLINES_LIST,{onlinesListCount:+reply})
  })

  //users online list initial numbers
  redis.hgetall(online_Users_Total_List,(err,reply)=>{
    socket.emit(ONLINES_TOTAL_LIST,reply)
  })
}
Onlines.visitors = (socket)=> {

  const Day                    = moment().format('YYYY/MM/D'),
    online_Visitors            = 'online:count',
    online_Visitors_List       = `online:visitors:Clist:${Day}`,
    online_Visitors_Total_List = 'online:visitors:TList';

  PubSub.on("message", async (channel, message) => {
    if(message === online_Visitors){
      redis.get(online_Visitors,(err,reply)=>{
        socket.emit(ONLINE_VISITORS,{onlinesCount:reply})
      })
    }
    
    if(message === online_Visitors_List){
      redis.multi()
        .hincrby( online_Visitors_Total_List , Day , 1)
        .hgetall(online_Visitors_Total_List)
        .exec((err,reply)=>{ socket.emit(ONLINES_TOTAL_VISIT_LIST,reply[1]) })

        redis.hgetall(`visitors:state:month:${moment().format('M')}`,(err,reply)=>{
          socket.emit(VISITORS_MONTHLY_STATE,reply)
        })
    }
  })

  //  visitors distribution[ Map ]
  redis.hgetall(`visitors:state:month:${moment().format('M')}`,(err,reply)=>{
    let obj = { 
      "count:IR": '1', 
      "count:US": '1',
      "count:NL": '5',
      "count:RU":"50000",
      "IR:Tabriz": '1',
      "IR:Tehran":"5",
      "IR:Mashad":"10",
      "RU:Africa":"5"
    }
    socket.emit(VISITORS_MONTHLY_STATE,obj)
  })
  redis.scard(online_Visitors_List,(err,count)=>{
    if(+count>0){
      redis.multi()
        .hset(online_Visitors_Total_List , Day , count)
        .hgetall(online_Visitors_Total_List)
        .exec((err,reply)=>{ 
          if(Array.isArray(reply)){ socket.emit(ONLINES_TOTAL_VISIT_LIST,reply[1]) }
          })
    }
  })
  redis.get(online_Visitors,(err,reply)=>{
    socket.emit(ONLINE_VISITORS_INITIAL,{onlinesCount:reply})
  })
}
Onlines.disconnect=(socket)=>{
  PubSub.unsubscribe([
    "__keyevent@0__:sadd",
    "__keyevent@0__:incrby",
    "__keyevent@0__:hincrby"
  ])
}
Onlines.connect=(socket)=>{
  redis.on('ready',()=>{ redis.config('SET',"notify-keyspace-events","Eh$s") })
  PubSub.subscribe("__keyevent@0__:sadd")
  PubSub.subscribe("__keyevent@0__:incrby")
  PubSub.subscribe("__keyevent@0__:hincrby")
}
module.exports=Onlines;
