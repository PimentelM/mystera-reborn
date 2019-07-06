import {Mob} from "./Types";



export interface IGameWindow {
    hp_status : {val},
    connection : WebSocket
    getMob(id) : Mob
    me : number
    mx : number
    my : number
    map_index : object
  }
  


  