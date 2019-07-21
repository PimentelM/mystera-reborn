import {Connection} from "./Connection";
import {Game} from "./game/Game";
import {StateController} from "./state/StateController";
import {IGameWindow} from "./game/Interfaces";
import {StateFactory} from "./state/StateFactory";

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

        if(!this.window.controllerState) this.window.controllerState = {};
        this.stateController = new StateController(this.game, this.window.controllerState);
        this.window.StateController = this.stateController;

        this.stateFactory = new StateFactory(this.game);
        this.window.StateFactory = this.stateFactory;

        // Temporary mute on global chat for f2p players
        this.game.muteF2PPlayers();

    }

    public async reloadBotObjects() {
        this.game = new Game(this.connection, this.window);
        this.stateController.updateApi(this.game);
        this.stateFactory = new StateFactory(this.game);
        this.window.StateFactory = this.stateFactory;
    }

}