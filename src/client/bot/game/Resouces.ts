import {Game} from "./Game";
import {TilePoint} from "./Types";

let wood = ["Fir tree"];
let stone = ["Plain Rock"];

let listToRegex = (list) => `(^${list.join("$)|(^")}$)`;

export class Resouces {
    public game: Game;

    constructor(game) {
        this.game = game;
    }

    public find(regex : string | string[]) : TilePoint{
        if (typeof regex !== "string"){
            regex = listToRegex(regex)
        }

        let tilePoints = this.game.map.findTilesWithItem(regex);
        return this.game.player.nearestPoint(tilePoints);
    }


    public findStone(){
        return this.find(stone);
    }

    public findTree(){
        return this.find(wood);
    }

}

