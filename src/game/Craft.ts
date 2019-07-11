import {Game} from "./Game";
import {getTimeout} from "../Utils";

type ItemData = {name : string, recipe : {[material : string] : number}, level : number}
export class Craft{
    private game : Game;
    private cache : {[tpl :string] : ItemData} = {};

    constructor(game){
        this.game = game;
    }


    public async canCraft(tpl : string) : Promise<boolean>{
        let {recipe} = await this.getInfo(tpl);
        if(!recipe) return false;
        return this.game.iventory.containItems(recipe);
    }

    public async getInfo(tpl : string) : Promise<ItemData>{
        if (this.cache[tpl] !== undefined) return this.cache[tpl];

        let recipeFromResponse = (response) => {
            let recipe = {};
            let result = response.split("</span>").map(x=>x.split(">")[1]).slice(0,-1);
            while (result.length > 1) {let [count,material] = result; recipe[material] = count; result = result.slice(2)}
            return recipe;
        };


        let remoteResolve = {resolve : (result : ItemData) => undefined};

        let resultPromise = new Promise<ItemData>((resolve) : void=>{remoteResolve.resolve=resolve});

        let regexString = `<strong>[\\w\\s]*<\\/strong> requires:.*?\\.( Level: \\d*)?`;
        let parserId = this.game.con.addParser(({type, data}) => {
            if (type == "pkg") {
                if (data.indexOf("message") > -1) {
                    let regex = new RegExp(regexString, "gmi");
                    if (regex.test(data)) {
                        let regex = new RegExp(regexString, "gmi");
                        let response = regex.exec(data)[0];
                        let name = response.split("<strong>")[1].split("</strong>")[0];
                        let recipe = recipeFromResponse(response.split("requires: ")[1]);
                        let level = Number(response.split("Level: ")[1]) || 0;
                        remoteResolve.resolve({name,recipe,level});
                    }
                }
            }
        });


        this.game.send({type: "nfo", tpl});

        let result = await Promise.race([resultPromise,getTimeout(1000,null)]);

        this.game.con.removeParser(parserId);

        this.cache[tpl] = result;

        return result;


    }

    public async craft(tpl : string){
        let remoteResolve = {resolve : (result : boolean) => undefined};

        let resultPromise = new Promise<boolean>((resolve) : void=>{remoteResolve.resolve=resolve});

        let parserId = this.game.con.addParser(({type, data}) => {
            if (type == "pkg") {
                if (data.indexOf("message") > -1) {
                    if (new RegExp("You create (.?)*\\.","i").test(data)) {
                        remoteResolve.resolve(true);
                    }
                }
            }
        });

        this.game.send({type: "bld", tpl})

        let result = await Promise.race([resultPromise,getTimeout(500)]);

        this.game.con.removeParser(parserId);

        return result;
    }


}