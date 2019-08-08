import {Connection} from "../Connection";
import {Player} from "./player/Player";
import {IGameWindow} from "./Interfaces";
import {Map} from "./Map";
import {Iventory} from "./Iventory";
import {PathFinder} from "./PathFinder";
import {Creatures} from "./Creatures";
import "./Interfaces"
import {Resouces} from "./Resouces";
import {Craft} from "./Craft";
import {Scanner} from "./data/Scanner";
import {Upgrades} from "./Upgrades";
import {Hooks} from "./Hooks";
import {Parser} from "./Parser";
import {Kitting} from "./Kitting";

export class Game {
    public window: IGameWindow;
    public con: Connection;

    public player: Player;
    public map: Map;
    public iventory: Iventory;
    public creatures: Creatures;
    public resources: Resouces;
    public pathfinder: PathFinder;
    public craft: Craft;
    public upgrades: Upgrades;
    public hooks: Hooks;
    public parser : Parser;
    public kitting : Kitting;

    public constructor(con: Connection, window: IGameWindow) {
        this.con = con;
        this.window = window;

        this.initState();


        this.map = new Map(this);
        this.player = new Player(this);
        this.iventory = new Iventory(this);
        this.creatures = new Creatures(this);
        this.pathfinder = new PathFinder(this);
        this.resources = new Resouces(this);
        this.upgrades = new Upgrades(this);
        this.kitting = new Kitting(this);
        this.parser = new Parser(this, (this.window.parsersState));
        this.craft = new Craft(this);
        this.hooks = new Hooks(this);


        this.window.Scanner = new Scanner();
        this.window.Game = this;
        this.window.GameMap = this.map;
        this.window.Player = this.player;
        this.window.Iventory = this.iventory;
        this.window.Creatures = this.creatures;
        this.window.PathFinder = this.pathfinder;
        this.window.Upgrades = this.upgrades;
        this.window.Kitting = this.kitting;
        this.window.Craft = this.craft;
        this.window.Parser = this.parser;



    }


    public muteF2PPlayers(){
        this.parser.addParser((x) => {
            if (x.type == "message" && x.text.indexOf("FF44FF") > -1) {
                x.type = "P"
            }
            return x
        }, "mute_F2P_Players")
    }

    public unmuteF2PPlayers(){
        this.parser.removeParser("mute_F2P_Players");
    }

    public send(data) {
        return this.con.send(data)
    }

    private initState() {
        if(!this.window.parsersState) this.window.parsersState = {};
    }
}
