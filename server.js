// get & merge config in .env with process.env
require("dotenv").config();
const path = require("path");
const { getEnvValues } = require("./src/tools");
const { getToken, getAllCatsUrls } = require("./src/magento");
const { forLoopUrls, launchPuppeteer } = require("./src/crawler");
const { rejects } = require("assert");


// global vars form browser manipulation 
let headless = false;
let startAt = null;


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
    `);
    process.exit(1);
  }
  // set headless mode
  if (args.indexOf("headless") !== -1 ) {
    headless = true;
    console.log(`>> headless mode <<\n`);
  }
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
}
// process.exit(1)


// check for informations existance in .env ?
let allRequieredValues = [
  'ADMIN_CONNEXION_URL',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
  'ADMIN_BASEURL',
  'ADMIN_ALL_LINKS_URL',
];
const {ADMIN_CONNEXION_URL,ADMIN_USERNAME,ADMIN_PASSWORD,ADMIN_BASEURL,ADMIN_ALL_LINKS_URL} = getEnvValues(allRequieredValues)
// console.log(ADMIN_CONNEXION_URL,ADMIN_USERNAME,ADMIN_PASSWORD,ADMIN_BASEURL,ADMIN_ALL_LINKS_URL)


// Get the admin token / then get all categories urls / then hit all pages 
const params = {
  'username' : ADMIN_USERNAME,
  'password' : ADMIN_PASSWORD
}
// console.log(params);

//
// get token 
getToken(`${ADMIN_BASEURL}${ADMIN_CONNEXION_URL}`, params)
.then((token)=>{
  console.log(`token: [${token}]`)
  return token;  
})
// get all cat urls
.then((token)=>{
  return  getAllCatsUrls(`${ADMIN_BASEURL}${ADMIN_ALL_LINKS_URL}`, token, 2)
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
  forLoopUrls(jsonKeys, jsonObj, startAt).then((response)=>{
    console.log('>> end <<');
    // process.exit(1);
  })
})
