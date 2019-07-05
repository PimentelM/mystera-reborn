import {Bot} from "./Bot";
import axios from "axios";


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
    let p = '<script>window.jv_initDialogs = jv.init_dialogs;jv.init_dialogs = ()=>{jv_initDialogs();patch()}<\\/script>'  
    
    if(typeof(mlmeta) !== 'undefined') {document.write('<script src="/play/ml.min.js?ver='+mlmeta.version+'"><\\/script>' + p)}
    else document.write('<script src="/play/ml.min.js"><\\/script>'+p);
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

	//console.log(Math.max(window.innerWidth, document.documentElement.clientWidth));
	//console.log();
	//var new_width = cnv.height() * 1.7788461538;
	//var new_con = alc.width()-new_width;
	//cns.width(new_con);
	//cnv.width(new_width);
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
<div style="width:100%;height:100%;margin:0;padding:0;" id="all_container">
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
