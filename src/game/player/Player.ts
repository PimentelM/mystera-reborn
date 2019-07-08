import {Game} from "../Game";
import {Mob, Point, TilePoint} from "../Types";
import {doWhen, sleep, until} from "../../Utils";
import * as EasyStar from "easystarjs"
import {distanceBetween} from "../Utils";
import {Status} from "./Status";

const {promisify} = require('util');


let directionOffset = [{"x":0,"y":-1},{"x":1,"y":0},{"x":0,"y":1},{"x":-1,"y":0}];

export class Player {
    public mob: Mob;
    public game: Game;
    public status: Status;

    private serialStepList : Point[] = [];
    private isSerialWalking : boolean = false;
    private serialStepPromise : Promise<boolean>;


    constructor(game: Game) {
        this.game = game;
        this.status = new Status(game);
        doWhen(()=>this.updateData(),()=> !!this.game.window.getMob(this.game.window.me),500)
    }

    public isAdjacentTo(p : Point){
        return this.distanceTo(p) == 1;
    }

    public distanceTo<T extends Point>(point: T,allowDiagonals : boolean = false) {
        return distanceBetween(this.mob, point,allowDiagonals);
    };

    private __cmp_dist = (pointA: Point, pointB: Point) : number => {
        let distanceToA = this.distanceTo(pointA);
        let distanceToB = this.distanceTo(pointB);
        return distanceToA - distanceToB;
    };

    public sortByDistance<T extends Point>(points : T[]) : T[] {
        return points.sort(this.__cmp_dist);
    }

    public nearestPoint<T extends Point>(points: T[]) : T {
        return this.sortByDistance(points).shift();
    }


    // Get the closest walkable point.
    public async nearestReachablePoint<T extends Point>(points : T[], adjacent) : Promise<T> {
        points = this.sortByDistance(points);

        let nearestPoint;
        let smallestDistance = Infinity;

        for (let point of points){
            // If player is already on top of point, returns it.
            if (this.isOnTopOf(point)) return point;
            // Check if can reach point
            let path = [];
            if(adjacent){
                path = await this.game.pathfinder.findAdjacentPath(point);
            } else {
                path = await this.game.pathfinder.findPath(point);
            }

            let manhathanDistanceToPoint = this.distanceTo(point);

            // If path.length is equal to distance, then returns it;
            if(path.length == manhathanDistanceToPoint && !nearestPoint) return point;

            if(manhathanDistanceToPoint >= smallestDistance) return nearestPoint;

            if (path.length < smallestDistance){
                nearestPoint = point;
                smallestDistance = path.length;
            }

        }
        return nearestPoint;
    }


    public async attack(mob: Mob) {
        let attack = () =>
        {
            if(mob.title)
                this.game.window.info_pane.set_info(mob);
        };

        attack();
        setTimeout(()=> attack(),500);
    }

    public hasTarget() : boolean{
        return !!this.getTarget();
    }

    public getTarget() : Mob {
        let targetId = this.game.window.target.id;
        if (targetId == this.mob.id) return null;
        let target = this.game.window.getMob(targetId);
        return target;
    }

    public cancelTarget(){
        this.game.window.info_pane.set_info(undefined);
        this.game.window.target.id = this.mob.id;
        this.game.send({type: "t", t:0});
    }

    public updateData() {
        this.mob = this.game.window.getMob(this.game.window.me)
    }

    public turn(d: number) {
        this.mob.last_dir = this.mob.dir;
        this.mob.dir = d;
        this.game.send({"type": "m", "x": this.mob.x, "y": this.mob.y, d});
        return true;
    }

    public isMoving(){
        return this.game.window.dest != -1
    }

    public lookAt(p : Point) {
        let {x,y} = p;
        let dX = x - this.mob.x;
        let dY = y - this.mob.y;

        if (Math.abs(dX) > Math.abs(dY)) {
            if (dX < 0) return this.turn(3);
            if (dX > 0) return this.turn(1);
        } else {
            if (dY < 0) return this.turn(0);
            if (dY > 0) return this.turn(2);
        }
    }

    public isOnTopOf(tile : Point){
        return tile.x == this.mob.x && tile.y == this.mob.y;
    }

    public say(text = "") {
        let sufix = "";
        let prefix = "";
        this.game.send({"type": "chat", "data": prefix + text + sufix})
    }

    public async pick(timeout : number = 1500) : Promise<boolean> {
        await until(()=> !this.isMoving(),5,1000);

        let currentTile = this.game.map.getTile(this.mob);
        if (!currentTile) return false;
        let itemCount = currentTile.o.length;
        if (itemCount == 0) return false;

        this.game.send({type: "g"});

        return await until(()=>{
            return this.game.map.getTile(this.mob).o.length != itemCount
        },50,timeout);

    }

