var Botkit = require('botkit');
var request = require('request');
var cheerio = require('cheerio');

if (!process.env.token) {
    console.log('Error: Specify a Slack bot token in environment.');
    usage_tip();
    process.exit(1);
}

// Create a Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot({
    debug: false,
    stats_optout: true,
    retry: 10
});

// #TODO: connect Dashbot analytics platform.


// Spawn a single instance of the bot to connect to your Slack team.
controller.spawn({
    token: process.env.token
}).startRTM();

/**
 * Bot responds to an event.
 */
controller.on('bot_channel_join,bot_group_join', function(bot, message) {
    bot.reply(message, 'Hello! I am a bot that says when to wear shorts.');
});

/**
 * Bot hears 'something' and responds
 */
// git the bot something to listen for.
controller.hears('hello', ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
    
    bot.reply(message, 'Did someone mention my name? Ask me what the weather\'s like');
});

// is it hot?
controller.hears('weather', ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
    // Get the latest Sydney Airpot temperature from the BOM
    request('http://www.bom.gov.au/nsw/observations/sydney.shtml', function (error, response, html) {
        if (!error && response.statusCode == 200) {
            // console.log(html);
            var $ = cheerio.load(html);
            var currentTemp = $('td[headers="tSYDNEY-apptmp tSYDNEY-station-sydney-observatory-hill"]').text();
            if (parseInt(currentTemp, 10) > 25) {
                bot.reply(message, 'It\'s hot! ' + currentTemp + ' degrees celcius. Shorts weather.');
            } else {
                bot.reply(message, 'It\'s not hot. ' + currentTemp + ' degrees celcius. Not really shorts weather.');
            }
        } else {
            bot.reply(message, 'I can\'t get throug to the BOM... you\'ll need to be my eyes and ears. Visit http://www.bom.gov.au/nsw/observations/sydney.shtml');
        }
    });
    
});

function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Execute your bot application like this:');
    console.log('token=<MY SLACK TOKEN> node bot.js');
    console.log('Get a Slack token here: https://my.slack.com/apps/new/A0F7YS25R-bots')
    console.log('~~~~~~~~~~');
}