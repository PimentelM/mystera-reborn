<template>
    <div>
        <div class="lastStateMachineExecuted" v-if="Controller.isActivated">
            {{Controller.lastStateExecuted}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "Hud",

        injectModels: [
            'Controller',
        ],

    }
</script>

<style scoped>

    .lastStateMachineExecuted{
        color: white;
        text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
        font-size: 120%;
    }

</style>
