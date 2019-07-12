import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {upgrades} from "../../../game/Upgrades";




export interface UpgradeSkillsState {
    skills : string[],

    nextUpgrade? : string
}

export class UpgradeSkills extends StateDefinition{
    public state: UpgradeSkillsState;

    readonly defaultParams: UpgradeSkillsState = {
        skills : []
    };

    async isReached(game): Promise<boolean> {
        this.state.nextUpgrade = await this.getNextUpgrade(game);

        if(!this.state.nextUpgrade) return true;

        return false;
    }

    async reach(game): Promise<boolean> {
        return await game.upgrades.upgradeSkill(this.state.nextUpgrade);
    }

    async getNextUpgrade(game){
        for (let skill of this.state.skills){
            if (await game.upgrades.canUpgrade(skill)){
                return skill;
            }
        }
        return null
    }
}