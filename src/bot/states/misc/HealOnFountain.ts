import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {TilePoint} from "../../../game/Types";

export interface HealOnFountainState {
    minHealth : number,
    fountainTile? : TilePoint

}

export class HealOnFountain extends StateDefinition{
    public state: HealOnFountainState;

    readonly defaultParams: HealOnFountainState = {
        minHealth : 30
    };

    async isReached(game): Promise<boolean> {
        // Player health is already ok
        if(game.player.status.hpppc > this.state.minHealth) return true;

        this.state.fountainTile = await this.findFountain(game);
        // There is no fountain nearbly
        if(!this.state.fountainTile) return true;

        return false;
    }

    async reach(game): Promise<boolean> {
        let tilePoint = this.state.fountainTile;

        // If player is adjacent to fountain;
        if(game.player.isAdjacentTo(tilePoint)) {
            await game.player.lookAt(tilePoint);
            game.player.action();
            return true;
        }
        // If not, walk in the direction of item.
        else game.player.walkAdjacentTo(tilePoint);

        return true;
    }

    async findFountain(game : Game){
        let tiles = game.map.findTilesWithItem("Healing Fountain");
        return await game.player.nearestReachablePoint(tiles,true);
    }
}