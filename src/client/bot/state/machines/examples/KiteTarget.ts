import {playerHasNoCloseTarget} from "./common/predicates";
import {GrindResource} from "../../units/grind/GrindResource";
import {StateMachineDescriptor} from "../../StateFactory";
import {BasicHealthCare} from "./common/machines";
import {Kite} from "../../units/walking/Kite";



export let KiteTarget: StateMachineDescriptor = {
    name: "Kite Target",
    stateDescriptors: [
        BasicHealthCare,
        {type: Kite, state: { spear : true }}
    ]
};
