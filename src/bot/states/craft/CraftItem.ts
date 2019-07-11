import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {TilePoint} from "../../../game/Types";

type ItemSpec = {
    tpl : string,
    quantity : number,
}

export interface CraftItemState {
    items : ItemSpec[],

    itemToCraft? : string
}

export class CraftItem extends StateDefinition{
    public state: CraftItemState;

    readonly defaultParams: CraftItemState = {
        items : []
    };

    async isReached(game): Promise<boolean> {
        this.state.itemToCraft =  await this.getItemToCraft(game);

        // Se não tiver um item pra craftar na lista de craft
        if(!this.state.itemToCraft) return true;


        return false;
    }

    async reach(game): Promise<boolean> {

        await game.craft.craft(this.state.itemToCraft);

        return true;
    }

    private async getItemToCraft(game : Game) : Promise<string>{
        for (let {tpl,quantity} of this.state.items){

            let {name,recipe, level} = await game.craft.getInfo(tpl);

            if(!name) continue;

            if(game.player.mob.level < level) continue;

            let itemCount = game.iventory.count(name);
            if (itemCount >= quantity)  continue;

            if (!game.iventory.containsRecipe(recipe)) continue;

            return tpl;
        }

        return null;
    }



}