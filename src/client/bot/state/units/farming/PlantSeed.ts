import {StateUnitClass} from "../../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {TilePoint} from "../../../game/Types";

export interface PlantSeedState {
    seed : string,
    min : number,
    radius : number,
    soilTemplate : string
    soilTile?: TilePoint
    originalMin? : number,

}

export class PlantSeed extends StateUnitClass{
    game: Game;
    public state: PlantSeedState;

    readonly defaultParams: PlantSeedState = {
        seed: null, radius: Infinity, soilTemplate : "22", min: 10
    };

    async isReached(): Promise<boolean> {

        // There is no seed
        if(this.game.iventory.count(this.state.seed) <= this.state.min ) return true;

        this.state.soilTile = await this.findSoil();
        // There is no reachable soil nearbly
        if (!this.state.soilTile) {
            if(this.state.originalMin){
                this.state.min = this.state.originalMin;
                this.state.originalMin = undefined;
            }
            return true;
        }


        return false;
    }

    async reach(): Promise<boolean> {
        if (!this.state.originalMin) this.state.originalMin = this.state.min;
        this.state.min = 0;

        let tilePoint = this.state.soilTile;

        // If player is on top of soil, plant the seed.
        if(this.game.player.isOnTopOf(tilePoint)) {
            return this.game.iventory.use(this.state.seed,true);
        }
        // If not, walk in the direction of item.
        else this.game.player.walkTo(tilePoint);

        return true;
    }

    private async findSoil() {
        return await this.game.player.nearestReachablePoint(this.game.map.findTilesWithTemplate(this.state.soilTemplate,this.state.radius),false)
    }


}