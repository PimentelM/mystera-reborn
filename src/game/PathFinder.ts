import * as EasyStar from "easystarjs";
import {promisify} from "util";
import {Game} from "./Game";
import {Point, Tile, TilePoint} from "./Types";

export class PathFinder {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public async findAdjacentPath(x, y, allowDiagonals = false) {
        // Get walkable tiles around the point
        let tiles: TilePoint[] = [];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if(i==0&&j==0) continue;
                if(!allowDiagonals && !(Math.abs(i) ^ Math.abs(j))) continue;

                let tX = x+i;
                let tY = y+j;

                if(!this.game.map.isTileWalkable(tX,tY)){
                    continue;
                }

                let tile = this.game.map.getTile(tX,tY) as TilePoint;
                tile.x = tX;
                tile.y = tY;
                tiles.push(tile);
            }
        }

        // Sort them by distance
        let sortedTiles = this.game.player.sortByDistance(tiles);

        // Iterate over this list and return the first path you find.
        for (let tilePoint of sortedTiles){
            let path = await this.findPath(tilePoint.x,tilePoint.y);
            if(path.length>0) return path;
        }

        return [];
    }

    public async findPath(x, y): Promise<Point[]> {
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

        let findPathAsync: (oX, oY, x, y) => Promise<Point[]> = promisify((oX, oY, x, y, callback) => {
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

        if (!path) {
            console.log("Could not find path to destination.");
            return [];
        }

        for (let step of path) {
            step.x += gridStart.x;
            step.y += gridStart.y;
        }

        return path;
    }
}