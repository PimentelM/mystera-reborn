<template>
    <div class="hudRoot">
        <div class="playerLocation displayText">
            <div>
                {{GameData.state.x}} {{GameData.state.y}}
            </div>
            <div>
                {{GameData.state.dlevel}}
            </div>
        </div>


        <div class="lastStateMachineExecuted displayText" v-if="Controller.isActivated">
            {{Controller.lastStateMachineExecuted}}
        </div>

        <div class="lastStateUnitExecuted displayText" v-if="Controller.isActivated">
            {{Controller.lastStateExecuted}}
        </div>


    </div>
</template>

<script>
    export default {
        name: "Hud",

        injectModels: [
            'Controller',
            'GameData'
        ],

    }
</script>

<style scoped>

    .displayText {
        color: white;
        text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
        font-size: 120%;
        position : absolute;
    }

    @media only screen and (max-width: 980px) {
        .displayText {
            transform: scale(0.85) translate(-10%);
            font-weight: bold;
        }
    }


    .playerLocation {
        top: 1.5%;
        left: 59.5%;
    }

    .lastStateUnitExecuted{
        top: 11%;
        left: 46.3%;
    }

    .lastStateMachineExecuted{
        top: 11%;
        left: 30.5%;
    }

    .hudRoot {
        width: 100%;
        height: 100%;
    }

</style>
