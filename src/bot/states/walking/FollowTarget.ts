import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/Player";

export interface FollowTargetState{
    steps : number
    maxDistance: number
}

export class FollowTarget extends StateDefinition{
    state: FollowTargetState;

    readonly defaultParams: FollowTargetState = {
        steps : 1,
        maxDistance: 1
    };


    async isReached(game): Promise<boolean> {
        // When has no target
        if (!game.player.hasTarget()) return true;

        // When player already is near target
        let distance = game.player.distanceTo(game.player.getTarget());
        if (distance <= this.state.maxDistance) {
            return true;
        }

        return false;
    }

    async reach(game): Promise<boolean> {
        let walkPromise =  game.player.walkAdjacentTo(game.player.getTarget(),this.state.steps);
        return true;
    }
}

