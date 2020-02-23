import express from 'express';
import {SetupWsProxy} from "./WsProxy";
import {SetupHttpProxy} from "./HttpProxy";
const path = require('path');
const axios = require('axios');
const http = axios;


export function SetupHttpServer(app) {
    app.use(express.static(path.join(__dirname, '../../../../public')));


    SetupWsProxy(app);

    SetupHttpProxy(app);

    let port = process.env.PORT || 80;

    app.listen(port);

    console.log('Listening on port ' + port);
}
