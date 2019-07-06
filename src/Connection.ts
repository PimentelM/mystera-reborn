
export class Connection{
    public ws : WebSocket
    constructor(ws){
      this.ws = ws
    }
  
    public send(obj){
      return this.ws.send(JSON.stringify(obj))
    }
  
    public addParser(parser : (msg)=>null) {
        let originalParser: (x) => any = this.ws.onmessage;

        let newParser = (msg) => {
            originalParser(msg);
            parser(msg);
        };

        this.ws.onmessage = newParser;
    }
  }
  