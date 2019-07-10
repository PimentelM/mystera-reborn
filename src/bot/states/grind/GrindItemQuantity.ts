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
        resource : "" , items : {}, tool : ""
    };

    async isReached(game): Promise<boolean> {
        // Se ja tiver a quantidade necessária de items.
        if (this.isQuantityReached(game)) return true;

        this.state.tileToGather = await this.getReachableItemPosition(game);
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
                await game.player.equip.best(this.state.tool);
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

    private isQuantityReached(game){
        for (let item of Object.keys(this.state.items)){
            let requiredQuantity = this.state.items[item];
            let itemCount = game.iventory.findItem(`^${item}$`).reduce((a,x)=>a+=x.qty,0);
            if (itemCount < requiredQuantity) return false;
        }

        return true;
    }

    private async getReachableItemPosition(game : Game) : Promise<TilePoint> {
        // To avoid a lot of recalculations at every controller loop, we must check if the previously calculated item is already defined.
        //if(game.map.getItemAt(this.state.tileToGather,this.state.resource)) return this.state.tileToGather;
        let tiles = game.map.findTilesWithItem(this.state.resource);
        return await game.player.nearestReachablePoint(tiles,false);
    }

}