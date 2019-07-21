import {StateUnitClass} from "../../../../Interfaces";
import {Game} from "../../../../game/Game";
import {Player} from "../../../../game/player/Player";
import {Point} from "../../../../game/Types";
import {defaultParams, WaypointState} from "./Common";

export class SwitchWaypointList extends StateUnitClass {
    state: WaypointState;
    game: Game;

    readonly defaultParams: WaypointState = defaultParams;

    async isReached(): Promise<boolean> {
        // If there is no waypoint getter function
        if (!this.state.getNextWaypointList) return true;

        return false;
    }

    async reach(): Promise<boolean> {

        this.switchWaypointList();

        return true;
    }

    switchWaypointList() {
        this.state.waypoints = this.state.getNextWaypointList(this.game);
    }

}

