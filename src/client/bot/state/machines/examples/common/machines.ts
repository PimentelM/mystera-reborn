import {StateMachineDescriptor} from "../../../StateFactory";
import {HealWithItem} from "../../../units/healing/HealWithItem";
import {EatFood} from "../../../units/misc/EatFood";
import {TargetCreature} from "../../../units/targeting/TargetCreature";
import {playerHasCloseTarget, playerHasNoCloseTarget} from "./predicates";
import {EquipItem} from "../../../units/iventory/EquipItem";

let PlayerHealth: StateMachineDescriptor = {
    name: "Player Health",
    stateDescriptors: [
        {type: HealWithItem, state: {}},
        {type: EatFood, state: {}},
        {type: EatFood, state: {foods : ["Raw\\s.*"], minHunger : 1}},
    ]
};


let TargetMobs: StateMachineDescriptor = {
    name: "Target Mobs",
    stateDescriptors: [
        {type: TargetCreature, state: {retarget: true, range: 2, filters: [".*"]}},
    ]
};

let EquipWeapon = {
    name: "Equip Weapon",
    condition: playerHasCloseTarget,
    stateDescriptors: [
        {type: EquipItem, state: {item: [".* Dagger", ".* Sword", ".* Spear", ".* (Club|Mace)"]}},
        {type: EquipItem, state: {item: [".* Dagger", ".* Sword", ".* Spear", ".* (Club|Mace)", ".* Hammer", ".* (pick)?axe"]}}
    ]
};


export let BasicHealthCare : StateMachineDescriptor = {
    name: "Player Health",
    stateDescriptors: [
        PlayerHealth,
        TargetMobs,
        EquipWeapon
    ]
};
