import {StateUnitClass} from "../../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {Mob, TilePoint} from "../../../game/Types";

export interface LootItemQuantityState {
    items: { [name: string]: number },
    radius: number,
    pickTimeoout: number,

    tileWithItem?: TilePoint
}

export class LootItemQuantity extends StateUnitClass {
    state: LootItemQuantityState;
    readonly defaultParams: LootItemQuantityState = {
        items: {},
        radius: 5,
        pickTimeoout: 1000
    };

    async isReached(): Promise<boolean> {
        this.state.tileWithItem = await this.getReachableItemPosition();
        // If cannot find items on ground
        if (!this.state.tileWithItem) {
            return true;
        }
        return false;
    }

    async reach(): Promise<boolean> {
        let tilePoint = this.state.tileWithItem;

        // If player is on top of item, picks the item.
        if (this.game.player.isOnTopOf(tilePoint)) {
            return await this.game.player.pick(this.state.pickTimeoout);
        }
        // If not, walk in the direction of item.
        else this.game.player.walkTo(tilePoint);

        return true;
    }

    private async getReachableItemPosition(): Promise<TilePoint> {
        for (let [item, count] of Object.entries(this.state.items)) {
            if (!count || this.game.iventory.count(item) < count) {
                let tiles = this.game.map.findTilesWithItem(item, this.state.radius);


                // This is to avoid trying to pickup underground seeds.
                tiles = tiles.filter(x=>x.o.length >= 1 && !!x.o.slice(-1).pop().can_pickup);


                if (tiles.length > 0) {
                    return await this.game.player.nearestReachablePoint(tiles, false);
                }
            }
        }

        return null
    }

    game: Game;
}

