import {Game} from "../game/Game";
import {StateDefinition} from "./Interfaces";
import {sleep} from "../Utils";

export interface ControllerState {
    delay : number
}

export class StateController{
    private stateDefinitions : StateDefinition[];

    private state : ControllerState;
    private isActivated : boolean;

    private loopPromise : Promise<any>;

    public constructor(stateDefinitions : StateDefinition[], state : ControllerState) {
        this.stateDefinitions = stateDefinitions;
        this.state = state;
    }

    public async start(){
        await this.pause();
        this.isActivated = true;
        this.loopPromise = this.loop();
    }

    public async pause(){
        if(this.loopPromise){
            this.isActivated = false;
            await this.loopPromise;
            this.loopPromise = undefined;
        }
    }

    public async execute(stateDefinitions : StateDefinition[]){
        this.stateDefinitions = stateDefinitions;
        return await this.start();
    }

    private async loop(){
        while(this.isActivated){
            for (let state of this.stateDefinitions){
                if((await state.isReached()) == false){
                    await state.reach();
                    break;
                }
                await sleep(this.state.delay);
            }
        }
    }




}