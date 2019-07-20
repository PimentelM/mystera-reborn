import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {upgrades} from "../../../game/Upgrades";




export interface UpgradeSkillsState {
    skills : string[],

    cooldown : number,

    remainMyst : number

    nextUpgrade? : string

    lastUpgrade? : number

}

export class UpgradeSkills extends StateDefinition{
    public state: UpgradeSkillsState;

    readonly defaultParams: UpgradeSkillsState = {
        skills : [], remainMyst: 30, cooldown: 10000
    };

    async isReached(): Promise<boolean> {
        this.state.nextUpgrade = await this.getNextUpgrade();

        if(!this.state.nextUpgrade) return true;

        // Se já tiver upado skill a pouco tempo
        if(new Date().valueOf() - this.state.lastUpgrade < this.state.cooldown) return true;


        return false;
    }

    async reach(): Promise<boolean> {
        this.state.lastUpgrade = new Date().valueOf();
        return await this.game.upgrades.upgradeSkill(this.state.nextUpgrade);
    }

    async getNextUpgrade(){
        for (let skill of this.state.skills){
            if (await this.game.upgrades.canUpgrade(skill,this.state.remainMyst)){
                return skill;
            }
        }
        return null
    }

    game: Game;
}