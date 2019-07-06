import {Connection} from "../Connection";
import {Player} from "./Player";
import {IGameWindow} from "./Interfaces";
import {Map} from "./Map";


export class Game{
    public window : IGameWindow;
    public con : Connection;
  
    public player : Player;
    public map : Map;

  
    public constructor(con : Connection, window : IGameWindow){
      this.con = con;
      this.window = window;
      this.player = new Player(this);
      this.map = new Map(this);
    }
  
    public send(data){
      return this.con.send(data)
    }
  
  }