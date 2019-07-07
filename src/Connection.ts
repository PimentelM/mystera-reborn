type MessageHandler = ((msg: MessageEvent) => null)

export class Connection {
    public ws: WebSocket;

    // Intercepts outgoing packets
    private middlewares: ((data: string) => string)[] = [];

    // Intercepts incoming packets
    private parsers: MessageHandler[] = [];

    private originalParser: MessageHandler;
    private originalSend: (data: string) => any;

    constructor(ws) {
        this.ws = ws;
        this.hookInstall();
    }

    public send = (obj) => {
        return this.ws.send(JSON.stringify(obj))
    }

    private hookInstall = () => {
        this.originalParser = this.ws.onmessage;

        let newParser = (msg: MessageEvent) => {
            this.executeParsers(msg);
            this.originalParser(msg);
        };

        this.originalSend = this.ws.send;


        let newSend = (data) => {
            data = this.executeMiddlewares(data);
            if (data.length == 0) return;
            this.originalSend.apply(this.ws, [data]);
        };

        this.ws.onmessage = newParser;
        this.ws.send = newSend;

    };

    private executeParsers = (msg) => {
        for (let [_, parse] of Object.entries(this.parsers)) {
            {
                if (parse)
                    parse(msg);
            }
        }
    };

    private executeMiddlewares = (data: string): string => {
        for (let [_, middleware] of Object.entries(this.middlewares)) {
            if (middleware)
                data = middleware(data);
        }
        return data;
    };


    public addParser = (parser: (msg) => null, id = undefined): number => {
        if (!id) {
            id = new Date().valueOf();
            while (this.parsers[id]) id++;
        }
        this.parsers[id] = parser;
        return id;
    }

    public addMiddleware = (middleware: (data) => string, id = undefined): number => {
        if (!id) {
            id = new Date().valueOf();
            while (this.middlewares[id]) id++;
        }
        this.middlewares[id] = middleware;
        return id;
    }

    public removeMiddleware = (id) => delete this.middlewares[id];
    public removeParser = (id) => delete this.parsers[id];


}
  