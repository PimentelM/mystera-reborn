import {Connection} from "../Connection";
import {Player} from "./Player";
import {IGameWindow} from "./Interfaces";
import {Map} from "./Map";
import {Iventory} from "./Iventory";
import {PathFinder} from "./PathFinder";
import {Creatures} from "./Creatures";


export class Game {
    public window: IGameWindow;
    public con: Connection;

    public player: Player;
    public map: Map;
    public iventory: Iventory;
    public creatures: Creatures;

    public pathfinder : PathFinder;

    public constructor(con: Connection, window: IGameWindow) {
        this.con = con;
        this.window = window;
        this.map = new Map(this);
        this.player = new Player(this);
        this.iventory = new Iventory(this);
        this.creatures = new Creatures(this);
        this.pathfinder = new PathFinder(this);



        this.window.Game = this;
        this.window.GameMap = this.map;
        this.window.Player = this.player;
        this.window.Iventory = this.iventory;
        this.window.Creatures = this.creatures;


    }

    public send(data) {
        return this.con.send(data)
    }

}