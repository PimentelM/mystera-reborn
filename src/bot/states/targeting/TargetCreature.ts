import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/Player";
import {CreatureFilter} from "../../../game/Creatures";
import {Mob} from "../../../game/Types";



export interface TargetCreatureState {
    filter : CreatureFilter,
    creatureTarget? : Mob

}

export class TargetCreature extends StateDefinition{
    state: TargetCreatureState;

    readonly defaultParams: TargetCreatureState = {
        filter : ""
    };

    async isReached(game : Game): Promise<boolean> {
        // If already has target
        if(game.player.hasTarget()) return true;

        this.state.creatureTarget = await this.getReachableCreature(game);
        // If there are no creatures that player can target on the screen;
        if(!this.state.creatureTarget) {
            return true;
        }

        return false;
    }

    async reach(game : Game): Promise<boolean> {
        let creatureToAttack = this.state.creatureTarget;
        game.player.attack(creatureToAttack);
        return true;
    }

    private async getReachableCreature(game : Game) : Promise<Mob> {
        let creatures = game.creatures.findCreatures(this.state.filter);
        return await game.player.nearestReachablePoint(creatures,true);
    }

}




