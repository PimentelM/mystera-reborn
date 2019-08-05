import {Game} from "./Game";
import {GroundItem, Mob, Point, PointMap, Tile, TilePoint} from "./Types";
import {IWalkableTileMap} from "./Interfaces";
import {until} from "../../../Utils";


export class Map {
    game: Game;

    public constructor(game: Game) {
        this.game = game;
    }


    get dlevel() {
        return this.game.window.dlevel;
    }

    public getTile(p : Point): Tile {
        let {x,y} = p;
        let tile = this.game.window.map_index[x * 1e4 + y];
        return tile;
    }

    public getTileByOffset(p : Point): Tile {
        let oX = p.x;
        let oY = p.y;
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

    public getItemAt(tile : Tile, regExp : string) : GroundItem{

        let test = (name: string, regExp: string): boolean => {
            return new RegExp(`^${regExp}$`,"i").test(name);
        };

        if (!tile || !tile.o) return null;
        let o = tile.o;
        if (o.length == 0) return null;

        for (let item of o) {
            if (test(item.name,regExp)) {
                return item;
            }
        }

        return null;
    }

    /**
     * Returns a tile containing a item you can reach.
     * @param filter is a regex string used to find the item on the ground
     * @param radius is the radius around the player where the search is allowed
     * @param pickupable tells if the item must be pickuable
     * @returns a point you can walk to adjacently or not depending on the type of item.
     */
    public async getReachableItemPosition(filter : string, radius : number = Infinity, pickupable : boolean = false) : Promise<TilePoint> {
        await until(()=>this.game.window.isUpdatingMap == false,20,1000);

        if(!filter) return null;
        let tiles = this.findTilesWithItem(filter,radius);
        if(pickupable) tiles = tiles.filter(x=>x.o.length >= 1 && !!x.o.slice(-1).pop().can_pickup);

        if(tiles.length == 0) return null;

        // It will be adjacent search if all found items are on unwalkable tiles.
        let adjacent = !tiles.find(x=>!x.block);
        return await this.game.player.nearestReachablePoint(tiles,adjacent);
    }


    public findTilesWithTemplate(template : string, radius : number = Infinity): TilePoint[]{
        let tiles = [];


        let rX = 16;
        let rY = 13;

        if(radius && radius < 13){
            rX = radius;
            rY = radius;
        }

        for (let oX = -rX; oX <= rX; oX++) {
            for (let oY = -rY; oY <= rY; oY++) {
                let x = this.game.player.mob.x + oX;
                let y = this.game.player.mob.y + oY;
                let tile = this.game.window.map_index[x * 1e4 + y];

                if(tile && tile.template == template){
                    (tile as TilePoint).x = x;
                    (tile as TilePoint).y = y;
                    tiles.push(tile);
                }

            }
        }


        return tiles;
    }


    public findTilesWithItem(regExp : string, radius : number = Infinity): TilePoint[] {
        let tiles = [];


        let rX = 16;
        let rY = 13;

        if(radius && radius < 13){
            rX = radius;
            rY = radius;
        }

        for (let oX = -rX; oX <= rX; oX++) {
            for (let oY = -rY; oY <= rY; oY++) {
                let x = this.game.player.mob.x + oX;
                let y = this.game.player.mob.y + oY;
                let tile = this.game.window.map_index[x * 1e4 + y];

                let item = this.getItemAt(tile,regExp);
                if(item){
                    (tile as TilePoint).x = item.x;
                    (tile as TilePoint).y = item.y;
                    tiles.push(tile);
                }

            }
        }


        return tiles;
    }

    public isTileWalkable<T extends Point>(p : T, considerMobs = true): boolean {
        let {x,y} = p;

        if (considerMobs) {
            for (let [_, mob] of Object.entries(this.game.window.mob_ref)) {
                if (!mob) continue;
                if (mob.id == this.game.window.me) continue;
                if (mob.x == x && mob.y == y) return false;
            }
        }

        let tile = this.getTile(p);
        if(!tile) return false;

        return !tile.block && tile.template != "325";
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

                let result;

                if (!tile) result = 1;
                else if ( this.isTileWalkable({x,y}, considerMobs)) result = 0;
                else result = 1;

                xTiles.push(result)
            }
            grid.push(xTiles);
        }

        return {grid, origin, points : translatedPoints};
    }


}
