import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {TilePoint} from "../../../game/Types";

export interface GrindResourceState {
    resource : string,
    tool : string,

    condition? : (game : Game) => boolean,
    until? : (game : Game) => boolean,

    tileToGather? : TilePoint

}

export class GrindResource extends StateDefinition{
    public state: GrindResourceState;

    private lastResend : number = 0;

    readonly defaultParams: GrindResourceState = {
        resource : "" , tool : null
    };

    async isReached(game : Game): Promise<boolean> {
        // If condition to grind is not met.
        if(this.state.condition && !this.state.condition(game)) return true;

        // If desired state is already met
        if(this.state.until && this.state.until(game)) return true;

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
                if(!game.player.isDoingAction || (!game.window.action && this.resendActionCooldown())){
                    game.player.keepAction();
                }
            } else {
                await game.player.lookAt(tilePoint);
            }
        }
        // If not, walk in the direction of resource.
        else {
            game.player.walkAdjacentTo(tilePoint);
        }

        return true;
    }

    private resendActionCooldown() {
        if (new Date().valueOf() - this.lastResend >= 3000){
            this.lastResend = new Date().valueOf();
            return true;
        }
        return false;
    }

    // Returns the tile with the desired resource
    async getResourceTile(game){
        return await game.map.getReachableItemPosition(this.state.resource);
    }



}