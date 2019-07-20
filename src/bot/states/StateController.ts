import {Game} from "../../game/Game";
import {IStateMachine, StateUnitClass} from "../Interfaces";
import {doWhen, fillInto, sleep} from "../../Utils";


export interface ControllerState {
    isActivated: boolean;
    delay: number
    stateMachine: IStateMachine;
    lastStateExecuted: StateUnitClass;
    lastExecutedMachine: string,
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
        return {delay: 200, isActivated: false, stateMachine: null, lastStateExecuted: null, lastExecutedMachine: null}
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
        if (!this.state.stateMachine) return;
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

    public async execute(stateMachine: IStateMachine) {
        this.state.stateMachine = stateMachine;
        return await this.start();
    }

    private isCurrentInstance() {
        return this.game.window.controllerId == this.id;
    }

    private canRun() {
        let isCurrentInstance = this.isCurrentInstance();
        return this.state.isActivated && isCurrentInstance;
    }

    // Returns true if some state unit is executed.
    private async executeStateMachine(stateMachine : IStateMachine) : Promise<boolean>{

        // Conditions to execute state machine
        if (stateMachine.condition && !(await stateMachine.condition(this.game))) return false;
        if (stateMachine.until && (await stateMachine.until(this.game))) return false;


        if(stateMachine.isComposite){
            for (let innerStateMachine of stateMachine.stateMachines){
                if (await this.executeStateMachine(innerStateMachine)) {
                    if(innerStateMachine.name && innerStateMachine.name != this.state.lastExecutedMachine) {
                        // console.log(innerStateMachine.name);
                        this.state.lastExecutedMachine = innerStateMachine.name
                    }
                    return true;
                }
            }
            return false;
        }

        for (let state of stateMachine.stateUnits) {

            // Conditions to execute state unit
            if (state.condition && !(await state.condition(this.game))) continue;
            if (state.until && (await state.until(this.game))) continue;

            if (!(await state.isReached())) {
                await state.reach();
                if (this.state.lastStateExecuted != state) console.log(state);
                this.state.lastStateExecuted = state;
                return true;
            }
        }

        return false;
    }

    private async loop() {
        try {
            while (this.canRun()) {
                await this.executeStateMachine(this.state.stateMachine);
                await sleep(this.state.delay);
            }

            if (!this.isCurrentInstance()) this.state.didReload = true;

        } catch (e) {
            console.log("Exception while running State Machine.");
            console.log(e.message);
            console.log(e.stack);
            this.stop();
        }
    }


}