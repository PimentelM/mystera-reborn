import mongoose from "mongoose"

const Schema = mongoose.Schema;


let name = "Message";
let schema = new Schema({

    session : { type: Schema.Types.ObjectId , required : true , ref: "Session"},
    timestamp: {type: Date, required: true},
    type : {type: String, enum : ["up", "down"], required: true},
    data : {type: Schema.Types.Buffer, required: true},
    seq : {type: Number, required: true}

});

let model = mongoose.model(name, schema);

module.exports = model;
