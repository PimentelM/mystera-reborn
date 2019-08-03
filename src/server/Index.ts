import express from 'express';
import {SetupWsProxy} from "./Setup/WsProxy";
import {SetupHttpProxy} from "./Setup/HttpProxy";
import {SetupHttpServer} from "./Setup/HttpServer";

let app = express();


SetupWsProxy(app);

SetupHttpProxy(app);




SetupHttpServer(app);
