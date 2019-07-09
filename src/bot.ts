import {Connection} from "./Connection";
import {Game} from "./game/Game";
import {StateController} from "./bot/states/StateController";
import {IGameWindow} from "./game/Interfaces";
import {StateFactory} from "./bot/states/StateFactory";

export class Bot {

    public connection: Connection;
    public game: Game;
    public stateController : StateController;
    public stateFactory : StateFactory;

    private window: IGameWindow;

    constructor(connection: Connection) {
        this.connection = connection;
        this.window = eval(`window`);

        this.window.Bot = this;

        this.game = new Game(this.connection, this.window);

        this.stateController = new StateController(this.game);
        this.window.StateController = this.stateController;

        this.stateFactory = new StateFactory();
        this.window.StateFactory = this.stateFactory;

    }

    public async reloadBotObjects() {
        this.game = new Game(this.connection, this.window);
        this.stateController.updateApi(this.game);
        this.stateFactory = new StateFactory();
        this.window.StateFactory = this.stateFactory;
    }

}