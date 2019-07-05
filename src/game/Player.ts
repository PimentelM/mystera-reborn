import {Game} from "./Game";

export class Player{
    public data : Mob;
    public game : Game;
    constructor(game : Game){
      this.game = game;
      this.data = game.window.getMob(game.window.me)
    }
  
    public say(text){
        this.game.send({"type":"chat","data":text})
    }
  
  }
  
  
  