import mongoose from "mongoose";
import {repeatUntil, until} from "../../Utils";
import db from "../db"

enum MessageType {
    up = "up",
    down = "down"
}

interface SessionInfo {
    headers : object,
    server : string,
    ip : string,
    player? : string
}

interface Message {
    type : MessageType,
    data : Buffer,
    timestamp : number,
    seq : number
}



export interface IStoreSessionInfo {( x : SessionInfo, timestamp : number) : Promise<string>}

export interface IStoreSessionMessages {(x : Message[], sessionId : string) : void}


let storeInfo = async (info,timestamp) => {
    let obj = {...info, timestamp};
    let id =  (await new db.Session(obj).save())._id.toHexString();
    return id;
};

let storeMessage = (messages, id) =>{
    messages.forEach(message=>{
        message.session = id;
    });

    db.SessionMessage.insertMany(messages);
};


export class SessionLogger {
    info : SessionInfo;
    timestamp : number;
    sessionData : Message[] = [];
    isActive : boolean = true;

    storeInfo : IStoreSessionInfo;
    storeMessage : IStoreSessionMessages;

    maxBufferSize : number = 20;

    id : string = null;

    upSeq = 0;
    downSeq = 0;

    constructor(info : SessionInfo){
        this.info = info;
        this.storeInfo = storeInfo;
        this.storeMessage = storeMessage;

        this.timestamp = Date.now();

        // Stores session info at start.
        storeInfo(this.info,this.timestamp).then(x=>this.id = x).catch((err)=>{this.isActive = false; console.log(err)});

        // Stores session data every two minutes.
        repeatUntil(()=> this.storeSessionData(), () => this.isActive == false,120000 )

    }

    private log = (type, data, seq) => {
        if(!this.isActive) return;

        this.sessionData.push({type , data, seq, timestamp : Date.now()});
        if(this.sessionData.length > this.maxBufferSize ){
            this.storeSessionData();
        }
    };
    public upstreamLogger = data => {
        this.log(MessageType.up, data, this.upSeq++ )
    };

    public downstreamLogger = data => {
        this.log(MessageType.down, data, this.downSeq++ )
    };

    public close() {
        this.isActive = false;

        // Tries to store session data for two minutes.
        repeatUntil(()=> this.storeSessionData(), ()=> this.sessionData.length == 0,2000, 120000);
    }

    private storeSessionData = async () => {
        if (this.id){
            let messages = this.sessionData;
            this.sessionData = [];
            this.storeMessage(messages, this.id);
        }
    };
}
