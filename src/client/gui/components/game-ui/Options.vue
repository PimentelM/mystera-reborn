<template>
    <div>
        <button @click="execute">Run</button>
        <button @click="stop">Stop</button>
    </div>
</template>

<script lang="ts">
    import {IGameWindow} from "../../../bot/game/Interfaces";
    import {ControllerState, StateController} from "../../../bot/state/StateController";

    export default {
        name: "Options",
        methods: {
            execute() {
                (window as unknown as IGameWindow).StateController.execute(
                    (window as unknown as IGameWindow).StateFactory.build(
                        (window as unknown as IGameWindow).StateFactory.examples.reachLevel20));
            },
            stop() {
                (window as unknown as IGameWindow).StateController.stop();
            }
        }

    }
</script>

<style scoped>
button{
    display: block;
}
</style>