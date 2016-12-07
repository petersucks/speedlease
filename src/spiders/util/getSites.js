const fs      = require('fs'),
	  cheerio = require('cheerio'),
	  Crawler = require('simplecrawler');

const exceptions = {
	// south florida
	'//fortlauderdale.craigslist.org/' : null,
	'//miami.craigslist.org/mdc'			 : null,
	// prague
	'//prague.craigslist.cz/'				   : null,
	// copenhagen
	'//copenhagen.craigslist.org/'		 : '//copenhagen.craigslist.dk/',
	// helsinki
	'//helsinki.craigslist.fi/'				 : null,
	// fucking france
	'//bordeaux.craigslist.org/'			 : '//bordeaux.craigslist.fr/',
	'//rennes.craigslist.org/'				 : '//rennes.craigslist.fr/',
	'//grenoble.craigslist.org/'			 : '//grenoble.craigslist.fr/',
	'//lille.craigslist.org/'				   : '//lille.craigslist.fr/',
	'//loire.craigslist.org/'				   : '//loire.craigslist.fr/',
	'//lyon.craigslist.org/'				   : '//lyon.craigslist.fr/',
	'//marseilles.craigslist.org/'		 : '//marseilles.craigslist.fr/',
	'//montpellier.craigslist.org/'		 : '//montpellier.craigslist.fr/',
	'//cotedazur.craigslist.org/'			 : '//cotedazur.craigslist.fr/',
	'//rouen.craigslist.org/'				   : '//rouen.craigslist.fr/',
	'//paris.craigslist.org/'				   : '//paris.craigslist.fr/',
	'//strasbourg.craigslist.org/'		 : '//strasbourg.craigslist.fr/',
	'//toulouse.craigslist.org/'			 : '//toulouse.craigslist.fr/',
	// athens
	'//athens.craigslist.gr/'				   : null,
	// warsaw
	'//warsaw.craigslist.pl/'				   : null,
	// portugal
	'//faro.craigslist.pt/'					   : null,
	'//lisbon.craigslist.pt/'				   : null,
	'//porto.craigslist.pt/'				   : null,
};

var crawler, sitesFinal = [];


//
// Site getter (craigslist)
// -----------------------------------------------------------------------------
function getSites() {

  return new Promise(resolve => {

    crawler = new Crawler('https://craigslist.org/about/sites'); // page containing all craigslist sites
    crawler.maxDepth = 1;

    crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
		let $ 	  = cheerio.load(responseBuffer.toString('utf-8')),
			url   = '\/\/([a-z]+)\.craigslist(\.[a-z]{2,3}){0,2}\/',
			sites = [];
			
			sites = $('h1').get().map(region => { // find regions (US, Europe, etc)
				return $(region).next().find('h4').get().map(subregion => { // find subregions (California, Ontario, etc)
					return $(subregion).next().find('li > a').get().map(location => { // find cities
						let url = $(location).attr('href');
						let site = {
							region:    $(region).text(),
							subregion: $(subregion).text(),
							long: 	   $(location).text(),
							short: 	   link.match(url, 'g')[1],
							url: 	   exceptions.hasOwnProperty(url) ? exceptions[url] : url
						};

						return site.url ? site : null;
					});
				});
			});

			sites = sites.reduce((a, b) => a.concat(b)) // flatten the array, get rid of nulls
						.reduce((a, b) => a.concat(b))
						.filter(Boolean);
		
      resolve(sites.slice(0, 572)); // stop at Sheffield, last of EU (572)
    });
    
    crawler.start();
  });
}

//
// Neighborhood getter (craigslist)
// -----------------------------------------------------------------------------
function getHoods(sites) {

  return sites.map(site => {

		// returns array of functions
		// for later SEQUENTIAL execution

		return () => {
			return new Promise((resolve) => {

				crawler = new Crawler('https:'+ site.url);
				crawler.maxDepth = 1;

				crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
					let $ = cheerio.load(responseBuffer.toString('utf-8'));
					let state, hoods;

					hoods = $('ul.sublinks > li > a').get().map(el => { // get state, sublocations from home page
						return {
							long: 	$(el).attr('title'),
							short: 	$(el).attr('href').replace(/\//g, '')
						}
					});

					site['hoods'] = hoods.length ? hoods : ['default'];
					sitesFinal.push(site);
					resolve();
				});

				crawler.on('fetchstart', (queueItem, requestOptions) => {
					console.log('Fetching '+ queueItem.url +'...');
				});

				crawler.start();
			});

		}
  });
}


getSites() // business logic
.then(sites => {

	console.log('Found '+ sites.length +' sites.');
	
	// sequential execution to avoid
	// overloading the poor little spiders
	return getHoods(sites).reduce((p, fn) => p.then(fn), Promise.resolve());

}).then(() => {

	// clear and write sites.json
	console.log('Writing '+ sitesFinal.length +' sites...');

	fs.writeFile('sites.json', JSON.stringify(sitesFinal, null, '\t'), 'utf8', () => {
		console.log('Done.');
	});
})
.catch((e) => console.log(e));
