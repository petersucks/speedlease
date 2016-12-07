const cheerio = require('cheerio'),
      Crawler = require('simplecrawler'),
      proxy   = require('./proxy.json');

//
// Craigslist spider
// -----------------------------------------------------------------------------
function crawlCraiglist(site, types) {

  var posts = {}, // convert to arrays
      hoods = Object.keys(site.hoods).map(h => site.hoods[h]);
      types = Object.keys(types).map(t => types[t]);

  const specials = ['newyork', 'boston']; // these have special URLs (not 'apa')

  types.map(type => {
    posts[type.short] = {};

    hoods.map(hood => {
      posts[type.short][hood.short] = new Promise(resolve => {
        //
        // business logic; gets posts
        //

        let crawler, matchUrl, results = [];

        // form URLs for crawler
        if ( /default/.test(hood) ) {
          crawler  = new Crawler(site.url + 'search/' + type.short);
          matchUrl = new RegExp('\/search\/'+ type.short +'(\\?s=\d+)?', 'ig');

        } else {
          // change "apa" to "aap" for special cases
          let t    = (specials.indexOf(site.short) > -1 && type.short == 'apa') ? 'aap' : type.short;
          crawler  = new Crawler(site.url + 'search/'+ hood.short +'/'+ t);
          matchUrl = new RegExp('\/search\/'+ hood.short +'\/'+ t +'(\\?s=\d+)?', 'ig');
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

        crawler.userAgent         = "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0";
        crawler.respectsRobotsTxt = false;
        crawler.maxDepth          = 2;
        crawler.maxConcurrency    = 3;
        crawler.interval          = 3000;
        crawler.useProxy          = true;
        crawler.proxyHostname     = proxy.host;
        crawler.proxyPort         = proxy.port;
        // crawler.proxyUser         = proxy.user;
        // crawler.proxyPass         = proxy.pass;

        // curate all posts from each page
        crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {

          console.log('Fetched: '+queueItem.url);

          let $    = cheerio.load(responseBuffer.toString('utf-8')),
              link = queueItem.url.replace(queueItem.path, '');

          let additions = $('.result-row').get().map(el => {

            // just jQuery things
            let xDate   = $(el).find('time').attr('datetime'),
                xLink   = link + $(el).find('.result-info .result-title').attr('href'),
                xTitle  = $(el).find('.result-info .result-title').text(),
                xLocale = $(el).find('.result-info .result-hood').text()
                          ? $(el).find('.result-info .result-hood').text().trim().slice(1, -1)
                          : '',
                xPrice  = parseInt($(el).find('.result-info .result-price').text().slice(1)) || 0,
                xPic    = $(el).has('.result-image.empty').length ? false : true;
                // xThumb = $(el).find('.result-image').attr('data-ids')
                //          ? 'https://images.craigslist.org/' + $(el).find('.result-image').attr('data-ids').split(',')[0].slice(2)
                //          : false;

            return {
              date:   xDate,
              link:   xLink,
              title:  xTitle,
              locale: xLocale,
              price:  xPrice,
              pic:    xPic,
              site:   site.short,
              hood:   hood.short,
              type:   type.short
            };
          });

          results = results.concat(additions); // add newPosts to posts variable
        });

        crawler.on('fetch404', (queueItem, responseObject) => console.error('Error 404: '+ queueItem.url));
        crawler.on('fetch410', (queueItem, responseObject) => console.error('Error 410: '+ queueItem.url));
        crawler.on('complete', () => resolve(results));
        crawler.start(); // start the car
      });
    });
  });

  var arr = [];

  Object.keys(posts).map(type => {
    Object.keys(posts[type]).map(hood => {
      // resolve all promises to fetch posts
      arr.push(posts[type][hood].then(results => {

        if (!results.length) console.log('FUCK @ posts:'+site.short+':'+type+':'+hood)

        posts[type][hood] = results;
      }));
    });
  });

  return Promise.all(arr)
    .then(() => {
      return {
        site:    site,
        types:   types,
        hoods:   hoods,
        posts:   posts
      }
    });
}

module.exports = {
  crawl: crawlCraiglist
}
