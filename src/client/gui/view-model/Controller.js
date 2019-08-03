import Vue from "vue"

export default {
    name: "Controller",
    data() {
        return {
            ready: false,
            state: {
                isActivated: false,
                lastStateExecuted: null
            }
        }
    },
    created() {
        this.state = window.StateController.state;
        this.ready = true;
    },
    computed: {
        lastStateExecuted() {
            return this.state.lastStateExecuted && this.state.lastStateExecuted.constructor.name
        },
        isActivated(){
            return this.state.isActivated;
        }
    },
    methods: {
        async execute() {
            window.StateController.execute(
                window.StateFactory.build(
                    window.StateFactory.examples.reachLevel20));
        },
        stop() {
            window.StateController.stop();
        }
    }
}
