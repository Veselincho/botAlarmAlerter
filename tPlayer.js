const player = require('play-sound')();
const { URLs } = require('./twitterUrls.js');


function playAlertSoundd() {
    player.play(URLs.songPath, function(err) {
        if (err) {
            console.log(`Could not play sound: ${err.code} - ${err.message}`);
            if (err.code === 1) {
                console.log('Error Code 1: General error or file not found.');
            }
        }
    });
}

module.exports = {
 playAlertSoundd
}