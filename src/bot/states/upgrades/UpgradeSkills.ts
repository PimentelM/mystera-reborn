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

    async isReached(): Promise<boolean> {
        this.state.nextUpgrade = await this.getNextUpgrade();

        if(!this.state.nextUpgrade) return true;

        return false;
    }

    async reach(): Promise<boolean> {
        return await this.game.upgrades.upgradeSkill(this.state.nextUpgrade);
    }

    async getNextUpgrade(){
        for (let skill of this.state.skills){
            if (await this.game.upgrades.canUpgrade(skill)){
                return skill;
            }
        }
        return null
    }

    game: Game;
}