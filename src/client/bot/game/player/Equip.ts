import {Game} from "../Game";
import {IventoryItem} from "../Types";
import {Iventory} from "../Iventory";
import {dynamicSort, getTimeout} from "../../../../Utils";


let materialPriority = ["Steel", "Iron", "Bronze", "Copper", "Obsidian", "Flint", "Bone","Stone", "Turtle", "Herald" ,"Blunt","Short", "Simple" , ""];

const defaultTimeout = 3000;

export enum types {
    dagger = "dagger",
    sword = "sword",
    axe = "axe",
    pickaxe = "pickaxe",
    spear = "spear",
    hammer = "hammer",
    club = "(club|mace)",
    shield = "(shield|buckler)",
    bow = "bow",
    knuckles = "(duster|knuckles)"
}

export class Equip {
    game: Game;


    constructor(game) {
        this.game = game;
    }



    private _isEqquipedWith(regex) : boolean{
        let equippedItem = this.currentEquip();
        return new RegExp(regex,"i").test(equippedItem.n);
    }

    private _getBestEquip(equipName : string){
        let items = this.game.iventory.findItem(equipName);
        // Sorty by level +
        let sortedItems = items.sort(dynamicSort("-n"));
        for (let item of sortedItems){
            if (!this.game.iventory.equipLevels[item.n] || this.game.player.mob.level >= this.game.iventory.equipLevels[item.n] ){
                return item;
            }
        }
    }

    // Retorna a melhor tool do tipo x encontratada no iventory.
    private _getBestTool(typeOfTool:string){
        for (let material of materialPriority){
            let items = this.game.iventory.findItem(material + "\\s" + typeOfTool);
            // Sorty by level +
            let sortedItems = items.sort(dynamicSort("-n"));
            for (let item of sortedItems){
                if (!this.game.iventory.equipLevels[item.n] || this.game.player.mob.level >= this.game.iventory.equipLevels[item.n] ){
                    return item;
                }
            }

        }
        return null
    }

    private async _bestTool(typeRegex : string){
        let item;

        let maxIterations = 15; // the person would need a total of 15 different kinds of items of the same kind that he can't equip...
        let c = 0;
        do {

            item = this._getBestTool(typeRegex);
            // Retorna false se não foi possível equipar o item do tipo especificado.
            if (!item) return false;

            if (await this.game.iventory.equip(item)) return true;

            c++;

        } while (item || c > maxIterations);

        // Reached max number of iterations...
        return false;

    }

    private async _bestEquip(itemName : string){
        let item;

        let maxIterations = 6; // the person would need a total of 6 different kinds of items of the same kind that he can't equip...
        let c = 0;
        do {

            item = this._getBestEquip(itemName);
            // Retorna false se não foi possível equipar o item do tipo especificado.
            if (!item) return false;

            if (await this.game.iventory.equip(item)) return true;

            c++;

        } while (item || c > maxIterations);

        // Reached max number of iterations...
        return false;

    }

    public async bestTool(regex, timeout = defaultTimeout){
        return await Promise.race([this._bestTool( regex),getTimeout(timeout)]);
    }

    public async bestDagger(timeout = defaultTimeout) : Promise<boolean>{
        return await this.bestTool("dagger",timeout)
    }


    public async bestSword(timeout = defaultTimeout) : Promise<boolean>{
        return await this.bestTool("sword",timeout)
    }

    public async bestHammer(timeout = defaultTimeout) : Promise<boolean>{
        return await this.bestTool("hammer",timeout)
    }

    public async bestSpear(timeout = defaultTimeout) : Promise<boolean>{
        return await this.bestTool("spear",timeout)
    }

    public async bestAxe(timeout = defaultTimeout) : Promise<boolean>{
        return await this.bestTool("axe",timeout)
    }

    public async bestPickaxe(timeout = defaultTimeout) : Promise<boolean>{
        return await this.bestTool("pickaxe",timeout)
    }


    public async bestMace(timeout = defaultTimeout) : Promise<boolean>{
        return await this.bestTool("(mace|club)",timeout)
    }

    public async bestPick(timeout = defaultTimeout) : Promise<boolean>{
        return await this.bestTool("sword",timeout)
    }

    public async bestShield(timeout = defaultTimeout) : Promise<boolean>{
        return await this.bestTool("(shield|buckler)",timeout)
    }

    public async bestBow(timeout = defaultTimeout) : Promise<boolean>{
        return await this.bestTool("(bow)",timeout)
    }

    public async bestKnuckles(timeout = defaultTimeout) : Promise<boolean>{
        let result =  await this.bestTool("(duster|knuckles)",timeout);
        if(!result) this.disarm();
        return true;

    }

    public getEquipables(itemName : string) : IventoryItem[]{
        return this.game.iventory.findItem(itemName + "\\s?\\+?\\d?").filter(item=>{
            return !this.game.iventory.equipLevels[item.n] || this.game.player.mob.level >= this.game.iventory.equipLevels[item.n]
        })
    }

    public countEquipable(itemName : string) : number{
        return this.getEquipables(itemName).length;
    }

    public hasEquipable(itemName : string, quantity : number){
        return this.countEquipable(itemName) >= quantity;
    }


    public hasEquipables(items : {[name : string] : number} ){
        for (let [item,ammount] of Object.entries(items)){
            if (!this.hasEquipable(item,ammount)) return false;
        }
        return true
    }


    public async equipBest(itemName : string, timeout = defaultTimeout){
        return await Promise.race([this._bestEquip( itemName),getTimeout(timeout)]);
    }

    public currentEquip(){
        let eqquiped_item_sprite = this.game.window.jv.equip_sprite;
        if(eqquiped_item_sprite) {
            return this.game.iventory.items.find(x => x && x.spr == eqquiped_item_sprite);
        }
        return null;
    }

    public disarm() {
        let currentEquip = this.currentEquip();
        if(currentEquip){
            this.game.iventory.use(currentEquip);
        }
    }



}
