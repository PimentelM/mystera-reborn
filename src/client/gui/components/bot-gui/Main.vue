<template>
    <div>

        <md-content id="rootMenu">
            <md-toolbar class="md-dense">
                <h3 class="md-title" style="flex: 1">Mystera Reborn</h3>
                <md-button @click="Gui.close" class="md-icon-button">
                    <md-icon>close</md-icon>
                </md-button>
            </md-toolbar>

            <div class="md-layout md-gutter">

                <div class="md-layout-item">

                </div>

                <div class="md-layout-item">

                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-size=70">
                            <md-field>
                                <label>Machine</label>
                                <md-select :disabled="Controller.isActivated" v-model="Controller.selectedMachine" name="food" id="food">
                                    <md-option v-for="machine of Controller.machines" :key="machine.id" :value="machine.id">{{machine.name}}</md-option>
                                </md-select>
                            </md-field>
                        </div>

                        <div class="md-layout-item md-size-30 padLabel">
                            <md-button class="md-mini md-raised md-dense md-accent" v-if="Controller.isActivated" @click="Controller.stop">Stop</md-button>
                            <md-button :disabled="!Controller.selectedMachine" class="md-mini md-dense md-raised md-primary" v-else @click="Controller.execute">Execute</md-button>
                        </div>

                    </div>

                </div>

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

    .padLabel {
        padding-top: 13px;
    }



</style>
