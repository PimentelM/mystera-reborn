import {Game} from "../game/Game";


export type  GamePredicate = (game : Game) => Promise<boolean>

export abstract class StateUnitClass implements IStateMachine{
    abstract state : {};
    abstract game : Game;
    abstract readonly defaultParams : {};
    abstract async isReached(): Promise<boolean>
    abstract async reach() : Promise<boolean>
    condition: GamePredicate;
    until: GamePredicate;

    isComposite: boolean = false;
    name: string = null;
    stateMachines: StateMachine[] = null;
    stateUnits: StateUnitClass[] = [this];
}


export interface IStateMachine {
    name : string;
    stateUnits : StateUnitClass[];  // Execute individual state units
    stateMachines : IStateMachine[]; // But if there are state machines, the controller will execute them instead, recursively
    condition: GamePredicate;
    until: GamePredicate;
    isComposite : boolean
}

export class StateMachine implements IStateMachine{
    name : string;
    isComposite : boolean = true;
    stateUnits : StateUnitClass[] = null;  // This state machine class is always "composite"
    stateMachines : IStateMachine[];
    condition: GamePredicate;
    until: GamePredicate;

    public constructor(name : string, stateMachines : IStateMachine[] , condition : GamePredicate , until : GamePredicate){
        this.name = name ;
        this.stateMachines = stateMachines;
        this.condition = condition;
        this.until = until;
    }
}



