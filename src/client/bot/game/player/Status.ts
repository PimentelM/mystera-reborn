import {Game} from "../Game";

export class Status{
    game : Game;
    constructor(game){
        this.game = game;
    }


    get hunger() {
        return this.game.window.hunger_status.val;
    }

    get hpppc(){
        return this.game.window.hp_status.val;
    }

}