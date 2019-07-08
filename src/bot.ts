import {Connection} from "./Connection";
import {Game} from "./game/Game";
import {StateController} from "./bot/StateController";
import {IGameWindow} from "./game/Interfaces";
import {StateFactory} from "./bot/StateFactory";

export class Bot {

    public connection: Connection;
    public game: Game;
    public stateController : StateController;
    public stateFactory : StateFactory;

    private window: IGameWindow;

    constructor(connection: Connection) {
        this.connection = connection;
        this.window = eval(`window`);

        this.game = new Game(this.connection, this.window);

        this.stateFactory = new StateFactory();
        this.stateController = new StateController(this.game);


        this.window.StateController = this.stateController;
        this.window.StateFactory = this.stateFactory;

    }

    public async reloadGameApi() {
        this.game = new Game(this.connection, this.window);
        this.stateController.updateApi(this.game);
    }

}