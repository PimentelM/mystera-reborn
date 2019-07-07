import {Game} from "./Game";
import {Mob, Point} from "./Types";
import {doWhenTestPass, sleep} from "../Utils";
import * as EasyStar from "easystarjs"

const {promisify} = require('util');


export class Player {
    public mob: Mob;
    public game: Game;

    constructor(game: Game) {
        this.game = game;

        new Promise(async () => {

            while (true) {
                if (this.game.window.getMob(this.game.window.me)) {
                    this.updateData();
                    break;
                }
                await sleep(500);
            }

        })
    }

    public attack(mob:Mob){
        this.game.window.info_pane.set_info(mob);
    }

    public updateData() {
        this.mob = this.game.window.getMob(this.game.window.me)
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
        doWhenTestPass(stop, playerMoved, 200);
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
  
  
  