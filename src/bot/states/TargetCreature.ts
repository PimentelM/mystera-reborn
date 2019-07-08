import {StateDefinition} from "../Interfaces";
import {Game} from "../../game/Game";
import {Player} from "../../game/Player";
import {CreatureFilter} from "../../game/Creatures";
import {Mob} from "../../game/Types";



export interface TargetCreatureParams {
    targetFilter : CreatureFilter
}

export class TargetCreature extends StateDefinition{
    params: TargetCreatureParams;

    readonly defaultParams: TargetCreatureParams = {
        targetFilter : ""
    };

    async isReached(game : Game): Promise<boolean> {
        // If already has target
        if(game.player.hasTarget()) return true;

        // If there are no creatures that player can target on the screen;
        if(!(await this.getReachableCreature(game))) return true;

        return false;
    }

    async reach(game : Game): Promise<boolean> {
        let creatureToAttack = await this.getReachableCreature(game);
        game.player.attack(creatureToAttack);
        return true;
    }

    private async getReachableCreature(game : Game) : Promise<Mob> {
        let creatures = game.creatures.findCreatures(this.params.targetFilter);
        creatures = game.player.sortByDistance(creatures);

        for (let creature of creatures){
            // Check if can reach creature
            let path = await game.pathfinder.findAdjacentPath(creature);
            if (path.length > 0) return creature;
        }

        return null;
    }

}




