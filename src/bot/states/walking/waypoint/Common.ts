import {Point} from "../../../../game/Types";
import {Game} from "../../../../game/Game";

export interface Waypoint extends Point {
    dlevel : string , radius : number
}

export interface WaypointState{
    steps : number
    waypoints : Waypoint[]
    loop : boolean

    getNextWaypointList? : (game : Game) => Waypoint[]
    currentWaypoint? : Waypoint
    pathToWaypoint? : Point[]
    index? : number


}

export let defaultParams : WaypointState = {
    steps : 2, waypoints : [], loop : true
};