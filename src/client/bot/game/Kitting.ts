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

    private setMaxTileAtGrid(grid,x,y,value){
        if(this.getTileAtGrid(grid,x,y) > value){
            grid[y][x] = value;
        }
    }


    private updateKitingGrid(grid: number[][]) {

        for(let y=0; y<grid.length; y++){
            for(let x=0; x<grid[y].length; x++) {


                if (grid[y][x] == tileType.creature) {
                    let a = 2;
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
                    let c = 2;
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
        this.updateKitingGrid(grid);

        pathFinder.setGrid(grid);

        pathFinder.avoidAdditionalPoint(destination.x,destination.y);

        // If there are mobs around player, set to avoid origin:
        if(this.game.creatures.findCreatures(".*",1)){
            pathFinder.avoidAdditionalPoint(origin.x,origin.y);
        }

        if(spear){
            pathFinder.setIsGoalFunction((cX,cY,tX,tY)=>{
                let _dX = tX - cX;
                let _dY = tY - cY;
                let dX = Math.abs(_dX);
                let dY = Math.abs(_dY);


                if((dX === 0 && dY === 2) || (dX === 2 && dY === 0)){
                    let tile = grid[cY + (_dY/2)] && grid[cY + (_dY/2)][cX + (_dX/2)] || 0;
                    let res = tile == tileType.self || tile >0;
                    console.log(cX,cY,tX,tY,res);
                    return res;
                }

                return false;
            })
        } else {
            pathFinder.setIsGoalFunction((cX,cY,tX,tY)=>{
                let dX = Math.abs(cX - tX);
                let dY = Math.abs(cY - tY);
                return distance == dX + dY;
            })
        }


        let acceptableTiles = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
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
