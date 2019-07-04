class bot{
    public socket_is_open: boolean | undefined;
    public ws: WebSocket | undefined;
    public nick: string;
    constructor(public login: string,public password: string){
        this.nick = login;
        this.login = btoa(login);
        this.password = btoa(password);
        this.socket_is_open = false;
    }

    create_socket(){
        const new_socket = new WebSocket('wss://br.mysteralegacy.com/');
        new_socket.onopen = () => {
            this.socket_is_open = true;
            this.ws = new_socket;
            this.connect();
        }
    }

    connect(){
        if(this.ws != undefined){
            this.ws.send('{"type":"client","ver":"4.9.1","mobile":false,"agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"}')
            this.ws.send(`{"type":"login","user":"${this.login}","pass":"${this.password}"}`)
        }
    }
}