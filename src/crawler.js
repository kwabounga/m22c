const State = require("./state");
const tools = require("./tools");
const state = new State().getInstance();

const { log, arrayLog } = require('./logger');

// browser manipulation
const puppeteer = require("puppeteer");
let browser;
let page;


async function launchPuppeteer(headless = false) {
  browser = await puppeteer.launch({ headless: headless });
  page = (await browser.pages()).at(0);
  //tools.log(page)
  return { browser, page };
}

exports.launchPuppeteer = launchPuppeteer;



// async loop for fetching all pages
async function forLoopUrls(jsonKeys,jsonObj , startAt = 0) {
  let forceStop = false;
  tools.log("get all urls...");
  state.length = jsonKeys.length;

  for (let index = +startAt; index < jsonKeys.length; index++) {
    if(!state.active){
      forceStop = true
      break;
    }
    // to take time between ajax calls
    let urlKey = jsonKeys[index];
    tools.log("navigate to: ", urlKey);
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
      result = await page.goto(urlKey.replace('https://',`https://${process.env['PREPROD_BASIC_AUTH']}@`));
    } else {
      result = await page.goto(urlKey);
    }
    statusCode = result.status()
    if (result.status() === 404) {
      console.error('404 status code found in result', urlKey)
    }
    await Promise.all(promises);
    state.id = index;
    state.info = {index, id:jsonObj[urlKey], url: urlKey,status:statusCode};
    state.crawled.push(state.info)
    tools.log("cached: ", state.info.url,`[${state.info.status}]`,state.info.id,state.info.index);

    if(index === jsonKeys.length-1){
      tools.log("...reloaaaaad");
      index = -1;
      jsonKeys = state.crawled.filter(u => u.status !== 404 ).map( u => u.url );

      tools.log(jsonKeys.length , jsonKeys);
      await arrayLog(state.crawled.filter(u => u.status === 404 ).map( u => u.url ))
      state.length = jsonKeys.length;
      state.crawled = [];
    }
  }
  

  await browser.close();
  return  forceStop;
}

exports.forLoopUrls = forLoopUrls;
exports.browser = browser;
