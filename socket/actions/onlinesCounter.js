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
  
let Year = moment().format('Y')
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
  VISITORS_MONTHLY_STATE_COUNTRY,
  VISITORS_MONTHLY_STATE_CITY
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
    Month                      = moment().format('M'),
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

        redis.hgetall(`visitors:state:country:month:${Year}:${Month}`,(err,reply)=>{
          socket.emit(VISITORS_MONTHLY_STATE_COUNTRY,reply)
        })
        redis.hgetall(`visitors:state:city:month:${Month}`,(err,reply)=>{
          socket.emit(VISITORS_MONTHLY_STATE_CITY,reply)
        })
    }
  })

  //  visitors distribution[ Map ]
  redis.hgetall(`visitors:state:country:month:${Year}:${Month}`,(err,reply)=>{
    console.log(reply)
    let obj = { IR: '1000', US: '600',GL:'100',RU:'50'}
    socket.emit(VISITORS_MONTHLY_STATE_COUNTRY,obj)
  })
  redis.hgetall(`visitors:state:city:month:${Year}:${Month}`,(err,reply)=>{
    // console.log(reply)
    let obj = {}
    socket.emit(VISITORS_MONTHLY_STATE_CITY,obj)
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
  socket.on("visitorsCountryDetail",countryId=>{
    redis.hget( `visitors:state:city:month:${Year}:${Month}`, countryId, (err,reply)=>{
        let obj =  { tehran : 100 , tabriz : 10 , shiraz: 5, Mashad:500 , Rasht:50 }
        obj = JSON.stringify(obj)
      socket.emit('visitorsCountryDetail_receive',obj)
      // socket.emit('visitorsCountryDetail_receive',reply)
      })
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
