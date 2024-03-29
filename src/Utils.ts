import {async} from "q";


export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function doWhen(action: () => any, when: () => boolean, period: number, timeout: number = Infinity): Promise<boolean> {

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

export async function until(event: () => boolean, period: number, timeout: number = Infinity): Promise<boolean> {

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

export function Create2DArray(columns,rows,initialValue = 0) {
    let grid = [];

    for (let i=0;i<rows;i++) {
        let column = [];
        for (let j=0;j<columns;j++){
            column[j] = initialValue;
        }
        grid[i] = column;
    }

    return grid;
}


export async function repeatUntil(action: () => void, until: () => boolean, period: number, timeout: number = Infinity): Promise<boolean> {

    let elapsedtime = 0;
    while (true) {
        if (until()) {
            return true;
        } else if (elapsedtime > timeout) {
            return false;
        } else{
          action();
        }
        await sleep(period);
        elapsedtime += period;
    }

}

export function isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
}


export function fillInto(sourceObject: object, destinationObject: object): void {
    for (let [key, value] of Object.entries(sourceObject)) {
        if (destinationObject[key] === undefined) {
            destinationObject[key] = value;
        }
    }
}

export function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export function getTimeout(ms, value = false) {
    return new Promise<any>((resolve) => setTimeout(() => resolve(value), ms));

}

export class Cooldown {
    cooldown: number;
    lastUse: number = 0;
    active: boolean;

    public constructor(cooldown: number, active = true) {
        this.cooldown = cooldown;
        this.active = active;
    }


    public canUse() {
        return !this.active || Date.now() - this.lastUse > this.cooldown;
    }

    public use() {
        if (!this.canUse()) throw new Error("Cooldown is not ready, can't use.");
        this.lastUse = Date.now();
    }

    public reset(){
        this.lastUse = Date.now();
    }

    public setCooldown(coooldown: number) {
        this.cooldown = coooldown;
    }

    public deactivate() {
        this.active = false;
    }

    public activate() {
        this.active = true;
    }
}


export function decodeBase64(data, encoding = 'ascii') {
    try {
        let buff = new Buffer(data, 'base64');
        let text = buff.toString(encoding);
        return text
    } catch (e) {
        return null;
    }
}
