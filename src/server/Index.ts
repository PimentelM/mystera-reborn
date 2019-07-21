import axios from 'axios';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import proxy from 'http-proxy-middleware';
const path = require('path');


const http = axios;

let app = express();


let servers = ["ust", "usw", "use", "eu", "br",  "ldn", "use2", "usw2", "sea", "sa"];

let mystera = "http://www.mysteralegacy.com/";


var getWsProxy = (srv) => proxy('/ws/' + srv, {
    target: `wss://${srv}.mysteralegacy.com`,
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    ws: true, // enable websocket proxy
    logLevel: 'debug',
    headers: {
        Host: srv + ".mysteralegacy.com",
        Origin: "http://www.mysteralegacy.com"
    }
});


let httpProxy =
    {
        "changeOrigin": true,
        "cookieDomainRewrite": "localhost",
        "target": mystera,
        onProxyReq: proxyReq => {
            if (proxyReq.getHeader('origin')) {
                proxyReq.setHeader('origin', mystera);
            }
        }
    };

app.use(express.static(path.join(__dirname, '../../public')));

for (let server of servers){
    app.use(getWsProxy(server));
}

app.use(proxy(['!/',...servers.map(x=>"!/ws-"+x),'**'],httpProxy));

// Keep heroku free app online
if (process.env.PORT){
    setInterval(function() {
        http.get(`http://mystera-reborn.herokuapp.com`);
    }, 300000);
}


let port = process.env.PORT || 80;

app.listen(port);

console.log('Listening on port ' + port);
