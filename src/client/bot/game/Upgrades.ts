import {Game} from "./Game";
import {getTimeout} from "../../../Utils";


export let upgrades =  {
    attack : "attack",
    defense : "defense",
    weight : "weight",
    hp : "hp",
    exp : "exp",
    ups : "ups",
    crit : "crit",
    star : "star",
    dodge : "dodge",
    precision : "precision",
    cap : "cap",
    refund : "refund",
    ability : "ability",
};


class UpgradeData {
    private a: boolean;
    private c: number;
    private d: string;
    private l: number;
    private n: string;
    private s: number;
    private t: string;

    public constructor(obj){
        Object.assign(this,obj);
    }

    get level(){
        return this.l;
    }

    get name() {
        return this.n;
    }

    get description(){
        return this.d;
    }

    get text(){
        return this.t;
    }

    get cost(){
        return this.c;
    }

}


export class Upgrades{
    private game : Game;
    public upgrades = upgrades;

    private data: UpgradeData[];

    constructor(game){
        this.game = game;
    }

    get myst(){
        return this.game.window.jv.upgrade_number
    }

    public async canUpgrade(skillName: string, remainMist = 0){
        if(!this.data) await this.updateData();

        if(!this.data) return false;

        let skillData = this.data.find(x=>x.name == skillName);
        if(skillData){
            if (skillData.cost <= (this.myst - remainMist)){
                return skillName;
            }
        }

        return null;
    }

    public async upgradeSkill(skillName : string){
        if(!this.data) await this.updateData();

        if(!this.data) return false;

        let currentLevel = this.data.find(x=>x.name == skillName).level;

        this.game.send({type: "c", r: "ub", u: skillName});
        await this.updateData();

        let newLevel = this.data.find(x=>x.name == skillName).level;
        return newLevel > currentLevel;
    }

    public async updateData(){
        this.data = await this.getData();
        return this.data;
    }

    public async getData() : Promise<UpgradeData[]>{

        let remoteResolve = {resolve : (result : UpgradeData[]) => undefined};

        let resultPromise = new Promise<UpgradeData[]>((resolve) : void=>{remoteResolve.resolve=resolve});

        let parserId = this.game.con.addParser(({type, data, obj},options) => {
            if (type == "pkg") {
                if (data.indexOf("\\\"type\\\":\\\"upg\\\"") > -1) {
                    let pacotes =JSON.parse(data);
                    // let msg = {type : "pkg", data : ""};
                    //let newData = [];
                    for (let pacote of pacotes){
                        pacote = JSON.parse(pacote);
                        if (pacote.type == "upg"){
                            remoteResolve.resolve( pacote.obj.map(x=> new UpgradeData(x)));
                            this.game.window.didBotUpgrade = 0;
                        }
                        // else{
                        //     newData.push(JSON.stringify(pacote));
                        // }
                    }
                    //let stringifiedData = JSON.stringify(newData);

                    //msg.data = stringifiedData;

                    //options.replaceWith = msg;
                }
            } else if(type =="upg"){
                remoteResolve.resolve( obj.map(x=> new UpgradeData(x)));
                this.game.window.didBotUpgrade = 0;
                //options.drop = true;
            }
        });

        this.game.send({"type":"c","r":"up"});

        let result = await Promise.race([resultPromise,getTimeout(2000,null)]);

        this.game.con.removeParser(parserId);

        return result;

    }
}
