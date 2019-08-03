import Vue from "vue"

let Gui =  {
    name: "Gui",
    data() {
        return {
            ready: false,
            state: {
                isOpen: false,
            }
        }
    },
    computed: {
        isOpen(){
            return this.state.isOpen;
        }
    },

    methods : {
        open(){
            this.state.isOpen = true;
        },
        close(){
            this.state.isOpen = false;
        }
    }

};


export default Gui;
