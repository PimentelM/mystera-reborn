import {Game} from "./Game";
import {doWhen} from "../../../Utils";

export class Hooks {
    game: Game;

    public constructor(game) {
        this.game = game;
        doWhen(() => this.installHooks(), () => !!this.game.player.mob, 1000)
    }


    get areHooksInstalled() {
        return this.game.window.areHooksInstalled;
    }

    set areHooksInstalled(value) {
        this.game.window.areHooksInstalled = true;
    }

    public installHooks() {
        this.updateReactiveDataHook();

        if (this.areHooksInstalled) return true;


        this.updateMapHook();
        this.showUpgradeDialog();
        this.gamePacketParserHook();

        this.areHooksInstalled = true;
    }

    private updateReactiveDataHook = () => {
        let update = () => {
            this.game.window.hudData.x = this.game.player.x;
            this.game.window.hudData.y = this.game.player.y;
            this.game.window.hudData.mapName = this.game.map.name;
        };

        update();

        let originalMove = this.game.player.mob.move;

        let newMove = (x, y) => {
            let res = originalMove.apply(this.game.player.mob, [x, y]);
            update();
            return res;
        };

        this.game.player.mob.move = newMove;

    };

    private updateMapHook = () => {
        let action = () => {
            if(!window.Game.map.wholemap[window.Game.map.name]) window.Game.map.wholemap[window.Game.map.name] = {};
            for (let [key,value] of Object.entries(window.Game.window.map_index)){
                window.Game.map.wholemap[window.Game.map.name][key] = value;
            }
        };

        let originalUpdateMap = window.Game.window.jv.update_map;

        let newUpdate = (mapData) => {
            let res = originalUpdateMap(mapData);
            action();
            return res;
        };

        window.Game.window.jv.update_map = newUpdate;

    };

    private gamePacketParserHook = () => {


        let originalParser = this.game.window.parse;

        let newParser = (packet: object) => {
            packet = this.game.parser.executeParsers(packet);

            originalParser(packet);
        };

        this.game.window.parse = newParser;

    };

    private showUpgradeDialog = () => {

        // @ts-ignore
        let original = this.game.window.jv.upgrade_dialog.show;

        // @ts-ignore
        this.game.window.jv.upgrade_dialog.show = (a1, a2, a3) => {
            if (this.game.window.didBotUpgrade <= 2) {
                this.game.window.didBotUpgrade += 1
            } else {
                // @ts-ignore
                original.apply(this.game.window.jv.upgrade_dialog, [a1, a2, a3])
            }
        }
    };


}
