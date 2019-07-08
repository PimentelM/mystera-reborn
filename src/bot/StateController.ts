import {Game} from "../game/Game";
import {StateDefinition} from "./Interfaces";
import {sleep} from "../Utils";

export interface ControllerState {
    delay : number
}

export class StateController{
    private stateDefinitions : StateDefinition[];
    private game : Game;
    private state : ControllerState;
    private isActivated : boolean;

    private loopPromise : Promise<any>;

    public constructor(game: Game, stateDefinitions : StateDefinition[] = [], state : ControllerState = StateController.getDefaultState()) {
        this.stateDefinitions = stateDefinitions;
        this.state = state;
        this.game = game;
    }

    public static getDefaultState() : ControllerState{
        return {delay: 200}
    }

    public async updateApi(game : Game){
        if(this.isActivated){
            await this.stop();
            this.game = game;
            await this.start();
        }
        this.game = game;
    }

    public async start(){
        if(this.stateDefinitions.length == 0) return;
        await this.stop();
        this.isActivated = true;
        this.loopPromise = this.loop();
    }

    public async stop(){
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
                if((await state.isReached(this.game)) == false){
                    await state.reach(this.game);
                    break;
                }
                await sleep(this.state.delay);
            }
        }
    }




}