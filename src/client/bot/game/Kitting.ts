import {Game} from "./Game";
import {Point} from "./Types";
import * as EasyStar from "easystarjs";
import {promisify} from "util";
import {tileType} from "../Interfaces";
import {Player} from "./player/Player";
import {Creatures} from "./Creatures";

let isTileWalkable = ( p : {x: number, y : number}, grid : number[][]) => {
    let {x,y} = p;

    return grid[y] && (grid[y][x] > 0 || grid[y][x] === tileType.self)
};




export class Kitting{
    game : Game;
    public constructor(game){
        this.game = game;
    }


    private getTileAtGrid(grid,x,y){
        return grid[y] && grid[y][x] || tileType.obstacle;
    }

    private setTileAtGrid(grid,x,y,value){
        if(grid[y]){
            grid[y][x] = value;
        }
    }

    private incrementTileAtGridBy(grid,x,y,value){
        if(this.getTileAtGrid(grid,x,y) > 0){
            grid[y][x] += value;
        }
    }

    private setMaxTileAtGrid(grid,x,y,value){
        if(this.getTileAtGrid(grid,x,y) > value){
            grid[y][x] = value;
        }
    }


    private updateKitingGrid(grid: number[][],destination) {

        for(let y=0; y<grid.length; y++){
            for(let x=0; x<grid[y].length; x++) {

                if(destination && destination.x == x && destination.y == y){
                    let a = 13;
                    let b = 3;
                    let c = 0;
                    // 0 0 c 0 0
                    // 0 b a b 0
                    // c a x a c
                    // 0 b a b 0
                    // 0 0 c 0 0
                    for (let i=-2; i <= 2; i++){
                        for (let j=-2; j<=2;j++){
                            // 2
                            if((Math.abs(i) == 2 && j == 0) || (Math.abs(j) == 2 && i == 0)){
                                this.incrementTileAtGridBy(grid,x+i,y+j,c)
                            }
                            // 3 & 4
                            if(Math.abs(i) <= 1 && Math.abs(j) <= 1){
                                this.incrementTileAtGridBy(grid,x+i,y+j,i === j ? b : a)
                            }
                        }
                    }
                } else if (grid[y][x] == tileType.creature) {
                    let a = 8;
                    let b = 1;
                    let c = 1;
                    // 0 0 c 0 0
                    // 0 b a b 0
                    // c a x a c
                    // 0 b a b 0
                    // 0 0 c 0 0
                    for (let i=-2; i <= 2; i++){
                        for (let j=-2; j<=2;j++){
                            // 2
                            if((Math.abs(i) == 2 && j == 0) || (Math.abs(j) == 2 && i == 0)){
                                this.incrementTileAtGridBy(grid,x+i,y+j,c)
                            }
                            // 3 & 4
                            if(Math.abs(i) <= 1 && Math.abs(j) <= 1){
                                this.incrementTileAtGridBy(grid,x+i,y+j,i === j ? b : a)
                            }
                        }
                    }



                } else if (grid[y][x] == tileType.obstacle || grid[y][x] == tileType.player){
                    let a = 4;
                    let b = 2;
                    let c = 1;
                    // 0 0 c 0 0
                    // 0 b a b 0
                    // c a x a c
                    // 0 b a b 0
                    // 0 0 c 0 0
                    for (let i=-2; i <= 2; i++){
                        for (let j=-2; j<=2;j++){
                            // 2
                            if((Math.abs(i) == 2 && j == 0) || (Math.abs(j) == 2 && i == 0)){
                                this.incrementTileAtGridBy(grid,x+i,y+j,c)
                            }
                            // 3 & 4
                            if(Math.abs(i) <= 1 && Math.abs(j) <= 1){
                                this.incrementTileAtGridBy(grid,x+i,y+j,i === j ? b : a)
                            }
                        }
                    }


                }


            }
        }

    }


    public async findKitingPath(p:Point, spear = true, distance = 2){
        let {x,y} = p;
        let pathFinder = new EasyStar.js();
        let {grid, origin, points} = this.game.pathfinder.getWalkableTileMap({destination: {x, y}});

        let gridStart = {x: this.game.player.mob.x - origin.x, y: this.game.player.mob.y - origin.y};

        let {destination} = points;

        if (!destination) {
            return [];
        }

        // Set destination as walkable so path finder does not complain;

        grid[destination.y][destination.x] = 1;

        // update grid with costs
        this.updateKitingGrid(grid,destination);

        pathFinder.setGrid(grid);

        pathFinder.avoidAdditionalPoint(destination.x,destination.y);

        // If there are mobs around player, set to avoid origin:
        if(this.game.creatures.findCreatures(".*",1)){
            pathFinder.avoidAdditionalPoint(origin.x,origin.y);
        }

        let isSpearTile = (cX,cY,tX,tY)=>{
            let dX = tX - cX;
            let dY = tY - cY;

            let adX = Math.abs( dX );
            let adY = Math.abs( dY );

            if(distance <= 2){
                if(!(adY == 2 && adX == 0 || adX == 0 && adY == 2)) return false;
            } else {
                if(!(adY == 3 && adX == 0 || adX == 0 && adY == 3)) return false;
            }

            let tileBetween = { x: cX + ( adX > 0 ? (dX > 0 ? 1 : -1) : 0 ), y: cY + ( adY > 0 ? (dY > 0 ? 1 : -1) : 0 )};

            if (!isTileWalkable(tileBetween,grid)) {
                return false;
            }

            // @ts-ignore
            if( adY === 3 || adX === 3){
                let tileBetween = { x: cX + ( adX > 0 ? (dX > 0 ? 2 : -2) : 0 ), y: cY + ( adY > 0 ? (dY > 0 ? 2 : -2) : 0 )};

                if (!isTileWalkable(tileBetween,grid)) {
                    return false;
                }
            }

            return true;
        };


        if(spear){
            // If is already spear tile, returns [];
            if(isSpearTile(origin.x,origin.y,destination.x,destination.y))
            {
                return [];
            }

            pathFinder.setIsGoalFunction(isSpearTile)
        } else {
            pathFinder.setIsGoalFunction((cX,cY,tX,tY)=>{
                let dX = Math.abs(cX - tX);
                let dY = Math.abs(cY - tY);
                return distance == dX + dY;
            })
        }


        let acceptableTiles = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
        pathFinder.setAcceptableTiles(acceptableTiles);
        acceptableTiles.forEach(tile=>pathFinder.setTileCost(tile,tile));

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



}
