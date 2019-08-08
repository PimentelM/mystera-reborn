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


        this.showUpgradeDialog();
        this.gamePacketParserHook();

        this.areHooksInstalled = true;
    }

    private updateReactiveDataHook() {
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

    }

    private gamePacketParserHook() {


        let originalParser = this.game.window.parse;

        let newParser = (packet: object) => {
            packet = this.game.parser.executeParsers(packet);

            originalParser(packet);
        };

        this.game.window.parse = newParser;

    }

    private showUpgradeDialog() {

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
    }


}
