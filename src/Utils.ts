

export function sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export async function doWhenTestPass(action: () => any, test : () => boolean, period : number, timeout : number = Infinity) : Promise<boolean>{

    let elapsedtime = 0;
    while (true) {
        if (test()) {
            action();
            return true;
        } else if (elapsedtime > timeout) {
            return false;
        }
        await sleep(period);
        elapsedtime += period;
    }

}