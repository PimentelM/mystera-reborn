import {StateMachineDescriptor} from "../../StateFactory";
import {BasicHealthCare} from "./common/machines";
import {KiteSpear} from "../../units/walking/KiteSpear";



export let KiteTarget: StateMachineDescriptor = {
    name: "Kite Target",
    stateDescriptors: [
        BasicHealthCare,
        {type: KiteSpear, state: { }}
    ]
};
