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