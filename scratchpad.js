var request = require('request');
var cheerio = require('cheerio');

request('http://www.bom.gov.au/nsw/observations/sydney.shtml', function (error, response, html) {
    if (!error && response.statusCode == 200) {
        // console.log(html);
        var $ = cheerio.load(html);
        var currentTemp = $('td[headers="tSYDNEY-tmp tSYDNEY-station-sydney-airport"]');
        console.log(currentTemp.text());
    }
})