import {StateUnitClass} from "../../Interfaces";
import {Game} from "../../game/Game";
import {Player} from "../../game/player/Player";
import {TilePoint} from "../../game/Types";

type ItemSpec = {
    tpl : string,
    quantity? : number,
}

export interface CraftItemState {
    items : ItemSpec[],

    equipable : boolean
    itemToCraft? : string
}

export class CraftItem extends StateUnitClass{
    public state: CraftItemState;

    readonly defaultParams: CraftItemState = {
        items : [], equipable : true
    };

    async isReached(): Promise<boolean> {
        this.state.itemToCraft =  await this.getItemToCraft();

        // Se não tiver um item pra craftar na lista de craft
        if(!this.state.itemToCraft) return true;


        return false;
    }

    async reach(): Promise<boolean> {

        await this.game.craft.craft(this.state.itemToCraft);

        return true;
    }

    private async getItemToCraft() : Promise<string>{
        for (let {tpl,quantity} of this.state.items){

            let {name,recipe, level} = await this.game.craft.getInfo(tpl);

            if(!name) continue;

            if(this.game.player.mob.level < level) continue;

            let itemCount = this.state.equipable ? this.game.player.equip.countEquipable(name) : this.game.iventory.count(name);
            if (itemCount >= (quantity || 1) )  continue;

            if (!this.game.iventory.containItems(recipe)) continue;

            return tpl;
        }

        return null;
    }

    game: Game;



}