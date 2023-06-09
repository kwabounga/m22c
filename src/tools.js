const checkEnvValues = function (values) {
  let valuesOk = true;
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if ((!process.env[value] |
      (process.env[value] === undefined) |
      (process.env[value] === null))) {
      valuesOk = false;
      break;
    }
  }
  return valuesOk;
}

exports.checkEnvValues = checkEnvValues;


const getEnvValues= function(allRequieredValues) {
  if (!checkEnvValues(allRequieredValues)) {
    console.log(
      ` >> please enter ALL REQUIRED INFORMATION in ./.env file:
  ${allRequieredValues.map((v) => {
        return `${v}: ??`
      }).join('\n')
      }
    >> and restart application
      `
    );
    console.log(`>> see README for more info`);
    process.exit(0);
  
  } else {
  
    console.log(`Using: \n${allRequieredValues.map((v) => {
      return `${v}: ${process.env[v]}`
    }).join('\n')
      }`);
    let allCred = {}
    allRequieredValues.forEach((v) => {
      allCred[v] = process.env[v]
    })
    return allCred
  }
}

exports.getEnvValues = getEnvValues;


/**
 * a simple wait/sleep function
 * @param {number} time
 * @returns {Promise<void>}
 */
async function wait(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

/**
 * generate guid
 * @returns {string}
 */
function guid() {
  let rand = function () {
    return Math.floor(Math.random() * 1250);
  }
  let now = Date.now();
  return `${rand()}${now}`;
}

/**
 * generate date
 * @returns {string}
 */
function date() {
  let d = new Date();
  return `${d.getDate().toString().padStart(2,'0')}-${(d.getMonth() + 1 ).toString().padStart(2,'0')}-${d.getFullYear()}`;
}
/**
 * generate date
 * @returns {string}
 */
function currentTime() {
  let d = new Date();
  return `${d.getHours().toString().padStart(2,'0')}:${(d.getMinutes() + 1 ).toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
}
/**
 * generate timestamp
 * @returns {string}
 */
function timestamp() {
  let d = new Date();
  return `${d.getTime()}`;
}

/**
 * special log
 */
function log() {
  console.log(`[${process.pid}]`,`[${date()} | ${currentTime()}]`,...arguments)
}



/* Export */
exports.wait = wait;
exports.guid = guid;
exports.date = date;
exports.timestamp = timestamp;
exports.log = log;