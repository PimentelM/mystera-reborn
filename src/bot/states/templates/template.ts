import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";

export interface ZState {

}

export class Z extends StateDefinition{
    game: Game;
    public state: ZState;

    readonly defaultParams: ZState = {

    };

    async isReached(): Promise<boolean> {

        return false;
    }

    async reach(): Promise<boolean> {

        return true;
    }
}