const redis      = require('redis'),
      client     = redis.createClient();

const craigslist = require('./craigslist'),
      roster     = require('./roster.json'),
      types      = require('./types.json');

////
client.on('error', (err) => {
  console.log(err);
});
////

function crawl() {
  // client.flushall();

  console.time('Total runtime');

  //
  // the big show
  //
  
  Object.keys(roster).map(site => {
    return () => {
      return craigslist.crawl(roster[site], types)
      .then(pushToRedis);
    };
  })
  .reduce((p, fn) => p.then(fn), Promise.resolve())
  .then(() => {
    console.timeEnd('Total runtime');
  })
  .catch(e => console.log(e));
}

function pushToRedis(query) {

  // "query" contains site, types, and results

  query.types.forEach(type => {
    query.hoods.forEach(hood => {

      let key  = ['posts', query.site.short, type, hood].join(':'),
          data = query['results'][type][hood];

      client.del(key);
      
      // feed results to Redis
      for (let i in data) {
        client.rpush(key, JSON.stringify(data[i]));
      }

      client.lrange(key, 0, -1, (err, res) => {
        console.log(key + ' -> ' + res.length + ' items');
      });

    });
  });
}

crawl();

module.exports = crawl;
