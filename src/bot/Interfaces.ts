import {Game} from "../game/Game";


export interface StateDefinitionState {
}

export abstract class StateDefinition{
    abstract game : Game;
    abstract state : StateDefinitionState ;

    static getDefaultState() : StateDefinitionState{
        return {}
    }

    abstract async isReached(): Promise<boolean>
    abstract async reach() : Promise<boolean>
}