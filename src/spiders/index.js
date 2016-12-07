const _      = require('lodash'),
      redis  = require('redis'),
      client = redis.createClient();

      client.on('error', (err) => console.error(err));

const Search     = require('./core/sequelize'),
      dispatch   = require('./core/dispatch'),
      craigslist = require('./core/craigslist'),
      roster     = require('./core/roster.json'),
      types      = require('./core/types.json');


//
// Was Spinnen machen
// -----------------------------------------------------------------------------
function crawl() {

  // client.flushall();
  
  return Object.keys(roster).map(site => {
    return () => {
      return craigslist.crawl(roster[site], types)
       .then(handleSite);
    };
  })
  .reduce((p, fn) => p.then(fn), Promise.resolve())
  .then(() => dispatch(data))
  .catch(err => console.error(err));
}

var data = [];
function prepareMessages(key, posts, criteria) {
  //
  // add to message queue
  //
  
  return new Promise((resolve, reject) => {
    client.lrange(key, 0, -1, (err, oldPosts) => {
      oldPosts = oldPosts.map(p => JSON.parse(p));

      if (!err) {
        let c        = _.mapValues(criteria, o => o.short),
            updates  = _.differenceBy(posts, oldPosts, 'link'),
            matching = searches.filter(search => {
            return _.isEqual(c, _.pick(search.criteria, ['site','type','hood']));
        });

        if (updates.length && matching.length) {
          data = data.concat({
            criteria: criteria, //
            updates:  updates,  // updates (e.g., sfbay:roo:sfc)
            searches: matching  // ...send to these addresses
          });
        }
      }
      resolve({ key: key, posts: posts }); // pass key and posts to pushToRedis()
    });
  });
}

function pushToRedis(c) {
  //
  // updates new posts to redis
  //

  return new Promise(resolve => {
    if (!c.posts.length) return resolve(console.error(c.key +' -- 0 items. Skipping push to Redis.'));
    client.del(c.key); // flush posts at key
    for (let i in c.posts) { client.rpush(c.key, JSON.stringify(c.posts[i])); } // add new posts
    client.lrange(c.key, 0, -1, (err, res) => resolve(console.log(c.key + ' -> ' + res.length + ' items'))); // confirm
  });
}

function handleSite(results) {
  //
  // redis / email
  //

  let promises = [];

  results.types.forEach(type => {
    results.hoods.forEach(hood => {
      
      let key      = ['posts', results.site.short, type.short, hood.short].join(':'),
          posts    = _.uniqBy(results['posts'][type.short][hood.short], p => p.title), // filter duplicates
          criteria = {
            site: results.site,
            type: type,
            hood: hood
          };

      promises.push(
        prepareMessages(key, posts, criteria)
        .then(pushToRedis)
      );
    });
  });
  
  return Promise.all(promises);
}

var searches = [];
function parseSearches(res) {
  //
  // parses search entries from sqlite
  //

  if (res) { searches = res.map(s => {
    s.dataValues.criteria = JSON.parse(s.criteria);
    s.dataValues.criteria.min = parseInt(s.dataValues.criteria.min);
    s.dataValues.criteria.max = parseInt(s.dataValues.criteria.max);
    return s.dataValues;
  }); }
}

function quit() {
  //
  // party's over
  //

  console.timeEnd('Total runtime');
  client.quit();
}

console.time('Total runtime');
Search.findAll()
.then(parseSearches)
.then(crawl)
.then(quit);
