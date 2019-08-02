<template>
    <div>
        <button class="stopButton" v-if="Controller.isActivated" @click="stop">Stop</button>
        <button class="startButton" v-else @click="execute">Start</button>
    </div>
</template>

<script>
    import {IGameWindow} from "../../../bot/game/Interfaces";
    import {ControllerState, StateController} from "../../../bot/state/StateController";

    export default {
        name: "Options",

        injectModels: [
            'Controller',
        ],

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
</script>

<style scoped>
</style>
