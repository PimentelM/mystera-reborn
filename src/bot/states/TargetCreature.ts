import {StateDefinition, StateDefinitionState} from "../Interfaces";
import {Game} from "../../game/Game";
import {Player} from "../../game/Player";
import {CreatureFilter} from "../../game/Creatures";
import {Mob} from "../../game/Types";



export interface TargetCreatureState extends StateDefinitionState{
    targetFilter : CreatureFilter
}

export class TargetCreature extends StateDefinition{
    game: Game;
    state: TargetCreatureState;

    public static getDefaultState() : TargetCreatureState{
        return {targetFilter: ""}
    }

    public TargetCreatures(game: Game,state : TargetCreatureState){
        this.game = game;
        this.state = state;
    }

    private async getReachableCreature() : Promise<Mob> {
        let creatures = this.game.creatures.findCreatures(this.state.targetFilter);
        creatures = this.game.player.sortByDistance(creatures);

        for (let creature of creatures){
            // Check if can reach creature
            let path = await this.game.pathfinder.findAdjacentPath(creature);
            if (path.length > 0) return creature;
        }

        return null;
    }

    async isReached(): Promise<boolean> {
        // If already has target
        if(this.game.player.hasTarget()) return true;

        // If there are no creatures that player can target on the screen;
        if(!(await this.getReachableCreature())) return true;

        return false;
    }

    async reach(): Promise<boolean> {
        let creatureToAttack = await this.getReachableCreature();
        this.game.player.attack(creatureToAttack);
        return true;
    }

}




