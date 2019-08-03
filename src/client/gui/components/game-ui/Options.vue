<template>
    <button @click="Gui.open">Open</button>
</template>

<script>
    import {IGameWindow} from "../../../bot/game/Interfaces";
    import {ControllerState, StateController} from "../../../bot/state/StateController";

    export default {
        name: "Options",

        injectModels: [
            'Gui',
        ],
    }
</script>

<style scoped>
</style>
