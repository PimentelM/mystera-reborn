import {IventoryItem, Mob, Point, PointMap, Tile} from "./Types";
import "./Types"

export interface IGameWindow {
    Player : any,
    GameMap : any,
    Iventory : any,
    Creatures : any,
    Game : any,
    Bot : any,

    PathFinder : any,

    StateController : any,
    StateFactory : any,

    hp_status: { val },
    hunger_status: { val },
    connection: WebSocket

    getMob(id): Mob,

    target : {id:number}

    mob_ref: Mob[]
    me: number
    mx: number
    my: number,
    dest: number,
    map_index: { [coords: number]: Tile },
    item_data: IventoryItem[],
    info_pane: { set_info : (mob: Mob) => any}

    jv : {equip_sprite : number}
}


export interface IWalkableTileMap {
    grid: number[][],
    origin: Point,
    points: PointMap
}
