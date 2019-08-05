import {StateMachineDescriptor} from "../../StateFactory";
import {HealWithItem} from "../../units/healing/HealWithItem";
import {HealOnFountain} from "../../units/healing/HealOnFountain";
import {EatFood} from "../../units/misc/EatFood";
import {WaypointState} from "../../units/walking/waypoint/Common";
import {FollowWaypoint} from "../../units/walking/waypoint/FollowWaypoint";
import {AdvanceWaypoint} from "../../units/walking/waypoint/AdvanceWaypoint";
import {TargetCreature} from "../../units/targeting/TargetCreature";
import {EquipItem} from "../../units/iventory/EquipItem";
import {CraftItem} from "../../units/craft/CraftItem";
import {LootItems} from "../../units/looting/LootItems";
import {GrindResource} from "../../units/grind/GrindResource";
import {Game} from "../../../game/Game";
import {LootItemQuantity} from "../../units/looting/LootItemQuantity";
import {DropItem} from "../../units/iventory/DropItem";
import {FollowTarget} from "../../units/walking/FollowTarget";
import {UpgradeSkills} from "../../units/upgrades/UpgradeSkills";
import {upgrades} from "../../../game/Upgrades";
import {PlantSeed} from "../../units/farming/PlantSeed";
import {playerHasCloseTarget, playerHasNoCloseTarget} from "./common/predicates";


//// Predicates

let playerHasStoneTools = async (game: Game) => {
    return game.player.equip.hasEquipables({
        "Stone Pickaxe": 1,
        "Stone Axe": 1,
    }) || game.iventory.contains("Stone", 20)
};

let playerHasWoodItems = async (game: Game) => {
    return game.player.equip.hasEquipables(
        {
            "Wood Sword": 1,
            "Stone Pickaxe": 1,
            "Stone Axe": 1,
            "Flint Dagger" : 1,
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
            "Flint Dagger": 1,
        }) || game.iventory.contains("Flint", 8)
};


let playerIsAtMediumLevel = async (game: Game) => {
    return game.player.mob.level >= 8
};


let playerIsAtLowLevel = async (game: Game) => {
    return game.player.mob.level < 5
};



///// Waypoints

let waypoints = [{"dlevel": "newbie", "x": 28, "y": 42, "radius": 3}, {
    "dlevel": "newbie",
    "x": 41,
    "y": 42,
    "radius": 3
}, {"dlevel": "newbie", "x": 50, "y": 33, "radius": 3}, {
    "dlevel": "newbie",
    "x": 49,
    "y": 42,
    "radius": 3
}, {"dlevel": "newbie", "x": 61, "y": 42, "radius": 3}, {
    "dlevel": "newbie",
    "x": 69,
    "y": 44,
    "radius": 3
}, {"dlevel": "newbie", "x": 62, "y": 35, "radius": 3}, {
    "dlevel": "newbie",
    "x": 70,
    "y": 27,
    "radius": 3
}, {"dlevel": "newbie", "x": 71, "y": 19, "radius": 3}, {
    "dlevel": "newbie",
    "x": 61,
    "y": 14,
    "radius": 3
}, {"dlevel": "newbie", "x": 48, "y": 15, "radius": 3}, {
    "dlevel": "newbie",
    "x": 41,
    "y": 21,
    "radius": 3
}, {"dlevel": "newbie", "x": 38, "y": 15, "radius": 3}, {
    "dlevel": "newbie",
    "x": 41,
    "y": 21,
    "radius": 3
}, {"dlevel": "newbie", "x": 48, "y": 15, "radius": 3}, {
    "dlevel": "newbie",
    "x": 41,
    "y": 21,
    "radius": 3
}, {"dlevel": "newbie", "x": 51, "y": 26, "radius": 3}, {
    "dlevel": "newbie",
    "x": 44,
    "y": 37,
    "radius": 3
}, {"dlevel": "newbie", "x": 37, "y": 42, "radius": 3}];
let waypointState: WaypointState = {
    loop: true,
    steps: 4,
    waypoints: waypoints
};


///// State Machines


let EquipWeapon = {
    name: "Equip Weapon",
    condition: playerHasCloseTarget,
    stateDescriptors: [
        {type: EquipItem, state: {item: ["Flint Dagger", "Wood Sword", "Bone Axe", "Stone Axe"]}}
    ]
};

let WalkAroundAttackingOnlyMobsThatAttackYou: StateMachineDescriptor = {
    name: "Walk Around",
    stateDescriptors: [
        // Walk around attacking only mobs that attacks you
        EquipWeapon,
        {type: TargetCreature, state: {retarget: true, range: 1, filters: [""]}},
        {type: FollowWaypoint, state: waypointState},
        {type: AdvanceWaypoint, state: waypointState},
    ]
};

let PlayerHealth: StateMachineDescriptor = {
    name: "Player Health",
    stateDescriptors: [
        {type: HealWithItem, state: {}},
        {type: EatFood, state: {minHunger: 98, foods: ["^Carrot$"]}},
        {type: EatFood, state: {}},
        {
            type: UpgradeSkills,
            state: {skills: [upgrades.weight, upgrades.hp, upgrades.ups, upgrades.exp, upgrades.star]}
        },

    ]
};

let NewbyeVillageHealOnFountain: StateMachineDescriptor = {
    name: "Heal on Fountain",
    stateDescriptors: [
        {type: HealOnFountain, state: {}},
    ]
};

let EquipArmorAndAcessories: StateMachineDescriptor = {
    name: "Equip armor and accessories",
    stateDescriptors: [
        {type: EquipItem, state: {item: ["Grass Band"], two: true}},
        {type: EquipItem, state: {item: ["Pelt Armor"]}},
    ]
};


