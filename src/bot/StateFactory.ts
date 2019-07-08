import {Game} from "../game/Game";
import {TargetCreature} from "./states/TargetCreature";
import {FollowTarget} from "./states/FollowTarget";
import {StateDefinition} from "./Interfaces";
import {fillInto} from "../Utils";


type StateConstructor = new () => StateDefinition;

export type StateInitiator = {
    type: StateConstructor, state: {}
}

export class StateFactory {
    public states = {
        targetCreature: TargetCreature,
        followTarget: FollowTarget
    };

    public build(stateInitiators: (StateInitiator | StateConstructor)[]) {
        stateInitiators.map(x => x['state'] ? x : {type: x, state: {}});
        return (stateInitiators as StateInitiator[]).map(this.buildUnit);
    }

    private buildUnit(stateInitiator: StateInitiator) {
        let unit = new stateInitiator.type();
        unit.params = stateInitiator.state;
        fillInto(unit.defaultParams, unit.params);
        return unit;
    }

}