import {Game} from "./Game";
import {IventoryItem} from "./Types";

export class Iventory {
    public game: Game;

    constructor(game) {
        this.game = game;
    }


    public findItems(regExp: string[]): IventoryItem[] {
        let items: IventoryItem[] = [];

        let test = (str1: string, regExp: string): boolean => {
            return new RegExp(regExp,"i").test(str1);
        };

        for (let item of this.game.window.item_data) {
            if (!item) continue;
            for (let itemNameOrTemplate of regExp) {
                if (test(item.n, itemNameOrTemplate)) {
                    items.push(item);
                    break;
                }
            }
        }

        return items;
    }

    public findItem(regExp : string): IventoryItem[] {
        return this.findItems([regExp]);
    }

    public use(item:IventoryItem);
    public use(item:string);
    public use(item: IventoryItem | string ){
        if (typeof item == "string"){
            item = this.findItem(item).shift();
            if(!item) return false;
        }

        this.game.send({type:"u",slot:item.slot})
    }

    public equip(item:IventoryItem);
    public equip(item:string);
    public equip(item: IventoryItem | string){
        if (typeof item == "string"){
            item = this.findItem(item).shift();
            if(!item) return false;
        }

        if(!item.eqp){
            this.use(item);
        }
    }


    public swapSlot(slot,swap){
        this.game.send({type: "sw", slot, swap})
    }

    public drop(item:IventoryItem, amt? : number);
    public drop(item:string, amt? : number);
    public drop(item: IventoryItem | string , amt? : number){
        if (typeof item == "string"){
            item = this.findItem(item).shift();
            if(!item) return false;
        }

        console.log("drop")
        this.game.send({type:"d",slot:item.slot,amt : amt || "all"})

    }

}

