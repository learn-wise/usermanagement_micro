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
  lookup = require('country-code-lookup'),
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
  VISITORS_MONTHLY_STATE_CITY,
  VISITORS_YEARLY_STATE_COUNTRY,
} = require('./actionTypes');

const optimizeCollect = (collection,limit,normalize)=>{
  if(!collection){ return {} }
  if(typeof collection === 'string'){
    collection = JSON.parse(collection)
  }
  let totalSum = Object.values(collection).reduce((sum, num) =>Number(sum) + Number(num));
  let arrContainer= []
  for(let el in collection){
      let obj = {}
      obj.count   = collection[el]
      normalize
        ?obj.region  = lookup.byInternet(el).country
        :obj.region  = el;
      obj.percent = +( ( collection[el] / totalSum ) * 100 ).toFixed(0)
      arrContainer.push(obj)
  }
  function compare( a, b ) {
    if ( a.percent < b.percent ){return 1;}
    if ( a.percent > b.percent ){return -1}
    return 0;
  }
  let newCollection = arrContainer.sort(compare)
  return newCollection.slice(0,limit)  
}
Onlines.users =(socket)=> {
  const Day                 = moment().format('YYYY/MM/D'),
    online_Users_List       = `online:users:list:${Day}`,
    online_Users_Total_List = 'online:users:TList',
    online_Users_Count      = 'online:users:count',
    Total_Users_Count       = "total:users:TList",
    Total_Verified_User     = "total:Verified:UserList";
  // online counter
  PubSub.on("message", (channel, message) => {
    console.log("-->>",message,channel)
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

      // Map 
      redis.hgetall(`visitors:state:country:month:${Year}:${Month}`,(err,reply)=>{
        socket.emit(VISITORS_MONTHLY_STATE_COUNTRY,reply)
      })
      redis.hgetall(`visitors:state:city:month:${Month}`,(err,reply)=>{
        socket.emit(VISITORS_MONTHLY_STATE_CITY,reply)
      })
      redis.hgetall(`visitors:state:country:year:${Year}`,(err,reply)=>{
        socket.emit(VISITORS_YEARLY_STATE_COUNTRY,reply)
      })
    }
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
  
  
  //  Map 
  socket.on('mapType',data=>{
    (data === 'monthly')
      ?redis.hgetall(`visitors:state:country:month:${Year}:${Month}`,(err,reply)=>
        socket.emit(VISITORS_MONTHLY_STATE_COUNTRY,reply) )
      :redis.hgetall(`visitors:state:country:year:${Year}`,(err,reply)=>
        socket.emit(VISITORS_YEARLY_STATE_COUNTRY,reply)  )
  })
  socket.on("visitorsCountryDetail",data=>{
    let {countryId,mapType} = data
    function countryDetail(err,reply){
      reply = optimizeCollect(reply,5,false)
      reply = JSON.stringify(reply)
      socket.emit('visitorsCountryDetail_receive',reply)
    }
    function countryDetail_mock(err,reply){
      console.log('countryDetail_mock::',reply)
      let obj =  { tehran : 100 , tabriz : 100 , shiraz: 20, Mashad:10 , Rasht:50,esfahan:5, Zanjan:10,Qom:12 }
        obj = optimizeCollect(obj,5)
        obj = JSON.stringify(obj)
      socket.emit('visitorsCountryDetail_receive',obj)
    }    
    mapType === "monthly"
      ?redis.hget( `visitors:state:city:month:${Year}:${Month}`,countryId,countryDetail)
      :redis.hget( `visitors:state:city:year:${Year}`,countryId,countryDetail)

  })
  socket.on('visitorsTopCountry',({mapType})=>{
    function topCountry_Visitor(err,reply){
      reply = optimizeCollect(reply,5,true)
      socket.emit("visitorsTopCountry_callback",reply)
    }
    (mapType === 'monthly')
      ?redis.hgetall(`visitors:state:country:month:${Year}:${Month}`,topCountry_Visitor)
      :redis.hgetall(`visitors:state:country:year:${Year}`,topCountry_Visitor)
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
