
enum MessageType {
    up = "up",
    down = "down"
}

export type SessionInfo = {
    headers : object,
    server : string,
    ip : string
}

export type Message = {
    type : MessageType,
    data : Buffer,
    timestamp : number
}

export class SessionLogger {
    info : SessionInfo;
    timestamp : number;
    sessionData : Message[] = [];
    isActive : boolean = true;

    constructor(info : SessionInfo){
        this.info = info;
        this.timestamp = Date.now();
    }

    private log(type,data){
        this.sessionData.push({type , data, timestamp : Date.now()})

    }
    public upstreamLogger(data){
        this.log(MessageType.up, data)
    }

    public downstreamLogger(data){
        this.log(MessageType.down, data)
    }

    public close() {
        this.isActive = false;
    }
}
