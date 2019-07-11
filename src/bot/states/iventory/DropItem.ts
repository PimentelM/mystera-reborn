import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {IventoryItem} from "../../../game/Types";
import {sleep} from "../../../Utils";

export interface DropItemState {
    items: { [name: string]: number },
    cooldown: number;

    lastDrop? : number
}

export class DropItem extends StateDefinition {
    public state: DropItemState;

    readonly defaultParams: DropItemState = {
        items: {}, cooldown: 500
    };

    async isReached(game): Promise<boolean> {
        let item = this.findItem(game);
        // If there is no item to drop
        if (!item) return true;

        if(new Date().valueOf() - this.state.lastDrop < this.state.cooldown) return true;



        return false;
    }

    async reach(game): Promise<boolean> {
        let result = this.findItem(game);

        if (result) {
            let {item, drop} = result;
            game.iventory.drop(item, drop);
            this.state.lastDrop = new Date().valueOf();
        }

        return true;
    }

    findItem(game: Game): { item: IventoryItem, drop: number } {
        for (let [itemName, qtd] of Object.entries(this.state.items)) {
            let itemCount = game.iventory.count(itemName);
            if (itemCount > qtd) {
                let item = game.iventory.findItem(itemName, true).shift();
                let drop = itemCount - qtd;
                return {item, drop}
            }
        }
        return null;
    }
}