import {StateUnitClass} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {Mob, TilePoint} from "../../../game/Types";

export interface LootItemsState {
    filter : string,
    radius : number,
    pickTimeoout : number,
    tileWithItem? : TilePoint
}

export class LootItems extends StateUnitClass{
    state: LootItemsState;
    readonly defaultParams: LootItemsState = {
        filter: null,
        radius : 5,
        pickTimeoout: 1000
    };

    async isReached(): Promise<boolean> {
        this.state.tileWithItem = await this.game.map.getReachableItemPosition(this.state.filter,this.state.radius);
        // If cannot find items on ground
        if(!this.state.tileWithItem) {
            return true;
        }
        return false;
    }

    async reach(): Promise<boolean> {
        let tilePoint = this.state.tileWithItem;

        // If player is on top of item, picks the item.
        if(this.game.player.isOnTopOf(tilePoint)) {
            return await this.game.player.pick(this.state.pickTimeoout);
        }
        // If not, walk in the direction of item.
        else this.game.player.walkTo(tilePoint);

        return true;
    }

    game: Game;
}

