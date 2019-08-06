import Vue from "vue"
import {doWhen} from "../../../Utils";

let GameData = {
    name: "GameData",
    data: {
        ready: false,
        state: {
            x: 0,
            y: 0,
            mapName: ""
        }

    },
    created() {
        doWhen(() => {
                this.state = window.hudData;
                this.ready = true;
            },
            () => !!window.Player.mob,
            100);
    },

};


export default GameData;
