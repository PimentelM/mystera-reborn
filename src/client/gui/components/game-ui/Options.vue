<template>

    <div v-if="!Gui.isOpen">

        <div>
            <md-button class="md-mini md-raised md-accent md-icon-button" v-if="Controller.isActivated" @click="Controller.stop">
                <md-icon>stop</md-icon>
            </md-button>
            <md-button class="md-mini md-raised md-primary md-icon-button" v-else @click="Controller.execute">
                <md-icon>play_arrow</md-icon>
            </md-button>
        </div>

        <div>
            <md-button id="openGui" @click="Gui.open" class="md-icon-button">
                <md-icon class="">
                    whatshot
                </md-icon>
            </md-button>
        </div>


    </div>
</template>

<script>
    import {IGameWindow} from "@/bot/game/Interfaces";
    import {ControllerState, StateController} from "@/bot/state/StateController";
    import config from "@/gui/config"

    export default {
        name: "Options",

        injectModels: [
            'Gui',"Controller"
        ],

        data(){
            return {
                demo : config.demo
            }
        }
    }

</script>

<style scoped>
 #openGui{
     transform: translateX(50%) scale(0.9);
 }
</style>
