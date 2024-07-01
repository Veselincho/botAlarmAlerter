const { chromium } = require('playwright');
const player = require('play-sound')();
require('dotenv').config();
const path = process.env.songPath;
const xLink = process.env.link
const selector = process.env.waitingSelector


async function playAlertSound() {
    player.play(path, function(err) {
        if (err) console.log(`Could not play sound: ${err}`);
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
    await page.goto(xLink);

    // Wait for the element to appear and extract its text content
    await page.waitForSelector(selector);
    const postCount = await page.$eval(selector, element => element.textContent);


    let numVar = parseInt(postCount);
    console.log(numVar);

    if (numVar != 9112) {
        await playAlertSound();
        setTimeout(process.exit(), 3000) // Terminate the Node.js process
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