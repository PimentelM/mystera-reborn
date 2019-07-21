import {StateUnitClass} from "../../Interfaces";
import {Game} from "../../game/Game";
import {Player} from "../../game/player/Player";
import {IventoryItem} from "../../game/Types";

export interface EatFoodState {
    foods : string[],
    minHunger : number,
}

export class EatFood extends StateUnitClass{
    public state: EatFoodState;

    readonly defaultParams: EatFoodState = {
        foods : ["^Salmonberry$", "Cooked \\w*", "^Carrot$"], minHunger : 75
    };

    async isReached(): Promise<boolean> {
        // If player is already ok
        if (this.game.player.status.hunger > this.state.minHunger) return true;

        // If there is no food
        if (!this.findFood()) return true;
        return false;
    }

    async reach(): Promise<boolean> {
        let food = this.findFood();

        if(food)
            this.game.iventory.use(food);

        return true;
    }

    findFood(){
        for (let food of this.state.foods ){
            let found = this.game.iventory.findItem(food).shift();
            if(found) return found
        }
        return null;
    }

    game: Game;
}