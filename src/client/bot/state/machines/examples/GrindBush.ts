import {playerHasNoCloseTarget} from "./common/predicates";
import {GrindResource} from "../../units/grind/GrindResource";
import {StateMachineDescriptor} from "../../StateFactory";
import {BasicHealthCare} from "./common/machines";


let GatherResources = {
    condition : playerHasNoCloseTarget,
    stateDescriptors: [
        {
            name: "Grind Bush",
            stateDescriptors: [
                {type: GrindResource, state: {resource: ".* Bush"}}
            ]
        },
    ]
};

export let GrindBush: StateMachineDescriptor = {
    name: "Grind Bush",
    stateDescriptors: [
        BasicHealthCare,
        GatherResources,
    ]
};
