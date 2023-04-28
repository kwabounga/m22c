// browser manipulation
const puppeteer = require("puppeteer");
let browser;
let page;


async function launchPuppeteer(headless = false) {
  browser = await puppeteer.launch({ headless: headless });
  page = (await browser.pages()).at(0);
  //console.log(page)
  return { browser, page };
}

exports.launchPuppeteer = launchPuppeteer;



// async loop for fetching all pages
async function forLoopUrls(jsonKeys,jsonObj , startAt = 0) {
  
  console.log("get all urls...");

  for (let index = +startAt; index < jsonKeys.length; index++) {
    // to take time between ajax calls
    const urlKey = jsonKeys[index];
    console.log("navigate to: ", urlKey, +jsonObj[urlKey], index);
    const promises = [];
    promises.push(page.waitForNavigation());
    await page.goto(urlKey);
    await Promise.all(promises);
  }
  console.log("...end");

  await browser.close();
}

exports.forLoopUrls = forLoopUrls;
