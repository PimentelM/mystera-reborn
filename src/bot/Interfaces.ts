import {Game} from "../game/Game";


export abstract class StateDefinition{
    abstract state : {};
    abstract game : Game;
    abstract readonly defaultParams : {};
    abstract async isReached(): Promise<boolean>
    abstract async reach() : Promise<boolean>
}