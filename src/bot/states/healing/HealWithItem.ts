import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";

export interface HealWithItemState {
    hppc: number,
    item: string
    cooldown: number;

    lastUse? : number
}

export class HealWithItem extends StateDefinition{
    public state: HealWithItemState;

    readonly defaultParams: HealWithItemState = {
        hppc: 25, item: "Healing Potion", cooldown: 2000
    };

    async isReached(game): Promise<boolean> {

        if(game.player.status.hpppc > this.state.hppc) return true;
        if(game.iventory.count(this.state.hppc == 0)) return true;
        if(new Date().valueOf() - this.state.lastUse < this.state.cooldown) return true;

        return false;
    }

    async reach(game): Promise<boolean> {
        let potion = game.iventory.findItem(this.state.item).shift();

        if(!potion) return false;

        game.iventory.use(potion);
        this.state.lastUse = new Date().valueOf();

        return true;
    }
}