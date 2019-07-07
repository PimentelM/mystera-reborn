import {Game} from "./Game";
import {TilePoint} from "./Types";

let wood = ["tree"];
let stone = ["Plain Rock"];

export class Resouces {
    public game: Game;

    constructor(game) {
        this.game = game;
    }

    public find(regex : string) : TilePoint{
        let tilePoints = this.game.map.findTilesWithItem(regex);
        return this.game.player.nearestPoint(tilePoints);
    }


    public findStone(){
        let regex = stone.map(x=>"("+x+")").join("|");
        return this.find(regex);
    }

}

