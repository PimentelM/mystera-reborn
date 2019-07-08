import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {CreatureFilter} from "../../../game/Creatures";
import {Mob} from "../../../game/Types";



export interface TargetCreatureState {
    filters : CreatureFilter[],
    bestTarget? : Mob,
    retarget : boolean,

}

// Currently, retargeting is an expensive feature computationally speaking, so we need to examine it later to improve it's performance.

export class TargetCreature extends StateDefinition{
    state: TargetCreatureState;

    readonly defaultParams: TargetCreatureState = {
        filters : [""], retarget : false
    };

    async isReached(game : Game): Promise<boolean> {
        let currentTarget = game.player.getTarget();
        // If already has target
        if(currentTarget) {
            // If bot is not configured to retarget;
            if(!this.state.retarget) return true;

            this.state.bestTarget = await this.getReachableCreature(game);

            // This means that the player is attacking some creature that is not in the filter list;
            if(!!this.state.bestTarget) return true;

            // If player already has the best target;
            //if (this.state.bestTarget.id === currentTarget.id) return true;

            // If the other found target is of same type;
            if (this.state.bestTarget.template == currentTarget.template) return true;

            return false;
        }

        this.state.bestTarget = await this.getReachableCreature(game);
        // If there are no creatures that player can target on the screen;
        if(!this.state.bestTarget) {
            return true;
        }

        return false;
    }

    async reach(game : Game): Promise<boolean> {
        let creatureToAttack = this.state.bestTarget;
        game.player.attack(creatureToAttack);
        return true;
    }

    private async getReachableCreature(game : Game) : Promise<Mob> {
        let creatures;

        for (let filter of this.state.filters){
            creatures = game.creatures.findCreatures(filter);
            if(creatures.length != 0) break;
        }

        return await game.player.nearestReachablePoint(creatures,true);
    }

}




