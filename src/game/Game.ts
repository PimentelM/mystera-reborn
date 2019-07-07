import {Connection} from "../Connection";
import {Player} from "./Player";
import {IGameWindow} from "./Interfaces";
import {Map} from "./Map";
import {Iventory} from "./Iventory";
import {PathFinder} from "./PathFinder";


export class Game {
    public window: IGameWindow;
    public con: Connection;

    public player: Player;
    public map: Map;
    public iventory: Iventory;

    public pathfinder : PathFinder;

    public constructor(con: Connection, window: IGameWindow) {
        this.con = con;
        this.window = window;
        this.player = new Player(this);
        this.map = new Map(this);
        this.iventory = new Iventory(this);
        this.pathfinder = new PathFinder(this);

        this.window.Game = this;
        this.window.Player = this.player;
        this.window.Iventory = this.iventory;
        this.window.GameMap = this.map;


    }

    public send(data) {
        return this.con.send(data)
    }

}