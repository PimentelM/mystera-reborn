
enum MessageType {
    up = "up",
    down = "down"
}

export type SessionInfo = {
    headers : object,
    server : string
}

export type Message = {
    type : MessageType,
    data : Buffer
}

export class SessionLogger {
    info : SessionInfo;

    sessionData : Message[];

    constructor(info : SessionInfo){
        this.info = info;
    }

    public upstreamLogger(data){
        this.sessionData.push({type : MessageType.up, data})
    }

    public downstreamLogger(data){
        this.sessionData.push({type : MessageType.down, data})
    }


    close() {

    }
}
