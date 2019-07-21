import {Game} from "../game/Game";
import {examples} from "./machines/Examples";
import {StateMachine, StateUnitClass} from "../Interfaces";
import {fillInto} from "../../../Utils";

type UnitTypeConstructor = new () => StateUnitClass;

export type UnitType = UnitTypeConstructor;

export type StateUnitDescriptor = {
    type: UnitType, state: {}, until? : (game : Game) => Promise<boolean>, condition? : (game : Game) => Promise<boolean>
}

export type StateMachineDescriptor = {
    name? : string, stateDescriptors : ( StateUnitDescriptor |  StateMachineDescriptor) [], until? : (game : Game) => Promise<boolean>, condition? : (game : Game) => Promise<boolean>
}


export class StateFactory {

    public examples = examples;
    private readonly game: Game;

    public constructor(game: Game) {
        this.game = game;
    }

    public build(machineDescriptor: StateMachineDescriptor) : StateMachine {
        let {name, stateDescriptors , until, condition} = machineDescriptor;

        let stateUnits = null;
        let stateMachines = [];

        for (let stateDescriptor of stateDescriptors){
            // If it is a state machine descriptor
            if((stateDescriptor as StateMachineDescriptor).stateDescriptors){
                stateMachines.push( this.build(stateDescriptor as StateMachineDescriptor) )
            } else if ((stateDescriptor as StateUnitDescriptor).type){
                stateMachines.push(this.buildUnit(stateDescriptor as StateUnitDescriptor))
            }
        }

        return new StateMachine(name || null, stateMachines, condition,until);
    }


    private buildUnits(unitDescriptors: StateUnitDescriptor[]): StateUnitClass[] {
        let builtUnits = [];
        for (let unitDescriptor of unitDescriptors) {
            // Unit
            if (unitDescriptor.type) {
                builtUnits.push(this.buildUnit(unitDescriptor));
            }
        }
        return builtUnits;
    }

    private buildUnit(unitDescriptor : StateUnitDescriptor): StateUnitClass {
        let {type , state , until, condition} = unitDescriptor;

        let unit = new type();
        unit.state = state;
        unit.game = this.game;
        if(condition) unit.condition = condition;
        if(until) unit.until = until;
        fillInto(unit.defaultParams, unit.state);
        return unit;
    }



}