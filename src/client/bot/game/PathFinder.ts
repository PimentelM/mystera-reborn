import * as EasyStar from "easystarjs";
import {promisify} from "util";
import {Game} from "./Game";
import {Point, PointMap, Tile, TilePoint} from "./Types";
import {IWalkableTileMap} from "./Interfaces";
import {Create2DArray} from "../../../Utils";
import {tileType} from "../Interfaces";


let MAP_WIDTH = 36;
let MAP_HEIGH = 26;

export class PathFinder {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public async findPathIntoArea(p: Point, range : number){
        let {x,y} = p;
        // Get walkable tiles around the point
        let tiles: TilePoint[] = [];

        let radius = range;
        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                // Prevents distance from being bigger than range.
                if(Math.abs(i) + Math.abs(j) > range) continue;

                let tX = x+i;
                let tY = y+j;

                let tP = {x:tX,y:tY};

                if(!this.game.map.isTileWalkable(tP)){
                    continue;
                }

                let tile = this.game.map.getTile(tP) as TilePoint;
                tile.x = tX;
                tile.y = tY;
                tiles.push(tile);
            }
        }

        // Sort them by distance
        let sortedTiles = this.game.player.sortByDistance(tiles);

        // Iterate over this list and return the first path you find.
        for (let tilePoint of sortedTiles){
            let path = await this.findPath(tilePoint);
            if(path.length>0) return path;
        }

        return [];
    }

    public async findAdjacentPath(p : Point, allowDiagonals = false) {
        let {x,y} = p;
        // Get walkable tiles around the point
        let tiles: TilePoint[] = [];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if(i==0&&j==0) continue;
                if(!allowDiagonals && !(Math.abs(i) ^ Math.abs(j))) continue;

                let tX = x+i;
                let tY = y+j;

                let tP = {x:tX,y:tY};

                if(!this.game.map.isTileWalkable(tP)){
                    continue;
                }

                let tile = this.game.map.getTile(tP) as TilePoint;
                tile.x = tX;
                tile.y = tY;
                tiles.push(tile);
            }
        }

        // Sort them by distance
        let sortedTiles = this.game.player.sortByDistance(tiles);

        // Iterate over this list and return the first path you find.
        for (let tilePoint of sortedTiles){
            let path = await this.findPath(tilePoint);
            if(path.length>0) return path;
        }

        return [];
    }

    public async findPath(p : Point): Promise<Point[]> {
        let {x,y} = p;
        let pathFinder = new EasyStar.js();
        let {grid, origin, points} = this.getWalkableTileMap({destination: {x, y}});

        let gridStart = {x: this.game.player.mob.x - origin.x, y: this.game.player.mob.y - origin.y};

        let {destination} = points;

        if (!destination) {
            return [];
        }

        if (grid[destination.y][destination.x] <= 0) {
            return [];
        }


        pathFinder.setGrid(grid);
        pathFinder.setAcceptableTiles([1]);
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
            return [];
        }

        for (let step of path) {
            step.x += gridStart.x;
            step.y += gridStart.y;
        }

        return path.slice(1);
    }

    public getWalkableTileMap(points : PointMap = {}): IWalkableTileMap {
        let grid = Create2DArray(MAP_WIDTH,MAP_HEIGH,0); // MAP_WIDTH x MAP_HEIGH map
        let origin = {x: -1, y: -1};
        let translatedPoints = {};
        let mobs={};
        let players={};

        this.game.player.updateData();
        let {mx, my} = this.game.window;
        let {x, y} = this.game.player.mob;
        let pX = x;
        let pY = y;

        // Populate mobs and players map
        for (let [_, mob] of Object.entries(this.game.window.mob_ref)) {
            if (!mob) continue;
            if(this.game.creatures.isPlayer(mob)){
                players[mob.x * 1e4 + mob.y] = true;
            } else {
                mobs[mob.x * 1e4 + mob.y] = true;
            }
        }


        for (let [pointName,point] of Object.entries(points)){
            let x = point.x - mx;
            let y = point.y - my;

            if(x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGH){
                continue
            }

            translatedPoints[pointName] = {x, y};
        }

        for(let [coordinates,tile] of Object.entries(this.game.window.map_index)){
            let x = Number(coordinates.slice(0,coordinates.length - 4));
            let y = Number(coordinates.slice(4));
            let i = x - mx;
            let j = y - my;

            if(i < 0 || j < 0 || i >= MAP_WIDTH || j >= MAP_HEIGH){
                continue
            }

            if (x == pX && y == pY) {
                grid[j][i] = tileType.self;
                origin.x = i;
                origin.y = j;
                continue;
            } else if (mobs[coordinates]){
                grid[j][i] = tileType.creature;
            } else if (players[coordinates]){
                grid[j][i] = tileType.player;
            }

            let tile = this.game.window.map_index[coordinates];

            if(!tile) continue;

            if (this.game.map.isTileWalkable({x,y}, true))
            {
                grid[j][i] = 1;
            }

        }

        return {grid, origin, points : translatedPoints};
    }


}
