import {StateUnitClass} from "../../../Interfaces";
import {Game} from "../../../game/Game";
import {Player} from "../../../game/player/Player";
import {Point} from "../../../game/Types";

export interface KiteState {
    spear : boolean,
    distance : number,
    steps: number,

    target : Point;
    kitePath : Point[];
}

export class Kite extends StateUnitClass{
    game: Game;
    public state: KiteState;

    readonly defaultParams: KiteState = {
        spear: true, distance: 2, steps: 2, kitePath : [], target: null,
    };

    async isReached(): Promise<boolean> {
        this.state.target = this.game.player.getTarget();

        // Se não possui target
        if(!this.state.target) return true;

        // Se já está na distância ideal
        if(this.isOk()) return true;

        return false;
    }

    async reach(): Promise<boolean> {
        this.game.player.kite(this.state.target,this.state.steps, this.state.spear, this.state.distance);
        return true;
    }

    private isOk() {
        if(!this.state.spear) {
            return this.game.player.distanceTo(this.state.target) == this.state.distance;
        }else{
            let {x,y} = this.game.player.mob;

            let dX = this.state.target.x - x;
            let dY = this.state.target.y - y;

            let adX = Math.abs( dX );
            let adY = Math.abs( dY );

            if (!(adY == 2 && adX == 0 || adX == 0 && adY == 2)) return false;

            let tileBetween = { x: x + dX/2, y: y + dY/2};

            if (this.game.map.isTileWalkable(tileBetween)) return false;

            return true;
        }
    }
}
