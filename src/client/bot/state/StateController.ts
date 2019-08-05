import {Game} from "../game/Game";
import {IStateMachine, StateUnitClass} from "../Interfaces";
import {doWhen, fillInto, sleep} from "../../../Utils";


export interface ControllerState {
    isActivated: boolean;
    delay: number
    stateMachine: IStateMachine;
    lastStateExecuted: StateUnitClass;
    lastExecutionTimestamp: number
    lastExecutedMachine: string,
    debug: boolean,
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
            doWhen(() => {
                this.start();
                this.state.didReload = false;
            }, () => this.state.didReload, this.state.delay, this.state.delay * 3);
        }
    }

    public getDefaultState(): ControllerState {
        return {
            delay: 200,
            isActivated: false,
            stateMachine: null,
            lastStateExecuted: null,
            lastExecutedMachine: null,
            lastExecutionTimestamp: 0,
            debug: false
        }
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

    get isActivated(){
        return this.state.isActivated;
    }

    // Returns true if some state unit is executed.
    private async executeStateMachine(stateMachine: IStateMachine): Promise<boolean> {

        // If it is in cooldown, continue.
        if(stateMachine.checkerCooldown){
            if(!stateMachine.checkerCooldown.canUse()) {
                if(this.state.debug)
                    console.log(`State Machine "${stateMachine.name || stateMachine.constructor.name}" is in cooldown`, stateMachine.condition);
                return false;
            }
            else stateMachine.checkerCooldown.use()
        }

        // Conditions to execute state machine
        if (stateMachine.condition && !(await stateMachine.condition(this.game))) {
            if(this.state.debug)
                console.log(`Did not met condition for "${stateMachine.name || stateMachine.constructor.name}" state machine.`, stateMachine.condition);
            return false;
        }
        if (stateMachine.until && (await stateMachine.until(this.game))){
            if(this.state.debug)
                console.log(`Already fulfulled purpose of "${stateMachine.name || stateMachine.constructor.name}" state machine`, stateMachine.until);
            return false;
        }


        if (stateMachine.isComposite) {
            for (let innerStateMachine of stateMachine.stateMachines) {
                if (await this.executeStateMachine(innerStateMachine)) {
                    if (innerStateMachine.name && innerStateMachine.name != this.state.lastExecutedMachine) {
                        // console.log(innerStateMachine.name);
                        this.state.lastExecutedMachine = innerStateMachine.name
                    }
                    return true;
                }
            }
            return false;
        }

        {
            let state = stateMachine.stateUnit;
            // Conditions to execute state unit
            if (state.condition && !(await state.condition(this.game))) return false;
            if (state.until && (await state.until(this.game))) return false;

            let before = new Date().valueOf();
            let isStateReached = (await state.isReached());
            let after = new Date().valueOf();

            let elapsedtime = after - before;

            if (this.state.debug) console.log(`Eval of: `, state.constructor.name, `${elapsedtime}ms`);


            if (!isStateReached) {
                state.checkerCooldown && state.checkerCooldown.deactivate();
                let before = new Date().valueOf();
                await state.reach();
                let now = new Date().valueOf();
                let elapsedtime = now - before;
                let elapsedTimeSinceLastExecution = now - this.state.lastExecutionTimestamp - this.state.delay;
                this.state.lastExecutionTimestamp = new Date().valueOf();
                if (this.state.lastStateExecuted != state || this.state.debug) console.log(state, `${elapsedTimeSinceLastExecution}ms`, `${elapsedtime}ms`);
                this.state.lastStateExecuted = state;
                return true;
            } else state.checkerCooldown && state.checkerCooldown.activate();
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
