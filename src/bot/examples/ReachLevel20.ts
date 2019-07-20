import {StateMachineDescriptor} from "../states/StateFactory";
import {HealWithItem} from "../states/healing/HealWithItem";
import {HealOnFountain} from "../states/healing/HealOnFountain";
import {EatFood} from "../states/misc/EatFood";
import {WaypointState} from "../states/walking/waypoint/Common";
import {FollowWaypoint} from "../states/walking/waypoint/FollowWaypoint";
import {AdvanceWaypoint} from "../states/walking/waypoint/AdvanceWaypoint";
import {TargetCreature} from "../states/targeting/TargetCreature";
import {EquipItem} from "../states/iventory/EquipItem";
import {CraftItem} from "../states/craft/CraftItem";
import {LootItems} from "../states/looting/LootItems";
import {GrindResource} from "../states/grind/GrindResource";
import {Game} from "../../game/Game";
import {LootItemQuantity} from "../states/looting/LootItemQuantity";
import {DropItem} from "../states/iventory/DropItem";
import {FollowTarget} from "../states/walking/FollowTarget";
import {UpgradeSkills} from "../states/upgrades/UpgradeSkills";
import {upgrades} from "../../game/Upgrades";


let playerHasStoneTools = async (game: Game) => {
    return game.player.equip.hasEquipables({
        "Stone Pickaxe": 1,
        "Stone Axe": 1,
    }) || game.iventory.contains("Stone", 20)
};

let playerHasWoodItems = async (game: Game) => {
    return game.player.equip.hasEquipables(
        {
            "Wood Sword": 2,
            "Stone Pickaxe": 1,
            "Stone Axe": 1
        }) || game.iventory.contains("Wood", 15)
};

let playerHasTinderItems = async (game: Game) => {
    return game.player.equip.hasEquipables({
        "Grass Band": 2,
        "Pelt Armor": 1,
    }) || game.iventory.contains("Tinder", 4)
};


let playerHasPeltItems = async (game: Game) => {
    return game.player.equip.hasEquipables({
        "Pelt Armor": 1,
    }) || game.iventory.contains("Pelt", 2)
};


let playerHasBoneItems = async (game: Game) => {
    return game.player.equip.hasEquipables({
        "Bone Axe": 1,
        "Bone Pickaxe": 1,
    }) || game.iventory.contains("Bone", 25)
};

let playerHasFlintDagger = async (game: Game) => {
    return game.player.equip.hasEquipables(
        {
            "Flint Dagger": 2,
        }) || game.iventory.contains("Flint", 8)
};

let waypoints = [{"dlevel":"newbie","x":28,"y":42,"radius":3},{"dlevel":"newbie","x":41,"y":42,"radius":3},{"dlevel":"newbie","x":50,"y":33,"radius":3},{"dlevel":"newbie","x":49,"y":42,"radius":3},{"dlevel":"newbie","x":61,"y":42,"radius":3},{"dlevel":"newbie","x":69,"y":44,"radius":3},{"dlevel":"newbie","x":62,"y":35,"radius":3},{"dlevel":"newbie","x":70,"y":27,"radius":3},{"dlevel":"newbie","x":71,"y":19,"radius":3},{"dlevel":"newbie","x":61,"y":14,"radius":3},{"dlevel":"newbie","x":48,"y":15,"radius":3},{"dlevel":"newbie","x":41,"y":21,"radius":3},{"dlevel":"newbie","x":51,"y":26,"radius":3},{"dlevel":"newbie","x":44,"y":37,"radius":3},{"dlevel":"newbie","x":37,"y":42,"radius":3}];
let waypointState : WaypointState = {
    loop: true,
    steps: 4,
    waypoints: waypoints
};

let EquipWeapon = {
    name : "Equip Weapon",
    stateDescriptors: [
        {type: EquipItem, state: {item: ["Flint Dagger","Wood Sword", "Bone Axe", "Stone Axe"]}}
    ]
};

let WalkAroundAttackingOnlyMobsThatAttackYou : StateMachineDescriptor = {
    name : "Walk Around",
    stateDescriptors : [
        // Walk around attacking only mobs that attacks you
        EquipWeapon,
        {type: TargetCreature, state: { retarget : true, range : 1 ,filters: [""]}},
        {type: FollowWaypoint, state: waypointState},
        {type: AdvanceWaypoint, state: waypointState},
    ]
};

let Healing: StateMachineDescriptor = {
    name : "Player Health",
    stateDescriptors : [
        {type: HealWithItem, state: {}},
        {type: EatFood, state: {}},
        {type: UpgradeSkills, state: {skills: [upgrades.weight, upgrades.hp, upgrades.ups, upgrades.exp, upgrades.attack, upgrades.defense, upgrades.star, upgrades.precision]}},

    ]
};

let NewbyeVillageHealOnFountain : StateMachineDescriptor = {
    name : "Heal on Fountain",
    stateDescriptors : [
        {type: HealOnFountain, state: {}},
    ]
};

