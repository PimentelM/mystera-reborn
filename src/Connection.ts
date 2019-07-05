
export class Connection{
    public ws : WebSocket
    constructor(ws){
      this.ws = ws
    }
  
    public send(obj){
      return this.ws.send(JSON.stringify(obj))
    }
  
    public addParser(parser : (msg)=>null){
      this.ws.onmessage = (msg)=>{
        this.ws.onmessage(msg);
        parser(msg)
      }
    }
  }
  