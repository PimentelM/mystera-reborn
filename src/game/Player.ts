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

    public updateData() {
        this.mob = this.game.window.getMob(this.game.window.me)
    }

    public say(text) {
        let sufix = "";
        let prefix = "";
        this.game.send({"type": "chat", "data": prefix + text + sufix})
    }

    public pick(){
        this.game.send({type: "g"});
    }

    public action(){
        this.game.send({type: "A"});
        this.game.send({type: "a"});
    }

    public keepAction(){
        this.game.send({type:"A"});
        let {x,y} = this.mob;

        let stop = ()=> this.game.send({type:"a"});
        let playerMoved = ()=> this.mob.x != x || this.mob.y != y;

        // Stop action when player move;
        doWhenTestPass(stop,playerMoved,200);
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


    public async walkTo(x, y) {
        let pathFinder = new EasyStar.js();
        let {grid, origin, points} = this.game.map.getWalkableTileMap({destination: {x, y}});

        let gridStart = {x: this.mob.x - origin.x, y: this.mob.y - origin.y};

        let {destination} = points;

        if (!destination) {
            console.log("Point not found.");
            return false;
        }


        pathFinder.setGrid(grid);
        pathFinder.setAcceptableTiles([0]);
        pathFinder.disableDiagonals();
        pathFinder.disableCornerCutting();

        let findPathAsync = promisify((oX, oY, x, y, callback) => {
            pathFinder.findPath(oX, oY, x, y, callback);
            pathFinder.calculate();
        });

        let path = [];

        try {
            path = await findPathAsync(origin.x, origin.y, destination.x, destination.y);
        } catch (e) {
            if(e.message){
                console.log("Error while finding path...");
                console.log(e.message);
                console.log(e.stack);
                return false;
            }
            else
                path = e;
        }

        for (let step of path){
            step.x += gridStart.x;
            step.y += gridStart.y;
        }


        return await this.serialStepTo(path);

    }

}
  
  
  