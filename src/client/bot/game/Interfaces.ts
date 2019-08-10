import {IventoryItem, Mob, Point, PointMap, Tile} from "./Types";
import "./Types"
import {ControllerState, StateController} from "../state/StateController";
import {ParserState} from "./Parser";
import {StateFactory} from "../state/StateFactory";

export interface HudData {
    x: number,
    y: number,
    mapName: string
}

// Persistent data from the bot
export interface IBotState {
    controllerState: object | ControllerState

    parsersState: object | ParserState

    isUpdatingMap: boolean
    didBotUpgrade: number
    areHooksInstalled: boolean
    controllerId: number,

    hudData: HudData
}


// global variables from the bot
export interface IGameWindow extends IBotState {
    Player: any,
    GameMap: any,
    Iventory: any,
    Creatures: any,
    Kitting: any,
    Game: any,
    Bot: any,
    Craft: any,
    Equip: any,
    Upgrades: any,
    Scanner: any
    PathFinder: any,
    StateController: StateController,
    StateFactory: StateFactory,
    Parser: any
}


// Game data
export interface IGameWindow {


    hp_status: { val },
    hunger_status: { val },
    connection: WebSocket

    getMob(id): Mob,

    dlevel: string,

    build_data: { t: string, r: { [material: string]: number }, n: string }[],

    target: { id: number }
    parse: (object: object) => any
    mob_ref: Mob[]
    me: number
    mx: number
    my: number,
    dest: number,
    map_index: { [coords: number]: Tile },
    item_data: IventoryItem[],
    info_pane: { set_info: (mob: Mob) => any }

    action: number,

    jv: { equip_sprite: number,
        upgrade_number: number,
        map_title : { _text : string },
        update_map : (x) => undefined
    }
}


export interface IWalkableTileMap {
    grid: number[][],
    origin: Point,
    points: PointMap
}
