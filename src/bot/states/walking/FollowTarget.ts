import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";

export interface FollowTargetState{
    steps : number
    maxDistance: number
}

export class FollowTarget extends StateDefinition{
    state: FollowTargetState;

    readonly defaultParams: FollowTargetState = {
        steps : 2,
        maxDistance: 1
    };


    async isReached(): Promise<boolean> {
        // When has no target
        if (!this.game.player.hasTarget()) return true;

        // When player already is near target
        let distance = this.game.player.distanceTo(this.game.player.getTarget());
        if (distance <= this.state.maxDistance) {
            return true;
        }

        return false;
    }

    async reach(): Promise<boolean> {
        let walkPromise =  this.game.player.walkAdjacentTo(this.game.player.getTarget(),this.state.steps);
        return true;
    }

    game: Game;
}

