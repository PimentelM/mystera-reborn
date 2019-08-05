import {playerHasNoCloseTarget} from "./common/predicates";
import {GrindResource} from "../../units/grind/GrindResource";
import {StateMachineDescriptor} from "../../StateFactory";
import {BasicHealthCare} from "./common/machines";
import {CraftItem} from "../../units/craft/CraftItem";
import {Game} from "../../../game/Game";


let GatherResources = {
    condition : playerHasNoCloseTarget,
    stateDescriptors: [
        {
            name: "Grind Bush",
            stateDescriptors: [
                {type: GrindResource, state: {resource: ".* Bush", radius : 5}}
            ]
        },
        {
            name: "Grind Wood and Stone",
            stateDescriptors: [
                {type: GrindResource, state: {resource: "(Fir Tree)|(.* Bush)|((Plain|Gold|Desert|Black|Crystal) Rock)"}}
            ]
        },

    ]
};
let playerHasNoPickaxe = async (game: Game) => {
    return !game.player.equip.hasEquipables({
        ".* Pickaxe": 1,
    })
};

let playerHasNoAxe = async (game: Game) => {
    return !game.player.equip.hasEquipables({
        ".* Axe": 1,
    })
};

let CraftThings = {
    stateDescriptors: [
        {
            name: "Craft Axe",
            condition: playerHasNoAxe,
            stateDescriptors: [
                {type: CraftItem, state: {items: [{tpl: "stone_axe"}]}},
            ]
        },
        {
            name: "Craft Pickaxe",
            condition: playerHasNoPickaxe,
            stateDescriptors: [
                {type: CraftItem, state: {items: [{tpl: "stone_pickaxe"}]}},
            ]
        },
    ]
};



export let GrindAll: StateMachineDescriptor = {
    name: "Grind All",
    stateDescriptors: [
        BasicHealthCare,
        CraftThings,
        GatherResources,
    ]
};
