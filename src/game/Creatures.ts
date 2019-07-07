import {Game} from "./Game";
import {Mob} from "./Types";
import {isArray} from "../Utils";


type MobPredicate = (mob: Mob) => boolean
type CreatureFilter = MobPredicate | string | string[]
const all = () => true;


let predicateIt = (test: CreatureFilter): MobPredicate => {
    if (isArray(test)){
        test = (test as string[]).join("|")
    }

    if (typeof test === "string") {
        let regexp = test;
        test = (x: Mob) => new RegExp(regexp, "i").test(x.name);
    }

    return test as MobPredicate
};



export class Creatures {
    public game: Game;
    private static _this : Creatures;

    constructor(game) {
        this.game = game;
        Creatures._this = this;

    }

    private distanceBetween(mobA: Mob, mobB: Mob) {
        return Math.abs(mobA.x - mobB.x) + Math.abs(mobB.y - mobA.y);
    };

    public distanceTo(mobA: Mob) {
        return this.distanceBetween(this.game.player.mob, mobA);
    };

    private __cmp = (mobA: Mob, mobB: Mob) : number => {
        let distanceToA = this.distanceTo(mobA);
        let distanceToB = this.distanceTo(mobB);
        return distanceToA - distanceToB;
    };

    private nearest(mobs: Mob[]) : Mob {
        return mobs.sort(this.__cmp).shift();
    }

    public find(test: CreatureFilter = all): Mob[] {
        test = predicateIt(test);
        let creatures = [];
        for (let mob of this.game.window.mob_ref.filter(x => !!x)) {
            if (mob.id == this.game.window.me) continue;
            if (test(mob)) creatures.push(mob);
        }
        return creatures;
    }

    public findCreatures(test: CreatureFilter = all): Mob[] {
        test = predicateIt(test);
        let isCreature = (x) => typeof x.template == typeof "";
        let testMob = x => isCreature(x) && (test as MobPredicate)(x);
        return this.find(testMob);
    }


    public findPlayers(test: CreatureFilter = all): Mob[] {
        test = predicateIt(test);
        let isPlayer = (x) => typeof x.template == typeof 1;
        let testMob = x => isPlayer(x) && (test as MobPredicate)(x);
        return this.find(testMob);
    }

    public findNearest(test: CreatureFilter = all): Mob {
        let mobs = this.find(test);
        return this.nearest(mobs);
    }

    public findNearestCreature(test: CreatureFilter = all): Mob {
        let mobs = this.findCreatures(test);
        return this.nearest(mobs);
    }

    public findNearestPlayer(test: CreatureFilter = all): Mob {
        let mobs = this.findPlayers(test);
        return this.nearest(mobs);
    }


}