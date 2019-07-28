<template>
    <div id="app">
        <Options id="OptionsButton"></Options>
    </div>
</template>

<script lang="ts">
    import Options from "./components/game-ui/Options.vue"
    export default {
        name: "App",
        components: {Options},
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
        position: relative;
        top: 85%;
        left: 95%;
    }


</style>