import {Game} from "./Game";
import {Point} from "./Types";
import * as EasyStar from "easystarjs";
import {promisify} from "util";
import {tileType} from "../Interfaces";
import {Player} from "./player/Player";
import {Creatures} from "./Creatures";

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


    private updateKitingGrid(grid: number[][]) {

        for(let y=0; y<grid.length; y++){
            for(let x=0; x<grid[y].length; x++) {


                if (grid[y][x] == tileType.creature) {

                    // 0 0 2 0 0
                    // 0 3 4 3 0
                    // 2 4 x 4 2
                    // 0 3 4 3 0
                    // 0 0 2 0 0
                    for (let i=-2; i <= 2; i++){
                        for (let j=-2; j<=2;j++){
                            // 2
                            if((Math.abs(i) == 2 && j == 0) || (Math.abs(j) == 2 && i == 0)){
                                this.incrementTileAtGridBy(grid,x+i,y+j,2)
                            }
                            // 3 & 4
                            if(Math.abs(i) <= 1 && Math.abs(j) <= 1){
                                this.incrementTileAtGridBy(grid,x+i,y+j,i === j ? 3 : 4)
                            }
                        }
                    }



                } else if (grid[y][x] == tileType.obstacle || grid[y][x] == tileType.player){
                    // 0 0 1 0 0
                    // 0 1 2 1 0
                    // 1 2 x 2 1
                    // 0 1 2 1 0
                    // 0 0 1 0 0
                    for (let i=-2; i <= 2; i++){
                        for (let j=-2; j<=2;j++){
                            // outer 1
                            if((Math.abs(i) == 2 && j == 0) || (Math.abs(j) == 2 && i == 0)){
                                this.incrementTileAtGridBy(grid,x+i,y+j,1)
                            }
                            // 1 & 2
                            if(Math.abs(i) <= 1 && Math.abs(j) <= 1){
                                this.incrementTileAtGridBy(grid,x+i,y+j,i === j ? 1 : 2)
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
        this.updateKitingGrid(grid);

        pathFinder.setGrid(grid);

        pathFinder.avoidAdditionalPoint(destination.x,destination.y);

        // If there are mobs around player, set to avoid origin:
        if(this.game.creatures.findCreatures(".*",1)){
            pathFinder.avoidAdditionalPoint(origin.x,origin.y);
        }

        if(spear){
            pathFinder.setIsGoalFunction((cX,cY,tX,tY)=>{
                let dX = Math.abs(cX - tX);
                let dY = Math.abs(cY - tY);

                if(dX === 0 && dY === 2) return true;
                if(dX === 2 && dY === 0) return true;

                return false;
            })
        } else {
            pathFinder.setIsGoalFunction((cX,cY,tX,tY)=>{
                let dX = Math.abs(cX - tX);
                let dY = Math.abs(cY - tY);
                return distance == dX + dY;
            })
        }


        let acceptableTiles = [1,2,3,4,5,6,7,8,9,10];
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
