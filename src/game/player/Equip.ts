import {Game} from "../Game";
import {IventoryItem} from "../Types";
import {Iventory} from "../Iventory";
import {dynamicSort, getTimeout} from "../../Utils";

let successEquipRegex = (itemName) => new RegExp(`You (hold|wear|equip) [a|the] ${itemName}`);
let requiresLevelToEquipRegex = (itemName) => new RegExp(`${itemName} requires level \\d*\\.`);


let materialPriority = ["Steel", "Iron", "Bronze", "Copper", "Obsidian", "Flint", "Bone","Turtle", "Herald" ,"Blunt","Short", "Simple" , ""];


const defaultTimeout = 3000;

export class Equip {
    game: Game;

    equipQueue : IventoryItem[];

    equipLevels : {[equipName : string] : number} = {};


    constructor(game) {
        this.game = game;
    }


    private async _equip(item : IventoryItem, timeout : number = defaultTimeout) : Promise<boolean>{
        if(item.eqp) return true;

        let remoteResolve = {resolve : (result : boolean) => undefined};

        let resultPromise = new Promise<boolean>((resolve) : void=>{remoteResolve.resolve=resolve});

        let parserId = this.game.con.addParser(({type, data}) => {
            let successEquip = successEquipRegex(item.n);
            let requiresLevelToEquip = requiresLevelToEquipRegex(item.n);
            if (type == "pkg") {
                if (data.indexOf("message") > -1) {
                    if (successEquip.test(data)) {
                        remoteResolve.resolve(true);
                    } else if (requiresLevelToEquip.test(data)){
                        this.equipLevels[item.n] = data.split("requires level")[1].split(".")[0];
                        remoteResolve.resolve(false);
                    }
                }
            }
        });


        this.game.iventory.equip(item);


        let timeoutPromise = new Promise<boolean>((resolve)=>setTimeout(()=>resolve(false),timeout));

        let result = await Promise.race([resultPromise,timeoutPromise]);

        this.game.con.removeParser(parserId);

        return result;
    }




    private _isEqquipedWith(regex) : boolean{
        let equippedItem = this.game.iventory.currentEquip();
        return new RegExp(regex,"i").test(equippedItem.n);


        return false
    }

    // Retorna a melhor tool do tipo x encontratada no iventory.
    private _getBestTool(typeOfTool:string){
        for (let material of materialPriority){
            let items = this.game.iventory.findItem(material + "\\s" + typeOfTool);
            // Sorty by level +n
            let sortedItems = items.sort(dynamicSort("-n"));
            for (let item of sortedItems){
                if (!this.equipLevels[item.n] || this.game.player.mob.level >= this.equipLevels[item.n] ){
                    return item;
                }
            }

        }
        return null
    }

    private async _bestItem(typeRegex : string){
        let item;

        let maxIterations = 15; // the person would need a total of 15 different kinds of items of the same kind that he can't equip...
        let c = 0;
        do {

            item = this._getBestTool(typeRegex);
            // Retorna false se não foi possível equipar o item do tipo especificado.
            if (!item) return false;

            if (await this._equip(item)) return true;

            c++;

        } while (item || c > maxIterations);

        // Reached max number of iterations...
        return false;

    }

    public async best(regex,timeout = defaultTimeout){
        return await Promise.race([this._bestItem( regex),getTimeout(timeout)]);
    }

    public async bestDagger(timeout = defaultTimeout) : Promise<boolean>{
        return await this.best("dagger",timeout)
    }


    public async bestSword(timeout = defaultTimeout) : Promise<boolean>{
        return await this.best("sword",timeout)
    }

    public async bestHammer(timeout = defaultTimeout) : Promise<boolean>{
        return await this.best("hammer",timeout)
    }

    public async bestSpear(timeout = defaultTimeout) : Promise<boolean>{
        return await this.best("spear",timeout)
    }

    public async bestAxe(timeout = defaultTimeout) : Promise<boolean>{
        return await this.best("axe",timeout)
    }

    public async bestPickaxe(timeout = defaultTimeout) : Promise<boolean>{
        return await this.best("pickaxe",timeout)
    }


    public async bestMace(timeout = defaultTimeout) : Promise<boolean>{
        return await this.best("(mace|club)",timeout)
    }

    public async bestPick(timeout = defaultTimeout) : Promise<boolean>{
        return await this.best("sword",timeout)
    }

    public async bestShield(timeout = defaultTimeout) : Promise<boolean>{
        return await this.best("(shield|buckler)",timeout)
    }

    public async bestBow(timeout = defaultTimeout) : Promise<boolean>{
        return await this.best("(bow)",timeout)
    }
    
    public async bestKnuckles(timeout = defaultTimeout) : Promise<boolean>{
        let result =  await this.best("(duster|knuckles)",timeout);
        if(!result) this.game.iventory.disarm();
        return true;
    }



}