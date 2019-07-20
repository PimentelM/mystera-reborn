import {StateUnitClass} from "../../../Interfaces";
import {Game} from "../../../../game/Game";
import {Player} from "../../../../game/player/Player";
import {Point} from "../../../../game/Types";
import {defaultParams, WaypointState} from "./Common";

export class AdvanceWaypoint extends StateUnitClass {
    state: WaypointState;
    game: Game;

    readonly defaultParams: WaypointState = defaultParams;

    async isReached(): Promise<boolean> {
        // If there are no waypoints
        if (!this.state.waypoints || this.state.waypoints.length == 0) return true;

        return false;
    }

    async reach(): Promise<boolean> {

        this.advanceWayPoint();

        return true;
    }

    advanceWayPoint() {
        if (this.state.loop) {
            if (this.state.index === undefined) this.state.index = 0;
            else this.state.index+=1;

            this.state.index = this.state.index % this.state.waypoints.length;
            this.state.currentWaypoint = this.state.waypoints[this.state.index];
        } else {
            this.state.currentWaypoint = this.state.waypoints.shift();
        }
    }

}

