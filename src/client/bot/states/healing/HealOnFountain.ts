import {StateUnitClass} from "../../Interfaces";
import {Game} from "../../game/Game";
import {Player} from "../../game/player/Player";
import {TilePoint} from "../../game/Types";

export interface HealOnFountainState {
    minHealth: number,

    originalMinHealth?: number
    fountainTile?: TilePoint

}

export class HealOnFountain extends StateUnitClass {
    public state: HealOnFountainState;

    readonly defaultParams: HealOnFountainState = {
        minHealth: 40
    };

    async isReached(): Promise<boolean> {
        // Player health is already ok
        if (this.game.player.status.hpppc > this.state.minHealth) {
            if (this.state.originalMinHealth) {
                this.state.minHealth = this.state.originalMinHealth;
            }
            return true;
        }

        this.state.fountainTile = await this.findFountain();
        // There is no fountain nearbly
        if (!this.state.fountainTile) return true;

        return false;
    }

    async reach(): Promise<boolean> {
        let tilePoint = this.state.fountainTile;

        // If player is adjacent to fountain;
        if (this.game.player.isAdjacentTo(tilePoint)) {
            await this.game.player.lookAt(tilePoint);
            this.game.player.action();
            return true;
        }
        // If not, walk in the direction of item.
        else {
            if (!this.state.originalMinHealth || this.state.originalMinHealth == this.state.minHealth) {
                this.state.originalMinHealth = this.state.minHealth;
                this.state.minHealth = 99;
            }
            this.game.player.walkAdjacentTo(tilePoint);
        }

        return true;
    }

    private async findFountain() {
        return await this.game.map.getReachableItemPosition("Healing Fountain");
    }

    game: Game;
}