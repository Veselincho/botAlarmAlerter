const { chromium } = require('playwright');
const player = require('play-sound')();
const dotenv = require('dotenv')
const { URLs } = require('./twitterUrls.js');
const {playAlertSoundd} = require('./tPlayer.js')
dotenv.config();

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0'
];

const getRandomUserAgent = () => userAgents[Math.floor(Math.random() * userAgents.length)];

async function initBrowser() {
    const browser = await chromium.launch({ headless: true }); // Launch browser
    const context = await browser.newContext({
        userAgent: getRandomUserAgent()
    });
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
    
    if (numVar != 994) {
        playAlertSoundd()
        setTimeout(process.exit(), 5000) // Terminate the Node.js process
    }
}

function getRandomDelay(minSeconds = 1, maxSeconds = 20) {
    const minMilliseconds = minSeconds * 1000;
    const maxMilliseconds = maxSeconds * 1000;
    return Math.floor(Math.random() * (maxMilliseconds - minMilliseconds + 1)) + minMilliseconds;
}

const delay = getRandomDelay();


(async () => {
    //Since I can't understand why the player requires to firstly start the mp3 to recognize it whenever it reaches the statement to execute it - I just add an initial run of it
    playAlertSoundd()
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
    }, delay);
})();