import {StateDefinition, StateDefinitionState} from "../Interfaces";
import {Game} from "../../game/Game";
import {Player} from "../../game/Player";

export interface FollowCreatureState extends StateDefinitionState{
    steps : number
    waitFinishWalking : boolean
}

export class FollowCreature extends StateDefinition{
    game: Game;
    state: FollowCreatureState;

    public FollowCreature(game: Game,state : FollowCreatureState){
        this.game = game;
        this.state = state;
    }

    public static getDefaultState() : FollowCreatureState{
        return {steps:3, waitFinishWalking: false}
    }

    async isReached(): Promise<boolean> {
        // When has no target
        if (!this.game.player.hasTarget()) return true;

        // When player already is near target
        if (this.game.player.distanceTo(this.game.player.getTarget()) <= 1) return true;

        return false;
    }

    async reach(): Promise<boolean> {
        let walkPromise =  this.game.player.walkAdjacentTo(this.game.player.getTarget(),this.state.steps);

        if(this.state.waitFinishWalking){
            return await walkPromise;
        }

        return true;
    }

}