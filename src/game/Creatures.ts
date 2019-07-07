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

    constructor(game) {
        this.game = game;
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
        return this.game.player.nearestPoint(mobs);
    }

    public findNearestCreature(test: CreatureFilter = all): Mob {
        let mobs = this.findCreatures(test);
        return this.game.player.nearestPoint(mobs);
    }

    public findNearestPlayer(test: CreatureFilter = all): Mob {
        let mobs = this.findPlayers(test);
        return this.game.player.nearestPoint(mobs);
    }


}