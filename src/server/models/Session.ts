import mongoose from "mongoose"

const Schema = mongoose.Schema;


let name = "Session";
let schema = new Schema({

    timestamp: {type: Date, required: true},
    headers: {type: Schema.Types.Mixed, required: true},
    ip: {type: String, trim: true, required: true},
    server: {type: String, trim: true, required: true},
    player : {type: String, trim: true},


});

let model = mongoose.model(name, schema);

module.exports = model;
