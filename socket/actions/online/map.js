const {
  VISITORS_MONTHLY_STATE_COUNTRY,
  VISITORS_YEARLY_STATE_COUNTRY,
} = require('./store/actionTypes');
const { Year, Month, optimizeCollect } = require('./helper/util');

module.exports = (socket, redis) => {
  function countryDetail(_err, reply) {
    reply = optimizeCollect(reply, 5, false);
    reply = JSON.stringify(reply);
    socket.emit('visitorsCountryDetail_receive', reply);
  }
  function topCountry_Visitor(_err, reply) {
    reply = optimizeCollect(reply, 5, true);
    socket.emit('visitorsTopCountry_callback', reply);
  }
  //   TODO: test
  function countryDetail_mock(_err, reply) {
    console.log('countryDetail_mock::', reply);
    let obj = {
      tehran: 100,
      tabriz: 100,
      shiraz: 20,
      Mashad: 10,
      Rasht: 50,
      esfahan: 5,
      Zanjan: 10,
      Qom: 12,
    };
    obj = optimizeCollect(obj, 5);
    obj = JSON.stringify(obj);
    socket.emit('visitorsCountryDetail_receive', obj);
  }

  socket.on('mapType', data => {
    data === 'monthly'
      ? redis.hgetall(`visitors:state:country:month:${Year}:${Month}`, (_err, reply) =>
          socket.emit(VISITORS_MONTHLY_STATE_COUNTRY, reply),
        )
      : redis.hgetall(`visitors:state:country:year:${Year}`, (_err, reply) =>
          socket.emit(VISITORS_YEARLY_STATE_COUNTRY, reply),
        );
  });
  socket.on('visitorsCountryDetail', data => {
    let { countryId, mapType } = data;

    mapType === 'monthly'
      ? redis.hget(`visitors:state:city:month:${Year}:${Month}`, countryId, countryDetail)
      : redis.hget(`visitors:state:city:year:${Year}`, countryId, countryDetail);
  });
  socket.on('visitorsTopCountry', ({ mapType }) => {
    mapType === 'monthly'
      ? redis.hgetall(`visitors:state:country:month:${Year}:${Month}`, topCountry_Visitor)
      : redis.hgetall(`visitors:state:country:year:${Year}`, topCountry_Visitor);
  });
};