let EquipArmorAndAcessories : StateMachineDescriptor = {
    name : "Equip armor and accessories",
    stateDescriptors : [
        {type: EquipItem, state: {item: ["Grass Band"], two: true}},
        {type: EquipItem, state: {item: ["Pelt Armor"]}},
    ]
};


let InitialCraftGrind : StateMachineDescriptor = {
    name: "Grind for Initial Tools",
    until : async (game) => game.player.mob.level >= 7 || (await playerHasWoodItems(game) && await playerHasStoneTools(game)),
    stateDescriptors : [

        {type: GrindResource, state: {resource: "Plain Rock"}, until: playerHasStoneTools},
        {type: GrindResource, state: {resource: "Fir Tree"}, until: playerHasWoodItems},

        WalkAroundAttackingOnlyMobsThatAttackYou
    ]

};

let InitialCraft : StateMachineDescriptor = {
    name : "Craft Initial Tools",
    until : async  (game) => game.player.mob.level >= 7,
    stateDescriptors : [
        {type: CraftItem, state: {items: [{tpl: "stone_pickaxe"}]}},
        {type: CraftItem, state: {items: [{tpl: "stone_axe"}]}},
        {type: CraftItem, state: {items: [{tpl: "wood_sword"}]}},
    ]
};



let BetterCraftGrind : StateMachineDescriptor = {
    name: "Grind for Better Tools",
    condition : async (game) => game.player.mob.level >= 7,
    stateDescriptors : [

        {type: GrindResource, state: {resource: "Plain Rock"}, until: playerHasFlintDagger},
        {type: GrindResource, state: {resource: "Plain Rock"}, until: playerHasStoneTools},
        {type: GrindResource, state: {resource: "Fir Tree"}, until: playerHasWoodItems},
    ]

};

let BetterCraft : StateMachineDescriptor = {
    name: "Craft Better Tools",
    condition : async (game) => game.player.mob.level >= 7,
    stateDescriptors : [
        {type: CraftItem, state: {items: [{tpl: "bone_pickaxe"}]}},
        {type: CraftItem, state: {items: [{tpl: "bone_axe"}]}},
        {type: CraftItem, state: {items: [{tpl: "flint_dagger", quantity : 2}]}},
    ]

};

let BasicEquipCraft : StateMachineDescriptor = {
    name : "Craft Basic Equips",
    stateDescriptors : [
        {type: CraftItem, state: {items: [{tpl: "pelt_armor"}]}},
        {type: CraftItem, state: {items: [{tpl: "grass_band", quantity: 2}]}},

        {type: GrindResource, state: {resource: "\\w* Bush", items: {Tinder: 4}}, until: playerHasTinderItems},
    ]
};


let HuntMobs : StateMachineDescriptor = {
    name : "Hunt",
    stateDescriptors : [

        EquipWeapon,

        {type: TargetCreature, state: { retarget : true, range : 3 ,filters: ["Hornet", "Snake"]}},
        {type: TargetCreature, state: { retarget : true ,filters: ["Chicken", "Water \\w*"]}},
        {type: TargetCreature, state: { retarget : true, range: 7,filters: ["Raccoon"]}},
        {type: TargetCreature, state: { retarget : true, range : 3 ,filters: [""]}},

        {type: LootItems, state: {filter: "^Bone$", radius: 10}, until: playerHasBoneItems },
        {type: LootItems, state: {filter: "^Pelt$", radius: 10}, until: playerHasPeltItems },

        {type: LootItemQuantity, state: {radius: 5, items: {Salmonberry: 30, "Healing Potion" : 0, "Feather" : 0, Worms : 0, ".* seed$" : 0, Pinecone : 0 }}},
        {type: DropItem, state: {items: {Pelt: 2, Bone: 25, "Raw Meat": 0, Mud : 0}}},
        {type: FollowTarget, state: {}},
    ]
};


let DropOldToolsIfPlayerHasNewOnes : StateMachineDescriptor = {
    name : "Drop old tools",
    condition : async (game) => game.player.mob.level >= 7,
    stateDescriptors : [
        {type: DropItem, state: {items: { "Stone Pickaxe" : 0}   } , condition : async (game) => game.player.equip.hasEquipable("Bone Pickaxe", 1) },
        {type: DropItem, state: {items: { "Stone Axe" : 0}   } , condition : async (game) => game.player.equip.hasEquipable("Bone Axe", 1) },
        {type: DropItem, state: {items: { "Wood Sword" : 0}   } , condition : async (game) => game.player.equip.hasEquipable("Flint Dagger", 1) },
    ]
};

export let reachLevel20 : StateMachineDescriptor = {
    name: "Reach Level 20",
    stateDescriptors: [
        Healing,
        NewbyeVillageHealOnFountain,
        EquipArmorAndAcessories,
        DropOldToolsIfPlayerHasNewOnes,
        InitialCraft,
        BetterCraft,
        BasicEquipCraft,
        InitialCraftGrind,
        BetterCraftGrind,
        HuntMobs,
        WalkAroundAttackingOnlyMobsThatAttackYou
    ]
};