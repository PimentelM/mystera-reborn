import {Game} from "../../game/Game";
import {TargetCreature} from "./targeting/TargetCreature";
import {FollowTarget} from "./walking/FollowTarget";
import {StateDefinition} from "../Interfaces";
import {fillInto} from "../../Utils";
import {LootItems} from "./looting/LootItems";


type UnitTypeConstructor = new () => StateDefinition;
type UnitType = UnitTypeConstructor | string;

export type Unit = {
    type: UnitType, state: {}
}



export class StateFactory {

    public states = {
        looting: {
            lootItems: LootItems
        },
        targeting: {
            targetCreature: TargetCreature,
        },
        walking: {
            followTarget: FollowTarget,
        }
    };

    public build(unitInitiators: (Unit | UnitType )[]): StateDefinition[] {
        let builtUnits = [];

        for (let unit of unitInitiators) {
            // Unit
            if((unit as Unit).type){
                let {type, state} = (unit as Unit);
                builtUnits.push(this.buildUnit(type,state));
                continue;
            }

            //UnitType
            builtUnits.push(this.buildUnit((unit as UnitType),{}));
        }

        return builtUnits;
    }


    private buildUnit(type: UnitType, state: object): StateDefinition {
        type = this.typeFromString(type);

        let unit = new type();
        unit.state = state;
        fillInto(unit.defaultParams, unit.state);
        return unit;
    }

    private typeFromString(path : string | UnitTypeConstructor) : UnitTypeConstructor {
        if (typeof path !== "string") return path;

        let pathParts = path.split(".");
        let type = this.states[pathParts.shift()];

        for (let part of pathParts){
            type = type[part];
            if(!type) throw new Error(`Could not find a UnitType from the provided path "${path}"`);
        }

        return type;
    }


}