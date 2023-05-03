const fs = require('fs');
const path = require('path');
const theLogPath = path.join(__dirname,'../log/log.log');
const tools = require("./tools");
const { error } = require('console');

const log = (output, ...args) => {
    let o = `[${tools.date()}|${tools.timestamp()}] ${output} ${args.join(' ')}\n`;
    return new Promise((resolve,reject)=>{
        fs.appendFile(theLogPath, o, 'utf8', (err) => {
            if(err) reject(error);
            resolve();
        });
    })
}

const truncate = (callback) => {
    fs.truncate(theLogPath, 0, callback);
}

const arrayLog = async (array) => {
    for (let i = 0; i < array.length; i++) {
        const string = array[i];
        await log(string);
    }
  }
/** Exports */
exports.log = log;
exports.arrayLog = arrayLog;
exports.truncate = truncate;