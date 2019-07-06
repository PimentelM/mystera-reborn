import {Mob, Tile} from "./Types";



export interface IGameWindow {
    hp_status : {val},
    connection : WebSocket
    getMob(id) : Mob
    mob_ref : {[id : number] : Mob}
    me : number
    mx : number
    my : number
    map_index : {[coords : number] : Tile}
  }
  


  