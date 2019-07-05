export default class bot {
    public socket_is_open: boolean | undefined;
    public ws: WebSocket | undefined;
    public nick: string;
    public debug_mode: boolean;
    public msg_array: any;
    constructor(public login: string, public password: string) {
        this.debug_mode = true;
        this.nick = login;
        this.login = btoa(login);
        this.password = btoa(password);
        this.socket_is_open = false;
        this.debug(`New bot instance created, Nick: ${this.nick}`);
        this.debug('Creating WebSocket...');
        this.create_socket();
    }

    create_socket() {
        const new_socket = new WebSocket('wss://br.mysteralegacy.com/');
        new_socket.onopen = () => {
            this.debug('WebSocket open and ready to use.');
            this.socket_is_open = true;
            this.ws = new_socket;
            this.connect();
        }
    }

    connect() {
        if (this.ws != undefined) {
            this.ws.send('{"type":"client","ver":"4.9.1","mobile":false,"agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"}');
            this.ws.send(`{"type":"login","user":"${this.login}","pass":"${this.password}"}`);
            this.treat_socket_events();
        }
    }

    debug(msg: string) {
        if (this.debug_mode == true) {
            console.log(msg);
        }
    }

    treat_socket_events() {
        if (this.ws != undefined) {
            this.ws.onerror = err => {
                console.log(err);
            }
            this.ws.onclose = cls => {
                console.log(cls);
            }
            this.ws.onmessage = msg => {
                this.parse_msg(msg);
            }
        }
    }

    parse_msg(msg: any){
        let msg_clear = msg.data.replace(/\\/g, '');
        try{
        let msg_json = JSON.parse(msg_clear);
        console.log(msg_json);
        }
        catch(err){
            console.log(err);
        }
    }
}


