const _ = require('lodash');

const specials = ['newyork', 'boston']; // these have special URLs (not 'apa')
const filters = {
  locale: val => typeof val === 'string' ? val.trim().slice(1,-1) : '',
  pics: val => typeof val === 'string' ? true : false,
  price:  val => (typeof val === 'string' && val.length) ? parseInt(val.slice(1)) : 0,
}

const x = require('x-ray')({filters:filters}),
      makeDriver = require('request-x-ray'),
      proxy = require('./proxy.json');

const options = {
  proxy: proxy.url
};

const driver = makeDriver({ proxy: proxy.full });

x.driver(driver);
x.concurrency(8);
x.timeout(60 * 1000);

//
// Craigslist spider
// -----------------------------------------------------------------------------
function crawlCraiglist(site, types) {

  var posts = {},
      final = [],
      hoods = Object.keys(site.hoods).map(h => site.hoods[h]);
      types = Object.keys(types).map(t => types[t]);

  types.map(type => {
    posts[type.short] = {};

    hoods.map(hood => {
      posts[type.short][hood.short] = new Promise(resolve => {

        let startUrl; // touch down
        let end = (err, pages) => resolve(_.flatMap(pages, page => {
          let o = {site:site.short, type:type.short, hood:hood.short};
          return page.posts.map(post => _.merge(post, o));
        }));

        if ( /default/.test(hood.short) ) { // form URL
          startUrl = site.url + 'search/' + type.short; }
        else { // change "apa" to "aap" for special cases
          let t    = (specials.indexOf(site.short) > -1 && type.short == 'apa') ? 'aap' : type.short;
          startUrl = site.url + 'search/'+ hood.short +'/'+ t; }
        
        console.log('Starting '+ startUrl +'...');
        
        x(startUrl, {
          posts: x( '.result-row', [{
            date:   'time@datetime',
            link:   '.result-info .result-title@href',
            locale: '.result-info .result-hood | locale',
            pics:   '.result-image@data-ids | pics',
            price:  '.result-info .result-price | price',
            title:  '.result-info .result-title'
          }])
        })
        .paginate('a.button.next@href')
        .limit(3)(end);
      });
    });
  });

  Object.keys(posts).map(type => {
    Object.keys(posts[type]).map(hood => {

      final.push(posts[type][hood].then(results => {
        if (!results.length) console.error('FUCK @ posts:'+site.short+':'+type+':'+hood)
        posts[type][hood] = results;
      }));

    });
  });

  return Promise.all(final)
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
