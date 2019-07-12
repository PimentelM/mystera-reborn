import {Game} from "../../game/Game";
import {StateDefinition} from "../Interfaces";
import {sleep} from "../../Utils";

export interface ControllerState {
    delay: number
}

export class StateController {
    private readonly id : number;
    private stateDefinitions: StateDefinition[];
    private game: Game;
    private state: ControllerState;
    private isActivated: boolean;

    private loopPromise: Promise<any>;

    public lastStateExecuted : StateDefinition;

    public constructor(game: Game, stateDefinitions: StateDefinition[] = [], state: ControllerState = StateController.getDefaultState()) {
        this.stateDefinitions = stateDefinitions;
        this.state = state;
        this.game = game;

        this.id = new Date().valueOf();
        this.game.window.controllerId = this.id;
    }

    public static getDefaultState(): ControllerState {
        return {delay: 200}
    }

    public async updateApi(game: Game) {
        if (this.isActivated) {
            await this.stop();
            this.game = game;
            await this.start();
        }
        this.game = game;
    }

    public async start() {
        if (this.stateDefinitions.length == 0) return;
        await this.stop();
        this.isActivated = true;
        this.loopPromise = this.loop();
    }

    public async stop() {
        if (this.loopPromise) {
            this.isActivated = false;
            await this.loopPromise;
            this.loopPromise = undefined;
        }
    }

    public async execute(stateDefinitions: StateDefinition[]) {
        this.stateDefinitions = stateDefinitions;
        return await this.start();
    }

    private canRun(){
        return this.isActivated && this.game.window.controllerId == this.id
    }

    private async loop() {
        try {
            while (this.canRun()) {
                for (let state of this.stateDefinitions) {
                    if (!(await state.isReached())) {
                        await state.reach();
                        if(this.lastStateExecuted != state) console.log(state);
                        this.lastStateExecuted = state;
                        break;
                    }
                }
                await sleep(this.state.delay);
            }
        } catch (e) {
            console.log("Exception while running StateController script.");
            console.log(e.message);
            console.log(e.stack);
            this.stop();
        }
    }


}