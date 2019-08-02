import {Game} from "./game/Game";
import {Cooldown} from "../../Utils";


export type  GamePredicate = (game : Game) => Promise<boolean>

export abstract class StateUnitClass implements IStateMachine{
    abstract state : {};
    abstract game : Game;
    abstract readonly defaultParams : {};
    abstract async isReached(): Promise<boolean>
    abstract async reach() : Promise<boolean>
    condition: GamePredicate;
    until: GamePredicate;

    checkerCooldown: Cooldown = null;

    isComposite: boolean = false;
    name: string = null;
    stateMachines: StateMachine[] = null;
    stateUnit: StateUnitClass = this;
}


export interface IStateMachine {
    name : string;
    stateUnit : StateUnitClass;  // Execute individual state units
    stateMachines : IStateMachine[]; // But if there are state machines, the controller will execute them instead, recursively
    condition: GamePredicate;
    until: GamePredicate;
    isComposite : boolean
    checkerCooldown : Cooldown;
}

export class StateMachine implements IStateMachine{
    name : string;
    isComposite : boolean = true;
    stateUnit : StateUnitClass = null;  // This state machine class is always "composite"
    stateMachines : IStateMachine[];
    condition: GamePredicate;
    until: GamePredicate;
    checkerCooldown : Cooldown = null;

    public constructor(name : string, stateMachines : IStateMachine[] , condition : GamePredicate , until : GamePredicate, checkerCooldown : number){
        this.name = name ;
        this.stateMachines = stateMachines;
        this.condition = condition;
        this.until = until;
        this.checkerCooldown = checkerCooldown == 0 ? null : new Cooldown(checkerCooldown);
    }
}



