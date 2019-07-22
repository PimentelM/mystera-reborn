import {async} from "q";


export function sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export async function doWhen(action: () => any, when : () => boolean, period : number, timeout : number = Infinity) : Promise<boolean>{

    let elapsedtime = 0;
    while (true) {
        if (when()) {
            action();
            return true;
        } else if (elapsedtime > timeout) {
            return false;
        }
        await sleep(period);
        elapsedtime += period;
    }

}

export async function until( event : () => boolean, period : number, timeout : number = Infinity) : Promise<boolean>{

    let elapsedtime = 0;
    while (true) {
        if (event()) {
            return true;
        } else if (elapsedtime > timeout) {
            return false;
        }
        await sleep(period);
        elapsedtime += period;
    }

}

export function isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
}


export function fillInto(sourceObject : object, destinationObject : object) : void {
    for (let [key,value] of Object.entries(sourceObject)){
        if(!destinationObject[key]){
            destinationObject[key] = value;
        }
    }
}

export function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export function getTimeout(ms, value = false){
    return new Promise<any>((resolve)=>setTimeout(()=>resolve(value),ms));

}

export class Cooldown{
    cooldown : number;
    lastUse : number = 0;
    active : boolean;

    public constructor(cooldown : number){
        this.cooldown = cooldown;
    }


    public canUse(){
        return !this.active || new Date().valueOf() - this.lastUse > this.cooldown;
    }

    public use(){
        if(!this.canUse()) throw new Error("Cooldown is not ready, can't use.");
        this.lastUse = new Date().valueOf();
    }

    public setCooldown(coooldown : number){
        this.cooldown = coooldown;
    }

    public deactivate(){
        this.active = false;
    }

    public activate() {
        this.active = true;
    }
}