import {Game} from "./Game";
import {IventoryItem} from "./Types";

export class Iventory {
    public game: Game;

    constructor(game) {
        this.game = game;
    }

    public findItem(regExp: string, exact = false): IventoryItem[] {
        let items: IventoryItem[] = [];

        let test = (str1: string, regExp: string): boolean => {
            return new RegExp(exact ? `^${regExp}$` : regExp,"i").test(str1);
        };

        for (let item of this.game.window.item_data) {
            if (!item) continue;
            if (test(item.n, regExp)) {
                items.push(item);
            }
        }

        return items;
    }

    public get items() {
        return this.game.window.item_data;
    }

    public use(item: IventoryItem | string ){
        if (typeof item == "string"){
            item = this.findItem(item).shift();
            if(!item) return false;
        }

        this.game.send({type:"u",slot:item.slot});
    }

    public count(regExp : string, exactMatch = true) : number{
        return this.findItem(exactMatch ? `^${regExp}$` : regExp).reduce((a,x)=>a+=x.qty,0);
    }


    public containsRecipe(items : {[name : string] : number} ){

        for (let [item,ammount] of Object.entries(items)){
            if (!this.contains(item,ammount)) return false;
        }

        return true
    }

    public contains(item , amount){
        return this.count(item) >= amount
    }

    public equip(item: IventoryItem | string){
        if (typeof item == "string"){
            item = this.findItem(item).shift();
            if(!item) return false;
        }

        if(!item.eqp){
            item.eqp = true;
            this.use(item);
        }
    }


    public swapSlot(slot,swap){
        this.game.send({type: "sw", slot, swap})
    }


    public drop(item: IventoryItem | string , amt? : number){
        if (typeof item == "string"){
            item = this.findItem(item).shift();
            if(!item) return false;
        }

        this.game.send({type:"d",slot:item.slot,amt : amt || "all"})

    }


}

