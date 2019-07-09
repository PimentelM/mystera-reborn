import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {IventoryItem} from "../../../game/Types";

export interface EquipItemState {
    item : string[],
}

export class EquipItem extends StateDefinition{
    public state: EquipItemState;

    readonly defaultParams: EquipItemState = {
        item : []
    };

    async isReached(game): Promise<boolean> {
        let item = this.findItem(game);
        // If there is no item
        if (!item) return true;

        // If item is already equipped.
        if (item.eqp) return true;

        return false;
    }

    async reach(game): Promise<boolean> {
        let item = this.findItem(game);

        if(item)
            game.iventory.equip(item);

        return true;
    }

    findItem(game: Game){
        for (let item of this.state.item ){
            let found = game.iventory.findItem(item).shift();
            if(found) return found
        }
        return null;
    }
}