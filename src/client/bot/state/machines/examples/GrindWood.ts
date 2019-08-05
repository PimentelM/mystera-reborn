import {playerHasNoCloseTarget} from "./common/predicates";
import {GrindResource} from "../../units/grind/GrindResource";
import {StateMachineDescriptor} from "../../StateFactory";
import {BasicHealthCare} from "./common/machines";


let GatherResources = {
    condition : playerHasNoCloseTarget,
    stateDescriptors: [
        {
            name: "Grind Wood",
            stateDescriptors: [
                {type: GrindResource, state: {resource: "Fir Tree"}}
            ]
        }
    ]
};

export let GrindWood: StateMachineDescriptor = {
    name: "Grind Wood",
    stateDescriptors: [
        BasicHealthCare,
        GatherResources,

    ]
};
