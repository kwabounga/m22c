// fetch part 
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const getToken = async function(url, params){
  headersObj = {
    'Content-Type': 'application/json',
    'Accept':'*/*',
    'Accept-Encoding':'gzip, deflate, br',
    'Connection':'keep-alive'
  }

  if(process.env['PREPROD_BASIC_AUTH']){
    let basicAuth = Buffer.from(process.env['PREPROD_BASIC_AUTH']).toString('base64')
    console.log('PREPROD_BASIC_AUTH', basicAuth)
    headersObj['Authorization'] = `Basic ${basicAuth}`
  }

  return new Promise((resolve,reject)=>{
    fetch(url, {
      method: 'POST',
      headers: headersObj,
      body: JSON.stringify(params),
      redirect: 'follow'
    }).then((response) => {        
        response.text().then((t) => {

          resolve(t.replace(/\"/gm,''));
        });
    }).catch((e)=>{
        reject(e);
    });
  })
}


exports.getToken = getToken;

const getAllCatsUrls = async function(url, token, scopeId){
  
  return new Promise((resolve,reject)=>{
    let route = `${url}${scopeId}`;
    let auth = `Bearer ${token}`;
    
    if(process.env['PREPROD_BASIC_AUTH']){
      let basicAuth = Buffer.from(process.env['PREPROD_BASIC_AUTH']).toString('base64');
      console.log('PREPROD_BASIC_AUTH', basicAuth);
      auth = `Basic ${basicAuth};` + auth;
    }
    headersObj = {
      'Authorization': auth,
      'Content-Type': 'application/json',
      'Accept':'*/*',
      'Accept-Encoding':'gzip, deflate, br',
      'Connection':'keep-alive',
      'user-agent':'moulinroty hitter agent',
    }

    // console.log(route);
    // console.log(auth);

    fetch(route, {
      method: 'POST',
      headers: headersObj,
      body: JSON.stringify({}),
      redirect: 'follow'
    }).then((response) => {        
        response.text().then((t) => {
          
          if(t.message){
            // console.log('message', t);
            reject(t.message);
            return;
          }
          resolve(t);
        });
    }).catch((e)=>{
        reject(e);
    });
  })
}
exports.getAllCatsUrls = getAllCatsUrls;