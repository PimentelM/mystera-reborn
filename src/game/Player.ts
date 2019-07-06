import {Game} from "./Game";
import {Mob} from "./Types";

export class Player{
    public data : Mob;
    public game : Game;
    constructor(game : Game){
      this.game = game;
      this.updateData();
    }

    public updateData(){
        this.data = this.game.window.getMob(this.game.window.me)
    }
  
    public say(text){
        this.game.send({"type":"chat","data":text})
    }
  
  }
  
  
  