const State = require("./state");
const state = new State().getInstance();


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
    if(!state.active){
      break;
    }
    // to take time between ajax calls
    let urlKey = jsonKeys[index];
    console.log("navigate to: ", urlKey);
    const promises = [];
    let statusCode = null;
    const navigationPromise = page.waitForNavigation()
    const waitForStatusPromise = page.waitForResponse(response => {
      statusCode = response.status();
      return response.status() === 200
    })
    promises.push(navigationPromise);
    promises.push(waitForStatusPromise);
    
    /* if(jsonKeys[index-1]){
      state.crawled.push({index:index-1, id:jsonObj[jsonKeys[index-1]], url: jsonKeys[index-1]})
    } */
    let result;
    if(process.env['PREPROD_BASIC_AUTH']){
      result = await page.goto(urlKey.replace('https://',`https://${process.env['PREPROD_BASIC_AUTH']}@`)/* , { waitUntil: ['networkidle2'] } */);
    } else {
      result = await page.goto(urlKey/* , { waitUntil: ['networkidle2'] } */);
    }
    statusCode = result.status()
    if (result.status() === 404) {
      console.error('404 status code found in result')
    }
    await Promise.all(promises);
    state.id = index;
    state.info = {index, id:jsonObj[urlKey], url: urlKey,status:statusCode};
    state.crawled.push(state.info)
    console.log("cached: ", state.info.url,`[${state.info.status}]`,state.info.id,state.info.index);
  }
  console.log("...end");

  await browser.close();
}

exports.forLoopUrls = forLoopUrls;
