import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {Mob, TilePoint} from "../../../game/Types";

export interface LootItemQuantityState {
    items: { [name: string]: number },
    radius: number,
    pickTimeoout: number,

    tileWithItem?: TilePoint
}

export class LootItemQuantity extends StateDefinition {
    state: LootItemQuantityState;
    readonly defaultParams: LootItemQuantityState = {
        items: {},
        radius: 5,
        pickTimeoout: 1000
    };

    async isReached(game): Promise<boolean> {
        this.state.tileWithItem = await this.getReachableItemPosition(game);
        // If cannot find items on ground
        if (!this.state.tileWithItem) {
            return true;
        }
        return false;
    }

    async reach(game): Promise<boolean> {
        let tilePoint = this.state.tileWithItem;

        // If player is on top of item, picks the item.
        if (game.player.isOnTopOf(tilePoint)) {
            return await game.player.pick(this.state.pickTimeoout);
        }
        // If not, walk in the direction of item.
        else game.player.walkTo(tilePoint);

        return true;
    }

    private async getReachableItemPosition(game: Game): Promise<TilePoint> {
        for (let [item, count] of Object.entries(this.state.items)) {
            if(game.iventory.count(item) < count){
                let tiles = game.map.findTilesWithItem(item, this.state.radius);
                return await game.player.nearestReachablePoint(tiles, false);
            }
        }

        return null
    }
}

