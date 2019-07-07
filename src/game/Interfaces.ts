import {IventoryItem, Mob, Point, PointMap, Tile} from "./Types";


export interface IGameWindow {
    Player : any,
    GameMap : any,
    Iventory : any,
    Creatures : any,
    Game : any,

    hp_status: { val },
    connection: WebSocket

    getMob(id): Mob

    mob_ref: Mob[]
    me: number
    mx: number
    my: number,
    dest: number,
    map_index: { [coords: number]: Tile },
    item_data: IventoryItem[],
}


export interface IWalkableTileMap {
    grid: number[][],
    origin: Point,
    points: PointMap
}
