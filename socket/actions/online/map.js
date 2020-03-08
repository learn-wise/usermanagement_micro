const { fromEvent } = require('rxjs');
const { switchMap } = require('rxjs/operators');
const { promisify } = require('util');

const {
  VISITORS_MONTHLY_STATE_COUNTRY,
  VISITORS_YEARLY_STATE_COUNTRY,
} = require('./store/actionTypes');

const { Year, Month, optimizeCollect } = require('./helper/util');

module.exports = (socket, redis) => {
  const redis_Hget = promisify(redis.hget).bind(redis);
  const redis_Hgetall = promisify(redis.hgetall).bind(redis);

  fromEvent(socket, 'mapType')
    .pipe(
      switchMap(
        data =>
          data === 'monthly'
            ? redis_Hgetall(`visitors:state:country:month:${Year}:${Month}`)
            : redis_Hgetall(`visitors:state:country:year:${Year}`),
        (oVal, iVal) => {
          oVal === 'monthly'
            ? socket.emit(VISITORS_MONTHLY_STATE_COUNTRY, iVal)
            : socket.emit(VISITORS_YEARLY_STATE_COUNTRY, iVal);
        },
      ),
    )
    .subscribe();

  fromEvent(socket, 'visitorsTopCountry')
    .pipe(
      switchMap(({ mapType }) =>
        mapType === 'monthly'
          ? redis_Hgetall(`visitors:state:country:month:${Year}:${Month}`)
          : redis_Hgetall(`visitors:state:country:year:${Year}`),
      ),
    )
    .subscribe(data => {
      if (data) socket.emit('visitorsTopCountry_callback', optimizeCollect(data, 5, true));
    });

  fromEvent(socket, 'visitorsCountryDetail')
    .pipe(
      switchMap(({ countryId, mapType }) =>
        mapType === 'monthly'
          ? redis_Hget(`visitors:state:city:month:${Year}:${Month}`, countryId)
          : redis_Hget(`visitors:state:city:year:${Year}`, countryId),
      ),
    )
    .subscribe(data => {
      if (data) {
        data = JSON.stringify(optimizeCollect(data, 5, false));
        socket.emit('visitorsCountryDetail_receive', data);
      }
    });
};

// -->>test
// function countryDetail_mock(_err, reply) {
//   console.log('countryDetail_mock::', reply);
//   let obj = {
//     tehran: 100,
//     tabriz: 100,
//     shiraz: 20,
//     Mashad: 10,
//     Rasht: 50,
//     esfahan: 5,
//     Zanjan: 10,
//     Qom: 12,
//   };
//   obj = optimizeCollect(obj, 5);
//   obj = JSON.stringify(obj);
//   socket.emit('visitorsCountryDetail_receive', obj);
// }
