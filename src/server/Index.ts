import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import proxy from 'http-proxy-middleware';
import {SessionLogger} from "./Loggers/SessionLogger";
const path = require('path');
const axios = require('axios');
var WsParser = require('simples/lib/parsers/ws'); // npm install simples


const http = axios;

let app = express();


let servers = ["ust", "usw", "use", "eu", "br",  "ldn", "use2", "usw2", "sea", "sa"];

let mystera = "http://www.mysteralegacy.com/";


// Let's hope we don't run on race conditions
let upgradingSessions = [];

let sessions = [];

var getWsProxy = (srv) => {
    let _proxy =  proxy('/ws/' + srv, {
        target: `wss://${srv}.mysteralegacy.com`,
        changeOrigin: true, // for vhosted sites, changes host header to match to target's host
        ws: true, // enable websocket proxy
        // logLevel: 'debug',
        headers: {
            Host: srv + ".mysteralegacy.com",
            Origin: "http://www.mysteralegacy.com"
        },

        onProxyReqWs(proxyReq, req, socket, options, head) {
            // Handle upstream messages
            var parser = new WsParser(0, false);
            socket.pipe(parser);

            let info = {
                headers : req.headers,
                server : options.target.host,
                ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || "::1"
            };

            let sessionLogger = new SessionLogger(info);

            parser.on('frame', function (frame) {
                sessionLogger.upstreamLogger(frame.data);
            });

            upgradingSessions.push(sessionLogger)
        },

        onOpen(proxySocket) {

            let sessionLogger = upgradingSessions.shift();

            // Handle Downstream messages
            proxySocket.on('data', (data : Buffer) => {
                sessionLogger.downstreamLogger(data);
            });

            proxySocket.on('close',()=>{
               sessionLogger.close();
            });

            sessions.push(sessionLogger);
        },



    });





    return _proxy;
};


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
