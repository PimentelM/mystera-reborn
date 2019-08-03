import {SessionLogger} from "../../loggers/SessionLogger";
import proxy from 'http-proxy-middleware';
import {decodeBase64} from "../../../Utils";

var WsParser = require('simples/lib/parsers/ws'); // npm install simples


let servers = ["ust", "usw", "use", "eu", "br", "ldn", "use2", "usw2", "sea", "sa"];

// Let's hope we don't run on race conditions.
// A better option wold be to give an unique identifier to the connection and use a dictionary instead.
let upgradingSessions = [];

let sessions = [];

var getWsProxy = (srv) => {
    let _proxy = proxy('/ws/' + srv, {
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

            let cookie = req.headers.cookie;
            let usernameCookiePart = cookie && cookie.split("ml_user=")[1];
            let usernameCookie = usernameCookiePart && usernameCookiePart.split(";")[0];
            let username = usernameCookie && decodeBase64(usernameCookie) || undefined;

            let info = {
                headers: req.headers,
                server: options.target.host,
                ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || "::1",
                player : username
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
            proxySocket.on('data', (data: Buffer) => {
                sessionLogger.downstreamLogger(data);
            });

            proxySocket.on('close', () => {
                sessionLogger.close();
            });

            sessions.push(sessionLogger);
        },


    });


    return _proxy;
};

export function SetupWsProxy(app) {
    for (let server of servers) {
        app.use(getWsProxy(server));
    }
}
