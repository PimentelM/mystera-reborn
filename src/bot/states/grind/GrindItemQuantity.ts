import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {TilePoint} from "../../../game/Types";

export interface GrindItemQuantityState {
    resource : string,
    tool : string,
    items : {[name : string] : number},
    tileToGather? : TilePoint

}

export class GrindItemQuantity extends StateDefinition{
    public state: GrindItemQuantityState;

    readonly defaultParams: GrindItemQuantityState = {
        resource : "" , items : {}, tool : null
    };

    async isReached(game : Game): Promise<boolean> {
        // Se ja tiver a quantidade necessária de items.
        if (this.isQuantityReached(game)) return true;

        this.state.tileToGather = await this.getResourceTile(game);
        // If cannot find the resource on the ground
        if(!this.state.tileToGather) {
            return true;
        }

        return false;
    }

    async reach(game): Promise<boolean> {
        let tilePoint = this.state.tileToGather;

        // If player is adjacent to resource
        if(game.player.isAdjacentTo(tilePoint)) {
            if(game.player.mob.dir == game.player.dirTo(tilePoint)){
                if (this.state.tool) {
                    await game.player.equip.best(this.state.tool);
                }
                if(!game.player.isDoingAction){
                    game.player.keepActionUntilResourceIsGathered();
                }
            } else {
                game.player.lookAt(tilePoint);
            }
        }
        // If not, walk in the direction of resource.
        else {
            game.player.walkAdjacentTo(tilePoint);
        }

        return true;
    }

    // Returns the tile with the desired resource
    async getResourceTile(game){
        return await game.map.getReachableItemPosition(this.state.resource);
    }


    private isQuantityReached(game: Game) {
        return game.iventory.containItems(this.state.items);
    }
}