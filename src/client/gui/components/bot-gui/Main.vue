<template>
    <div>

        <md-content id="rootMenu">
            <md-toolbar class="md-dense">
                <h3 class="md-title" style="flex: 1">Mystera Reborn</h3>
                <md-button @click="Gui.close" class="md-icon-button">
                    <md-icon>close</md-icon>
                </md-button>
            </md-toolbar>


            <div>
                <md-button class="md-mini md-raised md-error" v-if="Controller.isActivated" @click="Controller.stop">Stop</md-button>
                <md-button class="md-mini md-raised md-primary" v-else @click="Controller.execute">Start</md-button>
            </div>


        </md-content>


    </div>

</template>

<script>
    export default {
        injectModels: [
            'Controller', 'Gui',
        ],

        name: "Main",

    }
</script>

<style scoped>
    #rootMenu {
        height: 92%;
        margin: 2%;
        background-color: #424242b2;
    }



</style>
