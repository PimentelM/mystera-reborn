import {Game} from "./Game";
import {Mob, Point} from "./Types";
import {doWhen, sleep} from "../Utils";
import * as EasyStar from "easystarjs"
import {distanceBetween} from "./Utils";

const {promisify} = require('util');


export class Player {
    public mob: Mob;
    public game: Game;

    constructor(game: Game) {
        this.game = game;
        doWhen(()=>this.updateData(),()=> !!this.game.window.getMob(this.game.window.me),500)
    }

    public distanceTo<T extends Point>(point: T) {
        return distanceBetween(this.mob, point);
    };

    private __cmp = (pointA: Point, pointB: Point) : number => {
        let distanceToA = this.distanceTo(pointA);
        let distanceToB = this.distanceTo(pointB);
        return distanceToA - distanceToB;
    };

    public nearestPoint<T extends Point>(mobs: T[]) : T {
        return mobs.sort(this.__cmp).shift();
    }

    public attack(mob: Mob) {
        this.game.window.info_pane.set_info(mob);
    }

    public updateData() {
        this.mob = this.game.window.getMob(this.game.window.me)
    }

    public turn(d: number) {
        this.game.send({"type": "m", "x": this.mob.x, "y": this.mob.y, d})
    }

    public lookAt(x, y) {
        let dX = x - this.mob.x;
        let dY = y - this.mob.y;

        if (Math.abs(dX) > Math.abs(dY)) {
            if (dX < 0) return this.turn(3);
            if (dX > 0) return this.turn(1);
        } else {
            if (dY < 0) return this.turn(0);
            if (dY > 0) return this.turn(2);
        }
    }

    public say(text) {
        let sufix = "";
        let prefix = "";
        this.game.send({"type": "chat", "data": prefix + text + sufix})
    }

    public pick() {
        this.game.send({type: "g"});
    }

    public action() {
        this.game.send({type: "A"});
        this.game.send({type: "a"});
    }

    public keepAction() {
        this.game.send({type: "A"});
        let {x, y} = this.mob;

        let stop = () => this.game.send({type: "a"});
        let playerMoved = () => this.mob.x != x || this.mob.y != y;

        // Stop action when player move;
        doWhen(stop, playerMoved, 200);
    }

    private async stepTo({x, y}: Point) {
        if (this.mob.x == x && this.mob.y == y) return true;

        this.mob.move(x, y);

        if (!this.game.map.isTileWalkable(x, y)) {
            return false;
        }

        let timeout = 1000;
        let checkPeriod = 5;
        let elapsedtime = 0;
        while (true) {
            if (this.game.window.dest == -1) {
                return true;
            } else if (elapsedtime > timeout) {
                return false;
            }
            await sleep(checkPeriod);
            elapsedtime += checkPeriod;
        }

    }

    private async serialStepTo(points: Point[]) {
        while (points.length > 0) {
            let nextPoint = points.shift();
            if (await this.stepTo(nextPoint) == false)
                return false;
        }
        return true;
    }


    public async walkToOffset(oX, oY) {
        let {x, y} = this.mob;
        return await this.walkTo(x + oX, y + oY);
    }

    public async walkTo(x, y) {
        if (this.mob.x == x && this.mob.y == y) return true;
        let path = await this.game.pathfinder.findPath(x, y);

        if (path.length == 0) return false;

        return await this.serialStepTo(path);

    }

}
  
  
  