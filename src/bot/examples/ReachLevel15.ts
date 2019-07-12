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
import {UpgradeSkills} from "../states/upgrades/UpgradeSkills";
import {upgrades} from "../../game/Upgrades";
import {WaypointState} from "../states/walking/waypoint/Common";
import {FollowWaypoint} from "../states/walking/waypoint/FollowWaypoint";
import {AdvanceWaypoint} from "../states/walking/waypoint/AdvanceWaypoint";


let playerHasStoneTools = (game: Game) => {
    return game.iventory.containItems({
        "Stone Pickaxe": 1,
        "Stone Axe": 1,
    }, "\\*?") || game.iventory.contains("Stone", 20)
};

let playerHasWoodItems = (game: Game) => {
    return game.iventory.containItems(
        {
            "Wood Sword": 2,
            "Stone Pickaxe": 1,
            "Stone Axe": 1
        }, "\\*?") || game.iventory.contains("Wood", 15)
};

let playerHasTinderItems = (game: Game) => {
    return game.iventory.containItems({
        "Grass Band": 2,
        "Pelt Armor": 1,
    }, "\\*?") || game.iventory.contains("Tinder", 4)
};


let waypoints = [{"dlevel":"newbie","x":28,"y":42,"radius":3},{"dlevel":"newbie","x":41,"y":42,"radius":3},{"dlevel":"newbie","x":50,"y":33,"radius":3},{"dlevel":"newbie","x":49,"y":42,"radius":3},{"dlevel":"newbie","x":61,"y":42,"radius":3},{"dlevel":"newbie","x":69,"y":44,"radius":3},{"dlevel":"newbie","x":62,"y":35,"radius":3},{"dlevel":"newbie","x":70,"y":27,"radius":3},{"dlevel":"newbie","x":71,"y":19,"radius":3},{"dlevel":"newbie","x":61,"y":14,"radius":3},{"dlevel":"newbie","x":48,"y":15,"radius":3},{"dlevel":"newbie","x":41,"y":21,"radius":3},{"dlevel":"newbie","x":51,"y":26,"radius":3},{"dlevel":"newbie","x":44,"y":37,"radius":3},{"dlevel":"newbie","x":37,"y":42,"radius":3}];
let waypointState : WaypointState = {
    loop: true,
    steps: 4,
    waypoints: waypoints
};

export let reachLevel15 = [
    {type: HealWithItem, state: {}},
    {type: HealOnFountain, state: {}},
    {type: EatFood, state: {}},
    {type: UpgradeSkills, state: {skills: [upgrades.hp, upgrades.ups, upgrades.exp, upgrades.attack, upgrades.defense, upgrades.weight, upgrades.precision, upgrades.crit, upgrades.star]}},


    {type: CraftItem, state: {items: [{tpl: "stone_pickaxe"}]}},
    {type: CraftItem, state: {items: [{tpl: "stone_axe"}]}},
    {type: CraftItem, state: {items: [{tpl: "wood_sword", quantity: 2}]}},
    {type: CraftItem, state: {items: [{tpl: "pelt_armor"}]}},
    {type: CraftItem, state: {items: [{tpl: "grass_band", quantity: 2}]}},

    {type: EquipItem, state: {item: ["Grass Band"], two: true}},
    {type: EquipItem, state: {item: ["Pelt Armor"]}},

    {type: GrindResource, state: {resource: "Plain Rock", items: {Stone: 20}, until: playerHasStoneTools}},
    {type: GrindResource, state: {resource: "Fir Tree", items: {Wood: 30}, until: playerHasWoodItems}},
    {type: GrindResource, state: {resource: "\\w* Bush", items: {Tinder: 4}, until: playerHasTinderItems}},

    {type: EquipItem, state: {item: ["Wood Sword"]}},


    {type: TargetCreature, state: { retarget : true ,filters: ["Snake", "Bee" ,"Chicken", "Water \\w*","Raccoon"]}},
    {type: TargetCreature, state: { range : 3 ,filters: [""]}},

    {type: LootItemQuantity, state: {radius: 5, items: {Pelt: 2, Salmonberry: 10, "Healing Potion" : 0, "Feather" : 0, Worms : 0}}},
    {type: DropItem, state: {items: {Pelt: 2, Bone: 0, "Raw Meat": 0, "Carrot Seed": 0, Mud : 0}}},
    {type: FollowTarget, state: {}},

    {type: FollowWaypoint, state: waypointState},
    {type: AdvanceWaypoint, state: waypointState},
];

