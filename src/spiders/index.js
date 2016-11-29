const _      = require('lodash'),
      redis  = require('redis'),
      client = redis.createClient();

client.on('error', (err) => console.error(err));

const craigslist = require('./craigslist'),
      roster     = require('./roster.json'),
      types      = require('./types.json');

//
// Was Spinnen machen
// -----------------------------------------------------------------------------
function crawl() {

  // client.flushall();

  console.time('Total runtime');
  
  return Object.keys(roster).map(site => {
    return () => {
      return craigslist.crawl(roster[site], types)
      .then(pushToRedis);
    };
  })
  .reduce((p, fn) => p.then(fn), Promise.resolve())
  .then(() => {
    console.timeEnd('Total runtime');
  })
  .catch(err => console.error(err));
}

function pushToRedis(query) {

  // "query" contains site, types, and results

  query.types.forEach(type => {
    query.hoods.forEach(hood => {

      let key  = ['posts', query.site.short, type, hood].join(':'),
          data = _.uniqBy(query['results'][type][hood], o => o.title); // filter duplicates

      client.del(key);
      
      for (let i in data) { // feed results to Redis
        client.rpush(key, JSON.stringify(data[i]));
      }

      client.lrange(key, 0, -1, (err, res) => {
        console.log(key + ' -> ' + res.length + ' items');
      });

    });
  });
}

crawl().then(() => client.quit());

module.exports = crawl;
