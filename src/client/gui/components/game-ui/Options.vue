<template>

    <md-button id="openGui" @click="Gui.open" class="md-icon-button">
        <md-icon class="">
            whatshot
        </md-icon>
    </md-button>

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
