import {StateDefinition} from "../Interfaces";
import {Game} from "../../game/Game";
import {Player} from "../../game/Player";

export interface ZState {

}

export class Template extends StateDefinition{
    public state: ZState;

    readonly defaultParams: ZState = {

    };

    async isReached(game): Promise<boolean> {

        return false;
    }

    async reach(game): Promise<boolean> {

        return true;
    }
}