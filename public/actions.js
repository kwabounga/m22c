function ajaxGet(url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url);
  req.addEventListener("load", function () {
      if (req.status >= 200 && req.status < 400) {
          // // console.log(url + ' ...loaded');
          // Appelle la fonction callback en lui passant la réponse de la requête
          callback(req.responseText);
      } else {
          // console.error(req.status + " " + req.statusText + " " + url);
      }
  });
  req.addEventListener("error", function () {
      // console.error("Erreur réseau avec l'URL " + url);
  });
  req.send(null);
}


onclickStartAt = function(elmnt){
  console.log(elmnt)
  let btn = document.getElementById('startAtBtn');
  ajaxGet(document.location.origin+'/start/'+elmnt.getAttribute('startAt'),(response)=>{
    showInfo(response)
  })
}

onclickStart = function(){
  ajaxGet(document.location.origin+'/start',(response)=>{
    showInfo(response)
  })
}
onclickLast = function(){
  ajaxGet(document.location.origin+'/last',(response)=>{
    showInfo(response)
  })
}
onclickStop = function(){
  ajaxGet(document.location.origin+'/stop',(response)=>{
    showInfo(response)
  })
}
showInfo = function(response){
  console.log(response)
  document.getElementById('output').innerText = response
  let res = JSON.parse(response)
  if(res.last){
    let btn = document.getElementById('startAtBtn');
    btn.innerText = 'Start at '  + res.last.index;
    btn.setAttribute('startAt', res.last.index)
    console.log(btn)
  }
}