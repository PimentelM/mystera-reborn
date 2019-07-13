import {Game} from "../../game/Game";
import {StateDefinition} from "../Interfaces";
import {doWhen, fillInto, sleep} from "../../Utils";


export interface ControllerState {
    isActivated: boolean;
    delay: number
    stateDefinitions: StateDefinition[];
    lastStateExecuted: StateDefinition;

    didReload?: boolean

}

export class StateController {
    private readonly id: number;
    private game: Game;
    private state: ControllerState;
    private loopPromise: Promise<any>;


    public constructor(game: Game, state: object | ControllerState) {
        let defaultState = this.getDefaultState();
        fillInto(defaultState, state);

        this.state = (state as ControllerState);

        this.game = game;
        this.id = new Date().valueOf();
        this.game.window.controllerId = this.id;

        if (this.state.isActivated) {
            // If it was activated before reload, wait for a maximum of 3 cycles for the reload to take effect and re-start.
            // Also resets reload flag.
            doWhen(() => {this.start(); this.state.didReload = false;}, () => this.state.didReload, this.state.delay, this.state.delay * 3);
        }
    }

    public getDefaultState(): ControllerState {
        return {delay: 200, isActivated: false, stateDefinitions: [], lastStateExecuted: null}
    }

    public async updateApi(game: Game) {
        if (this.state.isActivated) {
            await this.stop();
            this.game = game;
            await this.start();
        }
        this.game = game;
    }

    public async start() {
        if (this.state.stateDefinitions.length == 0) return;
        await this.stop();
        this.state.isActivated = true;
        this.loopPromise = this.loop();
    }

    public async stop() {
        if (this.loopPromise) {
            this.state.isActivated = false;
            await this.loopPromise;
            this.loopPromise = undefined;
        }
    }

    public async execute(stateDefinitions: StateDefinition[]) {
        this.state.stateDefinitions = stateDefinitions;
        return await this.start();
    }

    private isCurrentInstance() {
        return this.game.window.controllerId == this.id;
    }

    private canRun() {
        let isCurrentInstance = this.isCurrentInstance();
        return this.state.isActivated && isCurrentInstance;
    }

    private async loop() {
        try {
            while (this.canRun()) {
                for (let state of this.state.stateDefinitions) {
                    if (!(await state.isReached())) {
                        await state.reach();
                        if (this.state.lastStateExecuted != state) console.log(state);
                        this.state.lastStateExecuted = state;
                        break;
                    }
                }
                await sleep(this.state.delay);
            }

            if (!this.isCurrentInstance()) this.state.didReload = true;

        } catch (e) {
            console.log("Exception while running StateController script.");
            console.log(e.message);
            console.log(e.stack);
            this.stop();
        }
    }


}