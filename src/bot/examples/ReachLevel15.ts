import {HealWithItem} from "../states/healing/HealWithItem";
import {HealOnFountain} from "../states/healing/HealOnFountain";
import {EatFood} from "../states/misc/EatFood";
import {CraftItem} from "../states/craft/CraftItem";
import {EquipItem} from "../states/iventory/EquipItem";
import {GrindResource} from "../states/grind/GrindResource";
import {TargetCreature} from "../states/targeting/TargetCreature";
import {LootItemQuantity} from "../states/looting/LootItemQuantity";
import {DropItem} from "../states/iventory/DropItem";
import {FollowTarget} from "../states/walking/FollowTarget";
import {Game} from "../../game/Game";


let playerHasStoneTools = (game : Game) =>{
    return game.iventory.containItems({"Stone Pickaxe" : 1, "Stone Axe" : 1, }, "\\*?") || game.iventory.contains("Stone", 20)
};

let playerHasWoodItems = (game: Game) => {
    return game.iventory.containItems(
        {"Wood Sword" : 1, "Wooden Buckler" : 1, "Stone Pickaxe" : 1, "Stone Axe" : 1 },"\\*?") || game.iventory.contains("Wood", 30)
};

let playerHasTinderItems = (game: Game) => {
    return game.iventory.containItems({"Grass Band" : 2, "Pelt Armor" : 1, },"\\*?") || game.iventory.contains("Tinder",4)
};


export let reachLevel15 = [
    HealWithItem,
    HealOnFountain,
    EatFood,
    {type: CraftItem, state: {items: [{tpl: "stone_pickaxe"}]}},
    {type: CraftItem, state: {items: [{tpl: "stone_axe"}]}},
    {type: CraftItem, state: {items: [{tpl: "wood_sword"}]}},
    {type: CraftItem, state: {items: [{tpl: "pelt_armor"}]}},
    {type: CraftItem, state: {items: [{tpl: "wooden_buckler"}]}},
    {type: CraftItem, state: {items: [{tpl: "grass_band", quantity: 2}]}},

    {type: EquipItem, state: {item: ["Grass Band"], two: true}},
    {type: EquipItem, state: {item: ["Pelt Armor"]}},

    {type: GrindResource, state: {resource: " Rock", items: {Stone: 20}, tool: "pickaxe", until : playerHasStoneTools}},
    {type: GrindResource, state: {resource: " Tree", items: {Wood: 30}, tool: "axe", until: playerHasWoodItems}},
    {type: GrindResource, state: {resource: " Bush", items: {Tinder: 4}, until: playerHasTinderItems}},

    {type: EquipItem, state: {item: ["Wood Sword"]}},
    {type: EquipItem, state: {item: ["Wooden Buckler"]}},

    {type : TargetCreature, state : { filters : ["Raccoon", ""]}},
    {type: LootItemQuantity, state: {radius: 5, items: {Pelt: 2, Salmonberry: 10}}},
    {type: DropItem, state: {items: {Pelt: 2, Bone : 0, "Raw Meat" : 0, "Carrot Seed" : 0 }}},
    FollowTarget
];
