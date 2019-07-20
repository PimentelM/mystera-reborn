import {StateUnitClass} from "../../../Interfaces";
import {Game} from "../../../../game/Game";
import {Player} from "../../../../game/player/Player";
import {Point} from "../../../../game/Types";
import {defaultParams, WaypointState} from "./Common";



export class FollowWaypoint extends StateUnitClass{
    state: WaypointState;
    game: Game;

    readonly defaultParams: WaypointState = defaultParams;

    async isReached(): Promise<boolean> {
        // If there is no waypoint to follow
        if(!this.state.currentWaypoint) return true;

        let {x,y,radius} = this.state.currentWaypoint;

        // If player already is on waypoint
        if(this.game.player.distanceTo({x,y}) <= radius) return true;

        this.state.pathToWaypoint = await this.game.pathfinder.findPathIntoArea({x,y},radius);

        // If Player cant reach waypoint
        if(this.state.pathToWaypoint.length == 0) return true;

        return false;
    }

    async reach(): Promise<boolean> {
        let {x,y,radius} = this.state.currentWaypoint;
        let walkPromise =  this.game.player.walkIntoArea({x,y},radius,this.state.steps);
        return true;
    }


}

