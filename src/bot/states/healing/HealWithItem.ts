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
        hppc: 24.99, item: "Healing Potion", cooldown: 1000
    };

    async isReached(): Promise<boolean> {

        // Se ja tiver vida suficiente
        if(this.game.player.status.hpppc > this.state.hppc) return true;
        // Se não tiver potions
        if(this.game.iventory.count(this.state.item) == 0 ) return true;
        // Se tiver usado a potion à pouco tempo
        if(new Date().valueOf() - this.state.lastUse < this.state.cooldown) return true;

        return false;
    }

    async reach(): Promise<boolean> {
        let potion = this.game.iventory.findItem(this.state.item).shift();

        if(!potion) return false;

        this.game.iventory.use(potion);
        this.state.lastUse = new Date().valueOf();

        return true;
    }

    game: Game;
}