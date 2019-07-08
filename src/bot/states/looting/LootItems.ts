import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {Mob, TilePoint} from "../../../game/Types";

export interface LootItemsState {
    filter : string,
    radius : number,
    pickTimeoout : number,

    tileWithItem? : TilePoint
}

export class LootItems extends StateDefinition{
    state: LootItemsState;
    readonly defaultParams: LootItemsState = {
        filter: "Salmonberry|Healing Potion",
        radius : 3,
        pickTimeoout: 1000
    };

    async isReached(game): Promise<boolean> {
        this.state.tileWithItem = await this.getReachableItemPosition(game);
        // If cannot find items on ground
        if(!this.state.tileWithItem) {
            return true;
        }
        return false;
    }

    async reach(game): Promise<boolean> {
        let tilePoint = this.state.tileWithItem;

        // If player is on top of item, picks the item.
        if(game.player.isOnTopOf(tilePoint)) {
            return await game.player.pick(this.state.pickTimeoout);
        }
        // If not, walk in the direction of item.
        else game.player.walkTo(tilePoint);

        return true;
    }

    private async getReachableItemPosition(game : Game) : Promise<TilePoint> {
        let tiles = game.map.findTilesWithItem(this.state.filter,this.state.radius);
        return await game.player.nearestReachablePoint(tiles,false);
    }
}

