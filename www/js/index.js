
var appBlock=document.getElementById('app');
var blink=document.getElementById('deviceready');
var startButton=document.getElementById('start');//开始按钮

document.addEventListener('deviceready', onDeviceReady, false);

var clean=function(object){
    object.style.setProperty("animation",'clean 1000ms');
    object.style.setProperty("-webkit-animation",'clean 1000ms');
    object.style.setProperty("opacity",'0');
}

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
   
    startButton.onclick=function(){
        clean(appBlock);
        startButton.remove();
        setTimeout(function(){window.location.href="game.html";},1000);
    }
}

