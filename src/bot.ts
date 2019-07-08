import {Connection} from "./Connection";
import {Game} from "./game/Game";

export class Bot {

    public connection: Connection;
    public game: Game;

    constructor(connection: Connection) {
        this.connection = connection;
        this.reloadGameApi();

    }

    public reloadGameApi() {
        let gameWindow = window;
        // @ts-ignore
        this.game = new Game(this.connection, gameWindow);
    }

    public doLogin(login, password) {
        const login_b64 = btoa(login);
        const password_b64 = btoa(password);
        this.connection.send({
            "type": "client",
            "ver": "4.9.1",
            "mobile": false,
            "agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        });
        this.connection.send({"type": "login", "user": login_b64, "pass": password_b64});
    }

}