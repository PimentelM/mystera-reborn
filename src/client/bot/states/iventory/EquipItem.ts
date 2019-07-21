import {StateUnitClass} from "../../Interfaces";
import {Game} from "../../game/Game";
import {Player} from "../../game/player/Player";
import {IventoryItem} from "../../game/Types";

export interface EquipItemState {
    item : string[],
    two? : boolean,

}

export class EquipItem extends StateUnitClass{
    public state: EquipItemState;

    readonly defaultParams: EquipItemState = {
        item : []
    };

    async isReached(): Promise<boolean> {
        let item = this.findItem();
        // If there is no item
        if (!item) return true;

        // If item is already equipped.
        if (item.eqp) return true;

        return false;
    }

    async reach(): Promise<boolean> {
        let item = this.findItem();

        if(item){
            await this.game.iventory.equip(item);
        }

        return true;
    }

    findItem() : IventoryItem{
        for (let itemName of this.state.item ){
            let founds = this.game.player.equip.getEquipables(itemName);
            let found = founds.shift();

            if(this.state.two && found && !!found.eqp){
                found = founds.shift();
            }

            if(found) return found
        }
        return null;
    }

    game: Game;
}