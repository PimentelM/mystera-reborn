import {HealOnFountain} from "./states/misc/HealOnFountain";
import {EatFood} from "./states/misc/EatFood";
import {GrindItemQuantity, GrindItemQuantityState} from "./states/grind/GrindItemQuantity";
import {CraftItem} from "./states/craft/CraftItem";
import {EquipItem} from "./states/iventory/EquipItem";
import {TargetCreature} from "./states/targeting/TargetCreature";
import {FollowTarget} from "./states/walking/FollowTarget";
import {LootItems} from "./states/looting/LootItems";
import {LootItemQuantity} from "./states/looting/LootItemQuantity";
import {DropItem} from "./states/iventory/DropItem";


export let examples = {
    reachLevel15: [
        HealOnFountain,
        EatFood,
        {type: CraftItem, state: {items: [{tpl: "stone_pickaxe"}]}},
        {type: CraftItem, state: {items: [{tpl: "stone_axe"}]}},
        {type: CraftItem, state: {items: [{tpl: "wood_sword"}]}},
        {type: CraftItem, state: {items: [{tpl: "pelt_armor"}]}},
        {type: CraftItem, state: {items: [{tpl: "wooden_buckler"}]}},
        {type: CraftItem, state: {items: [{tpl: "grass_band", quantity: 2}]}},
        {type: EquipItem, state: {item: ["Pelt Armor"]}},
        {type: EquipItem, state: {item: ["Grass Band"], two: true}},
        {type: EquipItem, state: {item: ["Wooden Buckler"]}},
        {type: GrindItemQuantity, state: {resource: " Tree", items: {Wood: 30}, tool: "axe"}},
        {type: GrindItemQuantity, state: {resource: " Rock", items: {Stone: 20}, tool: "pickaxe"}},
        {type: GrindItemQuantity, state: {resource: " Bush", items: {Tinder: 4}}},
        {type: EquipItem, state: {item: ["Wood Sword"]}},
        TargetCreature,
        {type: DropItem, state: {items: {Pelt: 2, Bone : 0, "Raw Meat" : 0, "Carrot Seed" : 0 }}},
        {type: LootItemQuantity, state: {radius: 5, items: {Pelt: 2, Salmonberry: 20}}},
        FollowTarget
    ]
};

