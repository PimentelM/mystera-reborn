import {Game} from "./Game";
import {Tile} from "./Types";


export class Map {
    game: Game;

    public constructor(game: Game) {
        this.game = game;
    }

    public getTile(x, y): Tile {
        let tile = this.game.window.map_index[x * 1e4 + y];
        tile.items = tile.o;
        return tile;
    }

    public getWalkableMap() {
        let tileMap = [];

        for (let j = 0; j < 26; j++) {
            let xTiles = [];
            for (let i = 1; i < 36; i += 1) {

                let {mx,my} = this.game.window

                let tile = this.game.window.map_index[(mx + i) *1e4 + (j + my)];

                xTiles.push(tile ? tile.block : 1)
            }
            tileMap.push(xTiles);
        }

        return tileMap;
    }


}