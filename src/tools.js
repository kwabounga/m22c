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