<template>
    <div id="app">
        <div v-if="GameData.ready">
            <Options id="OptionsButton"></Options>
            <Hud id="Hud"></Hud>
        </div>

        <Main id="Main" v-if="Gui.isOpen"></Main>

    </div>
</template>

<script lang="ts">
    import Options from "./components/game-ui/Options.vue"
    import Hud from "./components/game-ui/Hud.vue"
    import Main from "./components/bot-gui/Main.vue";


    import Controller from "./view-model/Controller";
    import Gui from "./view-model/Gui";
    import GameData from "./view-model/GameData";

    export default {
        name: "App",
        models: {
            Controller, Gui, GameData

        },
        components: {Main, Hud, Options},
    }
</script>

<style scoped>
    #app {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
    }

    #app > * {
        pointer-events: all;
    }

    #OptionsButton {
        position: absolute;
        top: 83%;
        left: 92%;
    }

    #Hud {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    #Main {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }


</style>