    public action() {
        this.game.send({type: "A"});
        this.game.send({type: "a"});
    }

    public keepAction() {
        this.game.send({type: "A"});
        let {x, y} = this.mob;

        let stop = () => this.game.send({type: "a"});
        let playerMoved = () => this.mob.x != x || this.mob.y != y;

        // Stop action when player move;
        doWhen(stop, playerMoved, 200);
    }


    public async keepActionUntilResourceIsGathered() {
        this.game.send({type: "A"});
        let {x, y} = this.mob;

        let moved = false;
        let gathered = false;

        let offset = directionOffset[this.mob.dir];
        let tileOnFrontOfPlayer = this.game.map.getTileByOffset(offset);

        if (tileOnFrontOfPlayer.o.length == 0) return {moved,gathered};

        let resource = tileOnFrontOfPlayer.o[0].name;

        let stop = () => this.game.send({type: "a"});
        let resourceGatheredOrPlayerMoved = () => {
            let _moved = this.mob.x != x || this.mob.y != y;
            if(_moved){
                moved = true;
                return true;
            }

            let tileOnFrontOfPlayer = this.game.map.getTileByOffset(offset);
            let  _gathered = tileOnFrontOfPlayer.o.length == 0 || tileOnFrontOfPlayer.o[0].name != resource;
            if(_gathered){
                gathered = true;
                return true;
            }

            return false;
        };

        // Stop action when player move;
        await doWhen(stop, resourceGatheredOrPlayerMoved, 250);
        return { moved, gathered }
    }

    private async stepTo(p: Point) {
        let {x, y} = p;
        if (this.mob.x == x && this.mob.y == y) return true;

        this.mob.move(x, y);

        if (!this.game.map.isTileWalkable(p)) {
            return false;
        }

        await until(()=> !this.isMoving(),5,1000);

    }

    public stop(){
        let {x,y} = this.mob;
        this.game.send({type: "h",x,y});
    }

    private async serialStepTo(points: Point[]) : Promise<boolean>{
        if(points.length ==0) return false;

        // Update serial walk list;
        this.serialStepList = points;

        // If player is already serial walking...
        if(this.isSerialWalking) return await this.serialStepPromise;


        let remoteResolve = {resolve : (result : boolean) => undefined};
        // Setup
        this.serialStepPromise = new Promise<boolean>((resolve)=>remoteResolve.resolve=resolve);
        this.isSerialWalking = true;
        let destination = points[points.length - 1];
        let dropUncessaryPackets = (data) => {
            let obj = JSON.parse(data);
            if (obj.type == "h"){
                if (obj.d === undefined){
                    // Ensures that we don't drop the last \stop\ packet.
                    if(obj.x != destination.x && obj.y != destination.y){
                        // Drop packet;
                        return '';
                    }
                }
            }
            return data;
        };
        let middlewareId = this.game.con.addMiddleware(dropUncessaryPackets);



        // Cleanup function
        let cleanup = (result) => {
            let removeMiddleware = () => {this.game.con.removeMiddleware(middlewareId)};
            removeMiddleware();
            if(!result)
                this.stop();
            this.isSerialWalking = false;
            remoteResolve.resolve(result);
            return result;
        };


        // Serial Walk Loop
        while (this.serialStepList.length > 0) {
            let nextPoint = this.serialStepList.shift();
            if (await this.stepTo(nextPoint) == false){
                return cleanup(false);
            }
        }

        return cleanup(true);
    }


    public async walkTo(p : Point, steps : number = 0) {
        let {x,y} = p;

        if (this.mob.x == x && this.mob.y == y) return true;
        let path = await this.game.pathfinder.findPath(p);

        if (path.length == 0) return false;

        if(steps>0){
            path = path.slice(0,steps);
        }

        return await this.serialStepTo(path);
    }

    public async walkAdjacentTo(p : Point, steps : number = 0) {
        let {x,y} = p;
        if (this.distanceTo(p) == 1) return true;

        let path = await this.game.pathfinder.findAdjacentPath(p);
        if (path.length == 0) return false;

        if(steps>0){
            path = path.slice(0,steps);
        }

        return (await this.serialStepTo(path));
    }


    public async walkToOffset(p : Point){
        let {x, y} = this.mob;
        p.x+=x;
        p.y+=y;
        return await this.walkTo(p);
    }


    public async walkAdjacentToAndLookAt(p:Point, steps : number = 0){
        return (await this.walkAdjacentTo(p,steps)) && this.lookAt(p);
    }

}
  
  
  