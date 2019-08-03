<template>
    <div id="app">
        <Main v-if="Gui.isOpen"></Main>
        <Options v-else id="OptionsButton"></Options>
        <Hud id="Hud"></Hud>
    </div>
</template>

<script lang="ts">
    import Options from "./components/game-ui/Options.vue"
    import Hud from "./components/game-ui/Hud.vue"
    import Main from "./components/bot-gui/Main.vue";


    import Controller from "./view-model/Controller";
    import Gui from "./view-model/Gui";

    export default {
        name: "App",
        models : {
            Controller, Gui

        },
        components: {Main, Hud, Options},
    }
</script>

<style scoped>
    #app{
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
        top: 87%;
        left: 92%;
    }

    #Hud {
        pointer-events: none;
        position: absolute;
        top: 11%;
        left: 45.3%;
    }

    #Main {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }


</style>
