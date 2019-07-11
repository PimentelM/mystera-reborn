import {StateDefinition} from "../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {IventoryItem} from "../../../game/Types";

export interface EatFoodState {
    foods : string[],
    minHunger : number,
}

export class EatFood extends StateDefinition{
    public state: EatFoodState;

    readonly defaultParams: EatFoodState = {
        foods : ["Salmonberry", "Cooked \\w*"], minHunger : 75
    };

    async isReached(game): Promise<boolean> {
        // If player is already ok
        if (game.player.status.hunger > this.state.minHunger) return true;

        // If there is no food
        if (!this.findFood(game)) return true;
        return false;
    }

    async reach(game): Promise<boolean> {
        let food = this.findFood(game);

        if(food)
            game.iventory.use(food);

        return true;
    }

    findFood(game: Game){
        for (let food of this.state.foods ){
            let found = game.iventory.findItem(food).shift();
            if(found) return found
        }
        return null;
    }
}