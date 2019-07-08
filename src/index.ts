import {Bot} from "./Bot";
import axios from "axios";
import {setLogLevel as hmrLogLevel} from 'webpack/hot/log';
import {Connection} from "./Connection";
import {doWhen} from "./Utils";

hmrLogLevel('error');

// @ts-ignore
if (module.hot) {
    // @ts-ignore
    module.hot.accept();
    updateBotInstance();
}

// @ts-ignore
window.p = (x, y) => {
    return {x, y}
};


function updateBotInstance() {
    if (!window['connection']) {
        console.log("No mystera websocket.");
        return;
    }
    let botVar = "_bot";
    // @ts-ignore
    if (!window.bot_connection || window.bot_connection.ws.readyState === WebSocket.CLOSED) {
        // @ts-ignore
        window.bot_connection = new Connection(window["connection"]);


    }

    // @ts-ignore
    let bot_connection = window.bot_connection;
    window[botVar] = new Bot(bot_connection);
    //console.log("window.bot instance updated.")

    // else {
    //
    //     if (window[botVar] && window[botVar]["reloadBotObjects"]) {
    //         window[botVar]["reloadBotObjects"]();
    //         console.log("Bot objects re-instantiated.")
    //     }else{
    //         console.log("Could not find bot instance.");
    //     }
    // }


}


window["updateBotInstance"] = updateBotInstance;

window["makeBot"] = () => {
    updateBotInstance();
};


function renderGame() {
    document.write(`
<!DOCTYPE html>
<html lang="en-US" style="height:100%;margin:0;padding:0;overflow:hidden;">
<head>
<link rel="icon" href="http://www.mysteralegacy.com/wp-content/uploads/2016/03/favicon.png" sizes="32x32" />
<link rel="icon" href="http://www.mysteralegacy.com/wp-content/uploads/2016/03/favicon.png" sizes="192x192" />
<link rel="apple-touch-icon-precomposed" href="http://www.mysteralegacy.com/wp-content/uploads/2016/03/favicon.png" />
<meta name="msapplication-TileImage" content="http://www.mysteralegacy.com/wp-content/uploads/2016/03/favicon.png" />

<style>body{margin:0;padding:0;background-color:black}</style>
<script type="text/javascript" src="/pixi.min.js"></script>
<script>document.write('<script src="/metaconfig.js?ver='+(new Date()).getTime()+'"><\\/script>');</script>
<script>if(typeof(mlmeta) === 'undefined') {document.write('<script src="http://50.116.42.127/metaconfig.js?ver='+(new Date()).getTime()+'"><\\/script>')}</script>
<script>
    let init_dialogs_hook = '<script>window.jv_initDialogs = jv.init_dialogs;jv.init_dialogs = ()=>{jv_initDialogs();patch()}<\\/script>';  
    let on_login_hook = '<script>window._init_network = window.init_network; window.init_network = ()=>{_init_network(); window.bot = makeBot();}<\\/script>';
    let clearConsole = ''||  '<script>window.console.clear()<\\/script>'
    if(typeof(mlmeta) !== 'undefined') {document.write('<script src="/play/ml.min.js?ver='+mlmeta.version+'"><\\/script>' + init_dialogs_hook + on_login_hook + clearConsole)}
    else document.write('<script src="/play/ml.min.js"><\\/script>');
</script>
<script src="/ph/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
<script>

do_resize = function()
{
	var cnv = document.getElementById("jv");
	var alc = document.getElementById("all_container");

	var h = Math.max(window.innerHeight, document.documentElement.clientHeight);
	var w = Math.max(window.innerWidth, document.documentElement.clientWidth);

	if(h / w <= 0.562)
		alc.style.height = h+"px"//"100%";
	else if(h / w > 0.562)
		alc.style.height = (alc.clientWidth*0.562) + "px";
}
window.addEventListener("resize", function(e) {
	do_resize();
});
window.addEventListener("orientationchange",function(){
	do_resize();
});

</script>
</head>
<body>



<div style="width:80%;height:100%;margin:0;padding:0;" id="all_container">
	<canvas tabindex=0 id='jv' style="background-color:black;width:100%;height:100%;margin:0;min-width:740px;min-height:416px;"></canvas>
</div>


<input type="text" id="script_name" value="" style="margin:0;display:none;">
<div id="script_code" style="margin:0;width:100%;height:600px;display:none;"></div>
</body>

<script>

function patch() {
  let getServerDialog = (n) => jv.reconnect_dialog["connect" + n];
for (let i = 1; i <= 10; i++){
    let d = getServerDialog(i);
    d.ip = window.location.origin.split(window.location.protocol)[1] + "/ws/" + d.ip.split(".")[0];
}
}

</script>

<html>
`);
    window['game-is-rendered'] = true;
}

if (!window['game-is-rendered']) renderGame();

