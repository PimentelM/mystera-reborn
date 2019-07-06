import {Game} from "./Game";
import {Mob, Tile} from "./Types";
import {filter} from "minimatch";


export class Map {
    game: Game;

    public constructor(game: Game) {
        this.game = game;
    }

    public getTile(x, y): Tile {
        let tile = this.game.window.map_index[x * 1e4 + y];
        return tile;
    }

    public getWalkableMap( considerMobs = true) {
        let tileMap = [];
        let mobs = {};

        for (let mob of Object.entries(this.game.window.mob_ref).map(([_,x])=>x).filter(x=>!!x)){
            if (!mob) continue;
            mobs[mob.x*1e4+mob.y] = true;
        }

        this.game.player.updateData();
        for (let j = 0; j < 26; j++) {
            let xTiles = [];
            for (let i = 0; i < 36; i += 1) {
                let {mx,my} = this.game.window;

                let x = (mx + i);
                let y = (j + my);
                let index = x *1e4 + y

                if (x == this.game.player.data.x && y == this.game.player.data.y){
                    xTiles.push('x');
                    continue;
                }

                if(considerMobs){
                    if(mobs[index]){
                        xTiles.push(-1);
                        continue;
                    }
                }

                let tile = this.game.window.map_index[index];


                xTiles.push(tile ? tile.block : 1)
            }
            tileMap.push(xTiles);
        }

        return tileMap;
    }


}