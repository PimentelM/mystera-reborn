import {StateUnitClass} from "../../../Interfaces";
import {Game} from "../../../game/Game";
import {Point} from "../../../game/Types";

export interface KiteState {
    steps: number,

    target : Point;
    kitePath : Point[];
}

export class KiteSpear extends StateUnitClass{
    game: Game;
    public state: KiteState;

    readonly defaultParams: KiteState = {
        steps: 2, kitePath : [], target: null,
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
        await this.game.player.kite(this.state.target,this.state.steps, true,true);
        return true;
    }

    private isOk() {
        let {x,y} = this.game.player.mob;

        // 20% of the time, it will see 2 square distance as ok
        let distance = 3;  //Date.now() % 10 > 8 ? 2 : 3;

        let dX = this.state.target.x - x;
        let dY = this.state.target.y - y;

        let adX = Math.abs( dX );
        let adY = Math.abs( dY );

        if(distance <= 2){
            if(!(adY == 2 && adX == 0 || adX == 0 && adY == 2)) return false;
        } else {
            if(!(adY == 3 && adX == 0 || adX == 0 && adY == 3)) return false;
        }

        let tileBetween = { x: x + ( adX > 0 ? (dX > 0 ? 1 : -1) : 0 ), y: y + ( adY > 0 ? (dY > 0 ? 1 : -1) : 0 )};

        if (!this.game.map.isTileWalkable(tileBetween)) {
            return false;
        }

        // @ts-ignore
        if( adY === 3 || adX === 3){
            let tileBetween = { x: x + ( adX > 0 ? (dX > 0 ? 2 : -2) : 0 ), y: y + ( adY > 0 ? (dY > 0 ? 2 : -2) : 0 )};

            if (!this.game.map.isTileWalkable(tileBetween)) {
                return false;
            }
        }

        return true;

    }
}
