const cheerio = require('cheerio'),
      Crawler = require('simplecrawler'),
      proxy   = require('./proxy.json');

const specials = ['newyork', 'boston'];

//
// Craigslist spider
// -----------------------------------------------------------------------------

function crawlCraiglist(site, types) {

  // convert to arrays
  var results = {},
      hoods   = Object.keys(site.hoods).map(h => site.hoods[h].short);
      types   = Object.keys(types).map(t => types[t].short);

  // prepare results object
  types.map(type => {
    results[type] = {};

    hoods.map(hood => {
      results[type][hood] = new Promise(resolve => {

        //
        // business logic; gets posts
        //

        let crawler, matchUrl;

        // form URLs for crawler
        if ( /default/.test(hood) ) {
          crawler  = new Crawler(site.url + 'search/' + type);
          matchUrl = new RegExp('\/search\/'+ type +'(\\?s=\d+)?', 'ig');
        } else {
          // change "apa" to "aap" for special cases
          let t    = (specials.indexOf(site.short) > -1 && type == 'apa') ? 'aap' : type;
          crawler  = new Crawler(site.url + 'search/'+ hood +'/'+ t);
          matchUrl = new RegExp('\/search\/'+ hood +'\/'+ t +'(\\?s=\d+)?', 'ig');
        }

        // only fetch links to search results page(s)
        const conditionID = crawler.addFetchCondition((queueItem, referrerQueueItem) => {
          return queueItem.path.match(matchUrl);
        });

        // grab said link with cheerio
        crawler.discoverResources = function(buffer, queueItem) {
          let $ = cheerio.load(buffer.toString('utf-8'));
          return [ $('a.button.next').first().attr('href') ];
        }

        crawler.userAgent       = "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0";
        crawler.maxDepth        = 3;
        crawler.maxConcurrency  = 3;
        crawler.useProxy        = true;
        crawler.proxyHostname   = proxy.host;
        crawler.proxyPort       = proxy.port;
        crawler.proxyUser       = proxy.user;
        crawler.proxyPass       = proxy.pass;

        let posts = [];

        // curate all posts from each page
        crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {

          console.log('Fetched: '+queueItem.url);

          let $ = cheerio.load(responseBuffer.toString('utf-8')),
              link = queueItem.url.replace(queueItem.path, '');

          let newPosts = $('.result-row').get().map(el => {
            return {
              date:   $(el).find('time').attr('datetime'),
              link:   link + $(el).find('.result-info .result-title').attr('href'),
              title:  $(el).find('.result-info .result-title').text(),
              price:  parseInt($(el).find('.result-info .result-price').text().slice(1)) || 0,
              pic:    $(el).has('.result-image.empty').length ? false : true,
              site:   site.short,
              hood:   hood,
              type:   type
            };
          });

          // add newPosts to posts variable
          posts = posts.concat(newPosts);
        });

        crawler.on('complete', () => {
          resolve(posts);
        });

        // start the car
        crawler.start();
      });
    });
  });

  var arr = [];

  Object.keys(results).map(type => {
    Object.keys(results[type]).map(hood => {

      // resolve all promises to fetch posts
      arr.push(results[type][hood].then(posts => {
        results[type][hood] = posts;
      }));
      
    });
  });

  return Promise.all(arr)
    .then(() => {

      // return object with query data
      return {
        site:    site,
        types:   types,
        hoods:   hoods,
        results: results
      }
    });
}

module.exports = {
  crawl: crawlCraiglist
}
