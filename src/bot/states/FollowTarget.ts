import {StateDefinition} from "../Interfaces";
import {Game} from "../../game/Game";
import {Player} from "../../game/Player";

export interface FollowTargetParams{
    steps : number
    waitFinishWalking : boolean
    maxDistance: number
}

export class FollowTarget extends StateDefinition{
    params: FollowTargetParams;

    readonly defaultParams: FollowTargetParams = {
        steps : 3,
        waitFinishWalking: false,
        maxDistance: 1
    };


    async isReached(game): Promise<boolean> {
        // When has no target
        if (!game.player.hasTarget()) return true;

        // When player already is near target
        let distance = game.player.distanceTo(game.player.getTarget());
        if (distance <= this.params.maxDistance) return true;

        return false;
    }

    async reach(game): Promise<boolean> {
        let walkPromise =  game.player.walkAdjacentTo(game.player.getTarget(),this.params.steps);

        if(this.params.waitFinishWalking){
            return await walkPromise;
        }

        return true;
    }
}

