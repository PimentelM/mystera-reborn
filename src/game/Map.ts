import {Game} from "./Game";
import {Mob, Point, PointMap, Tile} from "./Types";
import {filter} from "minimatch";
import {IWalkableTileMap} from "./Interfaces";
import {Iventory} from "./Iventory";


export class Map {
    game: Game;

    public constructor(game: Game) {
        this.game = game;
    }

    public getTile(x, y): Tile {
        let tile = this.game.window.map_index[x * 1e4 + y];
        return tile;
    }

    public getTileByOffset(oX, oY): Tile {
        let x = this.game.player.mob.x + oX;
        let y = this.game.player.mob.y + oY;
        let tile = this.game.window.map_index[x * 1e4 + y];
        return tile;
    }

    public getTilesAround(radius = 1): Tile[] {
        let tiles = [];
        for (let oX = -radius; oX <= radius; oX++) {
            for (let oY = -radius; oY <= radius; oY++) {
                let x = this.game.player.mob.x + oX;
                let y = this.game.player.mob.y + oY;
                let tile = this.game.window.map_index[x * 1e4 + y];
                tiles.push(tile);
            }
        }
        return tiles;
    }

    public findTilesWithItems(regExps : string[]): Tile[] {
        let tiles = [];

        let test = (name: string, regExp: string): boolean => {
            return new RegExp(regExp,"i").test(name);
        };

        for (let [_, tile] of Object.entries(this.game.window.map_index)) {
            if (!tile || !tile.o) continue;
            let o = tile.o;
            if (o.length == 0) continue;

            for (let item of o) {
                for (let regExp of regExps) {
                    if (test(item.name,regExp)) {
                        tiles.push(tile);
                        break;
                    }
                }
            }
        }

        return tiles;
    }

    public findTilesWithItem(regExp : string){
        return this.findTilesWithItems([regExp])
    }
    public isTileWalkable(x, y, considerMobs = true): boolean {

        if (considerMobs) {
            for (let [_, mob] of Object.entries(this.game.window.mob_ref)) {
                if (!mob) continue;
                if (mob.id == this.game.window.me) continue;
                if (mob.x == x && mob.y == y) return false;
            }
        }

        return !this.getTile(x, y).block;
    }

    public getWalkableTileMap(points : PointMap = {}, considerMobs = true): IWalkableTileMap {
        let grid = [];
        let mobs = {};

        let origin = {x: -1, y: -1};

        let translatedPoints = {};

        for (let [_, mob] of Object.entries(this.game.window.mob_ref)) {
            if (!mob) continue;
            mobs[mob.x * 1e4 + mob.y] = true;
        }

        this.game.player.updateData();
        let {mx, my} = this.game.window;
        let {x, y} = this.game.player.mob;
        let pX = x;
        let pY = y;
        for (let j = 0; j < 26; j++) {
            let xTiles = [];
            for (let i = 0; i < 36; i += 1) {

                let x = (mx + i);
                let y = (j + my);
                let index = x * 1e4 + y;

                for (let [pointName,point] of Object.entries(points)){
                    if (point.x == x && point.y == y){
                        translatedPoints[pointName] = {x: i, y:j};
                    }
                }

                if (x == pX && y == pY) {
                    xTiles.push(2);
                    origin.x = i;
                    origin.y = j;
                    continue;
                }

                if (considerMobs) {
                    if (mobs[index]) {
                        xTiles.push(-1);
                        continue;
                    }
                }

                let tile = this.game.window.map_index[index];

                xTiles.push(tile ? tile.block : 1)
            }
            grid.push(xTiles);
        }

        return {grid, origin, points : translatedPoints};
    }


}