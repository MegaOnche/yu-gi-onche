var pseudo;
var userInfos;
var socket = io.connect('http://yugi-onche.rhcloud.com:8000/', {
  'forceNew': true
});


function assignInfos(infos){
  var json_infos = JSON.parse(infos);
  pseudo = json_infos["local"]["username"];
}

function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }
