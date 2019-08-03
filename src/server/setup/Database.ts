import mongoose from "mongoose"
import config from "../config/config"

mongoose.set('debug',true);

//Set up default mongoose connection
mongoose.connect(config.database,{useNewUrlParser: true});
// Get Mongoose to use the global promise library
(<any>mongoose).Promise = global.Promise;
//Get the default connection
var dbCon = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
dbCon.on('error', console.error.bind(console, 'MongoDB connection error:'));


export default {}

