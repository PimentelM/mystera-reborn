import express from 'express';
import {SetupWsProxy} from "./setup/http-server/WsProxy";
import {SetupHttpProxy} from "./setup/http-server/HttpProxy";
import {SetupHttpServer} from "./setup/http-server/HttpServer";
import "./setup/Database";

let app = express();


SetupHttpServer(app);
