const fs = require('fs');
var roster = require('./roster.json');

var newRoster = {};

for (let key in roster) {

    var hoods = {};

    roster[key]['hoods'].map(h => {
        if (h.short == 'default') {
            hoods = null;
            return;
        }
        hoods[h.short] = {};
        hoods[h.short]['short'] = h.short;
        hoods[h.short]['long'] = h.long;
    });

    newRoster[key] = {
        region: roster[key]['region'],
        subregion: roster[key]['subregion'],
        short: key,
        long: roster[key]['long'],
        url: roster[key]['href'],
        hoods: hoods
    }
}

console.log(newRoster);

fs.writeFile('roster2.json', JSON.stringify(newRoster, null, '\t'), 'utf8', () => {
    console.log('Done.');
});