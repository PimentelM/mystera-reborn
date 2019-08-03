import {Model} from "mongoose";

let Session : Model<any> = require("./models/Session");
let SessionMessage : Model<any> = require("./models/SessionMessage");


export default {
    Session,
    SessionMessage
}
