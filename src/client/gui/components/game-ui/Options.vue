<template>

    <md-button id="openGui" @click="Gui.open" class="md-icon-button">
        <md-icon>
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
    i{
        color: deepskyblue !important;
    }
</style>
