import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {TilePoint} from "../../../game/Types";

export interface GrindResourceState {
    resource : string,

    condition? : (game : Game) => boolean,
    until? : (game : Game) => boolean,

    tileToGather? : TilePoint

}


let whichTool = (resourceName ) => {
    if (new RegExp(" tree","i").test(resourceName)) return "axe";
    if (new RegExp(" rock","i").test(resourceName)) return "pickaxe";
    return null
};

export class GrindResource extends StateDefinition{
    public state: GrindResourceState;
    game: Game;

    private lastResend : number = 0;

    readonly defaultParams: GrindResourceState = {
        resource : ""
    };

    async isReached(): Promise<boolean> {
        // If condition to grind is not met.
        if(this.state.condition && !this.state.condition(this.game)) {
            return true;
        }

        // If desired state is already met
        if(this.state.until && this.state.until(this.game)) {
            return true;
        }

        this.state.tileToGather = await this.getResourceTile();
        // If cannot find the resource on the ground
        if(!this.state.tileToGather) {
            return true;
        }

        return false;
    }

    async reach(): Promise<boolean> {
        let tilePoint = this.state.tileToGather;
        let resourceName = tilePoint.o[0].name;
        let tool = whichTool(resourceName);

        // If player is adjacent to resource
        if(this.game.player.isAdjacentTo(tilePoint)) {
            if(this.game.player.mob.dir == this.game.player.dirTo(tilePoint)){
                if (tool) {
                    await this.game.player.equip.bestTool(tool);
                }
                if(!this.game.player.isDoingAction || (!this.game.window.action && this.resendActionCooldown())){
                    this.game.player.keepAction();
                }
            } else {
                await this.game.player.lookAt(tilePoint);
            }
        }
        // If not, walk in the direction of resource.
        else {
            this.game.player.walkAdjacentTo(tilePoint);
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
    async getResourceTile(){
        return await this.game.map.getReachableItemPosition(this.state.resource);
    }




}