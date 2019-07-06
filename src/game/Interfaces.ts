import {IventoryItem, Mob, Point, PointMap, Tile} from "./Types";


export interface IGameWindow {
    hp_status: { val },
    connection: WebSocket

    getMob(id): Mob

    mob_ref: { [id: number]: Mob }
    me: number
    mx: number
    my: number,
    dest: number,
    map_index: { [coords: number]: Tile },
    item_data: IventoryItem[]
}


export interface IWalkableTileMap {
    grid: number[][],
    origin: Point,
    points: PointMap
}
