export default new Vue({
    name: "Bot",
    data() {
        return {
            ready: false,
            game: {
                player: {
                    mob: {
                        x: 0, y: 0, name: "", level: 0
                    }
                },
                window: {
                    dlevel: ""
                }
            },
            stateController: {
                state: {
                    isActivated: false;
    }
    }
    }
    },
    beforeMount() {
        let ptr = {intervalId: 0};
        ptr.intervalId = setInterval(() => {
            if (window.Player.mob) {
                this.game = window.Game;
                this.stateController = window.StateController;
                this.ready = true;
            }
        }, 1000);
    },
    computed: {
        dlevel() {
            return this.game.window.dlevel;
        }
    }
})
