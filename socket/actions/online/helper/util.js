const lookup = require('country-code-lookup');
const moment = require('moment');

const Day = moment().format('YYYY/MM/D');
const Month = moment().format('M');
const Year = moment().format('Y');

const optimizeCollect = (collection, limit, normalize) => {
  if (!collection) return {};
  if (typeof collection === 'string') collection = JSON.parse(collection);
  let totalSum = Object.values(collection).reduce((sum, num) => Number(sum) + Number(num));
  let arrContainer = [];
  for (let el in collection) {
    let obj = {};
    obj.count = collection[el];
    normalize ? (obj.region = lookup.byInternet(el).country) : (obj.region = el);
    obj.percent = +((collection[el] / totalSum) * 100).toFixed(0);
    arrContainer.push(obj);
  }
  function compare(a, b) {
    if (a.percent < b.percent) return 1;
    if (a.percent > b.percent) return -1;
    return 0;
  }
  let newCollection = arrContainer.sort(compare);
  return newCollection.slice(0, limit);
};

module.exports = { optimizeCollect, Day, Month, Year };
