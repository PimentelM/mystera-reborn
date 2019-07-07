import * as EasyStar from "easystarjs";
import {promisify} from "util";
import {Game} from "./Game";
import {Point} from "./Types";

export class PathFinder {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }


    public async findPath(x,y) : Promise<Point[]> {
        let pathFinder = new EasyStar.js();
        let {grid, origin, points} = this.game.map.getWalkableTileMap({destination: {x, y}});

        let gridStart = {x: this.game.player.mob.x - origin.x, y: this.game.player.mob.y - origin.y};

        let {destination} = points;

        if (!destination) {
            console.log("Point not found.");
            return [];
        }

        if (grid[destination.y][destination.x] != 0) {
            console.log("Destination is not walkable.");
            return [];
        }


        pathFinder.setGrid(grid);
        pathFinder.setAcceptableTiles([0]);
        pathFinder.disableDiagonals();
        pathFinder.disableCornerCutting();

        let findPathAsync : (oX,oY,x,y) => Promise<Point[]> = promisify((oX, oY, x, y, callback) => {
            pathFinder.findPath(oX, oY, x, y, callback);
            pathFinder.calculate();
        });

        let path = [];

        try {
            path = await findPathAsync(origin.x, origin.y, destination.x, destination.y);
        } catch (e) {
            if (e.message) {
                console.log("Error while finding path...");
                console.log(e.message);
                console.log(e.stack);
                return [];
            } else
                path = e;
        }

        if(!path){
            console.log("Could not find path to destination.");
            return [];
        }

        for (let step of path){
            step.x += gridStart.x;
            step.y += gridStart.y;
        }

        return path;
    }
}