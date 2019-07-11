import {Game} from "./Game";
import {IventoryItem} from "./Types";


let successEquipRegex = (itemName) => new RegExp(`You (hold|wear|equip) [a|the] ${itemName}`);
let requiresLevelToEquipRegex = (itemName) => new RegExp(`${itemName} requires level \\d*\\.`);


export class Iventory {
    public game: Game;

    equipLevels : {[equipName : string] : number} = {};


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


    public containItems(items : {[name : string] : number} ){

        for (let [item,ammount] of Object.entries(items)){
            if (!this.contains(item,ammount)) return false;
        }

        return true
    }

    public contains(item , amount){
        return this.count(item) >= amount
    }

    public async equip(item : IventoryItem | string, timeout : number = 1000) : Promise<boolean>{
        if (typeof item === "string"){
            item = this.findItem(item).shift();
            if(!item) return false;
        }

        let Item = item as IventoryItem;

        if(item.eqp) return true;

        let remoteResolve = {resolve : (result : boolean) => undefined};

        let resultPromise = new Promise<boolean>((resolve) : void=>{remoteResolve.resolve=resolve});

        let parserId = this.game.con.addParser(({type, data}) => {
            let successEquip = successEquipRegex(Item.n);
            let requiresLevelToEquip = requiresLevelToEquipRegex(Item.n);
            if (type == "pkg") {
                if (data.indexOf("message") > -1) {
                    if (successEquip.test(data)) {
                        remoteResolve.resolve(true);
                    } else if (requiresLevelToEquip.test(data)){
                        this.equipLevels[Item.n] = data.split("requires level")[1].split(".")[0];
                        remoteResolve.resolve(false);
                    }
                }
            }
        });


        if(!item.eqp){
            item.eqp = true;
            this.use(item);
        }


        let timeoutPromise = new Promise<boolean>((resolve)=>setTimeout(()=>resolve(false),timeout));

        let result = await Promise.race([resultPromise,timeoutPromise]);

        this.game.con.removeParser(parserId);

        return result;
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

