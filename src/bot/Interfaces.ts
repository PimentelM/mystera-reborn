import {Game} from "../game/Game";


export abstract class StateDefinition{
    abstract state : {};
    abstract readonly defaultParams : {};
    abstract async isReached(game : Game): Promise<boolean>
    abstract async reach(game : Game) : Promise<boolean>
}