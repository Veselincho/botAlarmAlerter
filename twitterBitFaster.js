const { chromium } = require('playwright');
const player = require('play-sound')();
const dotenv = require('dotenv')
const { URLs } = require('./twitterUrls.js');
dotenv.config();


// If 
function playAlertSound() {
    player.play(URLs.songPath, function(err) {
        if (err) {
            console.log(`Could not play sound: ${err.code} - ${err.message}`);
            if (err.code === 1) {
                console.log('Error Code 1: General error or file not found.');
            }
        }
    });
}

async function initBrowser() {
    const browser = await chromium.launch({ headless: true }); // Launch browser
    const context = await browser.newContext();
    const page = await context.newPage();
    return { browser, context, page };
}

async function getCount(page) {
    // Navigate to the desired page
    await page.goto(URLs.link);

    // Wait for the element to appear and extract its text content
    await page.waitForSelector(URLs.selector);
    const postCount = await page.$eval(URLs.selector, element => element.textContent);


    let numVar = parseInt(postCount);
    console.log(numVar);

    if (numVar != 927) {
        playAlertSound();
        setTimeout(process.exit(), 1000) // Terminate the Node.js process
    }
}

(async () => {
    const { browser, context, page } = await initBrowser();

    // Use a named function for setInterval to allow access to the page
    const intervalId = setInterval(async () => {
        try {
            await getCount(page);
        } catch (err) {
            console.error(`Error occurred: ${err}`);
            clearInterval(intervalId); // Clear interval on error
            await context.close();
            await browser.close();
        }
    }, 2000);
})();