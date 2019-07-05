import {Connection} from "../Connection";
import {Player} from "./Player";


export class Game{
    public window : GameWindow;
    public con : Connection;
  
    public player : Player;
  
    public constructor(con : Connection, window : GameWindow){
      this.con = con;
      this.window = window;
      this.player = new Player(this);
    }
  
    public send(data){
      return this.con.send(data)
    }
  
  }