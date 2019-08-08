import {Game} from "../game/Game";
import {examples} from "./machines/Examples";
import {StateMachine, StateUnitClass} from "../Interfaces";
import {Cooldown, fillInto} from "../../../Utils";

type UnitTypeConstructor = new () => StateUnitClass;

export type UnitType = UnitTypeConstructor;

export type StateUnitDescriptor = {
    type: UnitType, state: {}, checkerCooldown? : number,  until? : (game : Game) => Promise<boolean>, condition? : (game : Game) => Promise<boolean>
}

export type StateMachineDescriptor = {
    name? : string, stateDescriptors : ( StateUnitDescriptor |  StateMachineDescriptor) [], checkerCooldown? : number, until? : (game : Game) => Promise<boolean>, condition? : (game : Game) => Promise<boolean>
}


export class StateFactory {

    public examples = examples;
    private readonly game: Game;

    public constructor(game: Game) {
        this.game = game;
    }

    public async buildAsync(machineDescriptor: StateMachineDescriptor) : Promise<StateMachine> {
        let {name, stateDescriptors , until, condition, checkerCooldown} = machineDescriptor;

        let stateUnits = null;
        let stateMachines = [];

        for (let stateDescriptor of stateDescriptors){
            // If it is a state machine descriptor
            if((stateDescriptor as StateMachineDescriptor).stateDescriptors){
                stateMachines.push( await this.buildAsync(stateDescriptor as StateMachineDescriptor) )
            } else if ((stateDescriptor as StateUnitDescriptor).type){
                stateMachines.push( await this.buildUnitAsync(stateDescriptor as StateUnitDescriptor))
            }
        }

        return new StateMachine(name || null, stateMachines, condition,until, checkerCooldown || 0);
    }

    public build(machineDescriptor: StateMachineDescriptor) : StateMachine {
        let {name, stateDescriptors , until, condition, checkerCooldown} = machineDescriptor;

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

        return new StateMachine(name || null, stateMachines, condition,until, checkerCooldown || 0);
    }



    private buildUnit(unitDescriptor : StateUnitDescriptor): StateUnitClass {
        let {type , state , until, condition, checkerCooldown} = unitDescriptor;

        let unit = new type();
        unit.state = state;
        unit.game = this.game;
        if(checkerCooldown) unit.checkerCooldown = new Cooldown(checkerCooldown);
        if(condition) unit.condition = condition;
        if(until) unit.until = until;
        fillInto(unit.defaultParams, unit.state);
        return unit;
    }


    private async buildUnitAsync(unitDescriptor: StateUnitDescriptor) {
        return this.buildUnit(unitDescriptor);
    }
}
