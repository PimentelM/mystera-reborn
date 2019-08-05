import {StateUnitClass} from "../../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {CreatureFilter} from "../../../game/Creatures";
import {Mob} from "../../../game/Types";


export interface TargetCreatureState {
    filters: CreatureFilter[],
    retarget: boolean,
    range: number

    bestTarget?: Mob,
    cooldown: number;

    lastRetarget?: number
    lastResend?: number

}

// Currently, retargeting is an expensive feature computationally speaking, so we need to examine it later to improve it's performance.

export class TargetCreature extends StateUnitClass {
    state: TargetCreatureState;
    game: Game;

    readonly defaultParams: TargetCreatureState = {
        filters: [".*"], retarget: true, cooldown: 2000, range: 15
    };

    resendAttackPacket = () => {
        if (!this.state.lastResend || new Date().valueOf() - this.state.lastResend >= this.state.cooldown) {
            this.game.send({type: "t", t: this.game.player.getTarget().id});
            this.state.lastResend = new Date().valueOf();
        }
    };

    async isReached(): Promise<boolean> {
        let currentTarget = this.game.player.getTarget();


        // If already has target
        if (currentTarget) {

            this.resendAttackPacket();


            // If bot is not configured to retarget;
            if (!this.state.retarget) return true;

            // If retarget is in cooldown
            if (!this.state.lastRetarget || new Date().valueOf() - this.state.lastRetarget < this.state.cooldown) return true;


            this.state.bestTarget = await this.getReachableCreature();

            // This means that the player is attacking some creature that is not in the filter list;
            if (!!this.state.bestTarget) return true;

            // If player already has the best target;
            //if (this.state.bestTarget.id === currentTarget.id) return true;

            // If the other found target is of same type;
            if ((this.state.bestTarget && this.state.bestTarget.template) == (currentTarget && currentTarget.template)) return true;

            this.state.lastRetarget = new Date().valueOf();
            return false;
        }

        this.state.bestTarget = await this.getReachableCreature();
        // If there are no creatures that player can target on the screen;
        if (!this.state.bestTarget) {
            return true;
        }

        return false;
    }

    async reach(): Promise<boolean> {
        let creatureToAttack = this.state.bestTarget;
        this.game.player.attack(creatureToAttack);
        return true;
    }

    private async getReachableCreature(): Promise<Mob> {
        let creatures;

        for (let filter of this.state.filters) {
            creatures = this.game.creatures.findCreatures(filter, this.state.range);
            if (creatures.length != 0) break;
        }

        return await this.game.player.nearestReachablePoint(creatures, true);
    }


}




