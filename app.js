// get & merge config in .env with process.env
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { getEnvValues } = require("./src/tools");
const { URL_MOCK } = require("./src/mock");
const { getToken, getAllCatsUrls } = require("./src/magento");
const { forLoopUrls, launchPuppeteer, browser } = require("./src/crawler");
const { authMiddleware } = require("./src/auth");
const { rejects } = require("assert");

const State = require("./src/state");
const state = new State().getInstance();
const tools = require("./src/tools");

// micro server
const express = require("express");
let port = process.env.PORT || 1223;
const http = require("http");
const app = express();
const server = http.createServer(app);
let cors = require("cors");
app.use(cors())

// web socket
// const WebSocket = require('ws');
// const wss = new WebSocket.Server({
//   server: server,
//   path: ("/state")
// })


// console.log('state',state)
// state.stop = true
// console.log('state',state)
// const state2 = new State().getInstance();
// console.log('state2', state2)
// process.exit(1);


// global vars form browser manipulation 
let headless = true; // set to true before deploy
let startAt = null;
let onlyFront = false;
let mocked = false;
let configFile = 'config.json';


// get args if any
console.log(process.argv)
var args = process.argv.slice(2);
console.log(args)
if (args.length) {
  if (args.indexOf("help") !== -1 ) {
    
    console.log(`
    usage:
    npm run start
    help : show help
    headless : activate headless
    start=[id] : start At [id]
    port=[port] : use port [port]
    `);
    process.exit(1);
  }
  // set dev mode
  if (args.map(e=>e.toLowerCase()).indexOf("dev") !== -1 ) {
    console.log(`>> dev mode <<\n`);
  }
  // set onlyFront mode
  if (args.map(e=>e.toLowerCase()).indexOf("onlyfront") !== -1 ) {
    onlyFront = true;
    console.log(`>> onlyFront mode <<\n`);
  }
  // set mocked mode
  if (args.map(e=>e.toLowerCase()).indexOf("mocked") !== -1 ) {
    mocked = true;
    console.log(`>> mocked mode <<\n`);
  }
  // set headless mode
  if (args.indexOf("noheadless") !== -1 ) {
    headless = false;
    console.log(`>> no headless mode <<\n`);
  }
  // START AT
  let regex = /start\=(\d*)/;
  // let startAt;
  if(args.some(e => {
    let t = regex.test(e);
    if(t){
      startAt = e.split('=')[1];
    }
    return t;
  })){
    console.log('start:', startAt);
  }
  // PORT
  regex = /port\=(\d*)/;
  // let startAt;
  if(args.some(e => {
    let t = regex.test(e);
    if(t){
      port = e.split('=')[1];
    }
    return t;
  })){
    console.log('PORT:', port);
  }
  // CONFIG
  regex = /config\=(\d*)/;
  // let startAt;
  if(args.some(e => {
    let t = regex.test(e);
    if(t){
      configFile = e.split('=')[1];
    }
    return t;
  })){
    console.log('config:', configFile);
  }
}
// process.exit(1)


// check for informations existance in .env ?
let allRequieredValues = [
  'ADMIN_CONNEXION_URL',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
  'ADMIN_BASEURL',
  'ADMIN_ALL_LINKS_URL',
  'FRONT_ADMIN_ACCESS',
];
const {ADMIN_CONNEXION_URL,ADMIN_USERNAME,ADMIN_PASSWORD,ADMIN_BASEURL,ADMIN_ALL_LINKS_URL,FRONT_ADMIN_ACCESS} = getEnvValues(allRequieredValues)

// ICI recupération des infos en plus 

const config = loadConfig();

function loadConfig() {
  let r = {
    "scope_id": 2
  }
  try {
    r = JSON.parse(fs.readFileSync(`${__dirname}/${configFile}`));
  } catch (error) {
    tools.log(error)
  }
    return r
}
tools.log('SCOPE!!', config.scope_id)
// console.log(ADMIN_CONNEXION_URL,ADMIN_USERNAME,ADMIN_PASSWORD,ADMIN_BASEURL,ADMIN_ALL_LINKS_URL)


// Get the admin token / then get all categories urls / then hit all pages 
const params = {
  'username' : ADMIN_USERNAME,
  'password' : ADMIN_PASSWORD
}
// console.log(params);

function stopCrawl() {
  state.active = false;
}
function crawl(id = 0) {
  //
  startAt = id
  
  if(mocked){
    launchPuppeteer(headless).then(() => {
      const jsonKeys = Object.keys(URL_MOCK)
          const jsonObj = URL_MOCK;
      if(id==0){
        
          state.reset()
          state.init(jsonKeys)
      }
      state.active = true;
      forLoopUrls(jsonKeys, jsonObj, startAt).then((response)=>{
        console.log('>> end <<', state.id);
        // process.exit(1);
      })
    });
    
  }else {
    // get token 
    getToken(`${ADMIN_BASEURL}${ADMIN_CONNEXION_URL}`, params)
    .then((token)=>{
      console.log(`token: [${token}]`)
      return token;  
    })
    // get all cat urls
    .then((token)=>{
      return  getAllCatsUrls(`${ADMIN_BASEURL}${ADMIN_ALL_LINKS_URL}`, token, config.scope_id)
        .then( (cats) => {

          cats = cats.replace(/\\/g, "");
          cats.trim();
          cats = cats.slice(1, -1);
          
          let objCats = JSON.parse(cats);
          return objCats;    
        })
    })
    // compute obj cats
    .then((objCats)=>{
        // console.log('urls:', objCats);
        keys = Object.keys(objCats);
        vals = Object.values(objCats);
        // console.log(keys);
        // console.log(vals);
        return { jsonKeys:keys, jsonObj:objCats}
    })
    // launch puppetteer
    .then((jsons) => {  
      return new Promise((resolve, reject)=>{
        launchPuppeteer(headless).then(() => {
          resolve(jsons)  
        });
      })
    })
    // async loop: hit all pages
    .then((jsons)=>{
      
      const {jsonKeys, jsonObj} = jsons;
      state.reset()
      state.init(jsonKeys)
      state.active = true;
      forLoopUrls(jsonKeys, jsonObj, startAt).then((forceStop)=>{
        console.log('>> end <<', state.id);
        console.log('>> reload !', forceStop);
        if(!forceStop){
          crawl();
        }
      })
    })
  }
}

app.use(express.static('public'));

app.get("/start", authMiddleware, function (req, res) {
  if(state.active){
    return;
  }
  state.active=true;

  if(!onlyFront){
    crawl();
  }

  res.send(state.state);
});

app.get("/start/:id", authMiddleware, function (req, res) {
  if(state.active){
    return;
  }

  state.active=true;

  if(!onlyFront){
    crawl(+req.params.id);
  }
  
  res.send({...state.state, startAt:+req.params.id});
})

app.get("/stop", authMiddleware,function (req, res) {
  stopCrawl()
  res.send(state.state);
});

app.get("/last", authMiddleware ,function (req, res) {
  // console.log('-- last --');
  res.send(state.state);
});

app.get("*", function (req, res) {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`server mr grabber listening at http://localhost:${port}`);
  crawl();
});

process.on('beforeExit', (code) => {
  browser.close()
  console.log('Process beforeExit event with code: ', code);
});
// wss.on("connection", socket => {
//   socket.send(JSON.stringify({
//     id: state.id,
//     version: '0.0.1',
//   }))
// })




 