let CraftThings = {
    stateDescriptors: [
        {
            name: "Craft Basic Equips",
            stateDescriptors: [
                {type: CraftItem, state: {items: [{tpl: "pelt_armor"}]}},
                {type: CraftItem, state: {items: [{tpl: "grass_band", quantity: 2}]}},
            ]
        },
        {
            name: "Craft Better Tools",
            condition: playerIsAtMediumLevel,
            stateDescriptors: [
                {type: CraftItem, state: {items: [{tpl: "bone_axe"}]}},
                {type: CraftItem, state: {items: [{tpl: "bone_pickaxe"}]}},
                {type: CraftItem, state: {items: [{tpl: "flint_dagger"}]}},
            ]

        },
        {
            name: "Craft Initial Tools",
            until: playerIsAtMediumLevel,
            stateDescriptors: [
                {type: CraftItem, state: {items: [{tpl: "stone_pickaxe"}]}},
                {type: CraftItem, state: {items: [{tpl: "stone_axe"}]}},
                {type: CraftItem, state: {items: [{tpl: "wood_sword"}]}},
            ]
        },
    ]
};


let GatherResources = {
    condition: playerHasNoCloseTarget,
    stateDescriptors: [
        {
            name: "Get Spices",
            stateDescriptors: [
                {type: GrindResource, state: {resource: "^Spice Bush$", radius : 8}}
            ]
        },
        {
            name: "Grind for Initial Tools",
            until: async (game) => await playerIsAtMediumLevel(game) || (await playerHasWoodItems(game) && await playerHasStoneTools(game)),
            stateDescriptors: [

                {type: GrindResource, state: {resource: "Plain Rock"}, until: playerHasStoneTools},
                {type: GrindResource, state: {resource: "Fir Tree"}, until: playerHasWoodItems},

                WalkAroundAttackingOnlyMobsThatAttackYou
            ]

        },
        {
            name: "Grind for Better Tools",
            condition: playerIsAtMediumLevel,
            stateDescriptors: [
                {type: GrindResource, state: {resource: "Plain Rock"}, until: playerHasFlintDagger},
                {type: GrindResource, state: {resource: "Plain Rock"}, until: playerHasStoneTools},
                {type: GrindResource, state: {resource: "Fir Tree"}, until: playerHasWoodItems},
            ]

        },
        {
            name: "Grind for Basic Equips",
            stateDescriptors: [
                {type: GrindResource, state: {resource: "\\w* Bush"}, until: playerHasTinderItems}
            ]
        }

    ]
};

let TargetMobs = {
    name: "Target Mobs",
    stateDescriptors: [
        {type: TargetCreature, state: {retarget: true, range: 17, filters: ["Rat"]}, condition : playerIsAtLowLevel },
        {type: TargetCreature, state: {retarget: true, range: 5, filters: ["Hornet", "Snake"]}, condition : playerIsAtMediumLevel},
        {type: TargetCreature, state: {retarget: true, range: 17, filters: ["Chicken", "Water \\w*"]}},
        {type: TargetCreature, state: {retarget: true, range: 8, filters: ["Raccoon"]}},
        {type: TargetCreature, state: {retarget: true, range: 2, filters: [".*"]}},
    ]
};

let LootThings = {
    name: "Loot Things",
    stateDescriptors: [
        {type: LootItems, state: {filter: "Bone", radius: 10}, until: playerHasBoneItems},
        {type: LootItems, state: {filter: "Pelt", radius: 10}, until: playerHasPeltItems},
        {
            type: LootItemQuantity, state: {
                radius: 8, items:
                    {
                        "Silver.*" : 0,
                        Salmonberry: 20,
                        "Healing Potion": 0,
                        "Feather": 0,
                        Worms: 0,
                        "(Holly|Tomato|Aloe) seed": 0,
                        "carrot seed": 80,
                        Pinecone: 0,
                        Clay: 0,
                        "Withered Crop": 0,
                        "^Carrot$": 0
                    }
            }
        },
    ]
};

let DropThings = {
    name: "Drop things",
    stateDescriptors: [
        {
            name: "Drop old tools",
            condition: playerIsAtMediumLevel,
            stateDescriptors: [
                {
                    type: DropItem,
                    state: {items: {"Stone Pickaxe": 0}},
                    condition: async (game) => game.player.equip.hasEquipable("Bone Pickaxe", 1)
                },
                {
                    type: DropItem,
                    state: {items: {"Stone Axe": 0}},
                    condition: async (game) => game.player.equip.hasEquipable("Bone Axe", 1)
                },
                {
                    type: DropItem,
                    state: {items: {"Wood Sword": 0}},
                    condition: async (game) => game.player.equip.hasEquipable("Flint Dagger", 1)
                },
            ]
        },
        {type: DropItem, state: {items: {Pelt: 2, Bone: 25, "Raw Meat": 0, Mud: 0, Potato: 0, "Carrot seed$": 100}}},

    ]
};


let FollowTargets = {
    name: "Follow Target",
    stateDescriptors: [
        {type: FollowTarget, state: {}}
    ]
};

let PlantSeeds = {
    name: "Plant Seeds",
    stateDescriptors: [
        {type: PlantSeed, state: { seed : "Carrot Seed", min : 30 }}
    ]
};
//// Full state machine

export let ReachLevel20: StateMachineDescriptor = {
    name: "Reach Level 20",
    stateDescriptors: [
        PlayerHealth,
        NewbyeVillageHealOnFountain,

        EquipArmorAndAcessories,
        CraftThings,

        TargetMobs,
        EquipWeapon,

        GatherResources,
        LootThings,
        DropThings,

        PlantSeeds,

        FollowTargets,
        WalkAroundAttackingOnlyMobsThatAttackYou,
    ]
};
