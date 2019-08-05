import {playerHasNoCloseTarget} from "./common/predicates";
import {GrindResource} from "../../units/grind/GrindResource";
import {StateMachineDescriptor} from "../../StateFactory";
import {BasicHealthCare} from "./common/machines";


let GatherResources = {
    condition : playerHasNoCloseTarget,
    stateDescriptors: [
        {
            name: "Grind Stone",
            stateDescriptors: [
                {type: GrindResource, state: {resource: "(Plain|Gold|Desert|Black|Crystal) Rock"}}
            ]
        },
    ]
};

export let GrindStone: StateMachineDescriptor = {
    name: "Grind Stone",
    stateDescriptors: [
        BasicHealthCare,
        GatherResources,

    ]
};
