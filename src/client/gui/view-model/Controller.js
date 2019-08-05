import Vue from "vue"
import * as _ from "lodash"
import config from "../config"
export default {
    name: "Controller",
    data: {
        ready: false,
        demo: config.demo,
        state: {
            isActivated: false,
            lastStateExecuted: null,
            lastExecutedMachine: null
        },
        selectedMachine: config.demo ? "ReachLevel20" : "GrindAll"
    },
    created() {
        this.state = window.StateController.state;
        this.ready = true;
    },
    computed: {
        lastStateExecuted() {
            return this.state.lastStateExecuted && this.state.lastStateExecuted.constructor.name
        },
        lastStateMachineExecuted(){
            return this.state.lastExecutedMachine
        },
        isActivated(){
            return this.state.isActivated;
        },
        machines(){
            return Object.keys(window.StateFactory.examples).map(key=>{
                return {
                    name: _.startCase(key),
                    id: key
                }
            });
        }
    },
    methods: {
        async execute() {
            let machineId = this.selectedMachine;
            window.StateController.execute(
                window.StateFactory.build(
                    window.StateFactory.examples[machineId]
                ));
        },
        stop() {
            window.StateController.stop();
        }
    }
}
