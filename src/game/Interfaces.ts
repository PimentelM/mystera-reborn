import {IventoryItem, Mob, Point, PointMap, Tile} from "./Types";
import "./Types"
import {ControllerState} from "../bot/states/StateController";
import {ParserState} from "./Parser";



// Persistent data from the bot
export interface IGameWindow {
    controllerState : object | ControllerState

    parsersState: object | ParserState

    isUpdatingMap : boolean
    didBotUpgrade : number
    areHooksInstalled : boolean
    controllerId : number,
}


// global variables from the bot
export interface IGameWindow {
    Player : any,
    GameMap : any,
    Iventory : any,
    Creatures : any,
    Game : any,
    Bot : any,
    Craft : any,
    Equip : any,
    Upgrades : any,
    Scanner : any
    PathFinder : any,
    StateController : any,
    StateFactory : any,
    Parser : any
}


// Game data
export interface IGameWindow {


    hp_status: { val },
    hunger_status: { val },
    connection: WebSocket

    getMob(id): Mob,

    dlevel : string,

    target : {id:number}
    parse : (object : object) => any
    mob_ref: Mob[]
    me: number
    mx: number
    my: number,
    dest: number,
    map_index: { [coords: number]: Tile },
    item_data: IventoryItem[],
    info_pane: { set_info : (mob: Mob) => any}

    action : number,

    jv : {equip_sprite : number, upgrade_number : number}
}


export interface IWalkableTileMap {
    grid: number[][],
    origin: Point,
    points: PointMap
}
