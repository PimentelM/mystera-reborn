import {Game} from "./Game";

export class Hooks {
    game: Game;

    public constructor(game) {
        this.game = game;
        this.installHooks();
    }


    get areHooksInstalled() {
        return this.game.window.areHooksInstalled;
    }

    set areHooksInstalled(value) {
        this.game.window.areHooksInstalled = true;
    }

    public installHooks() {
        if (this.areHooksInstalled) return true;


        this.showUpgradeDialog();
        this.gamePacketParserHook();

        this.areHooksInstalled = true;
    }

    private gamePacketParserHook(){


        let originalParser = this.game.window.parse;

        let newParser = (packet : object) => {
            packet = this.game.parser.executeParsers(packet);

            originalParser(packet);
        };

        this.game.window.parse = newParser;

    }

    private showUpgradeDialog() {

        // @ts-ignore
        let original = this.game.window.jv.upgrade_dialog.show;

        // @ts-ignore
        this.game.window.jv.upgrade_dialog.show = (a1,a2,a3) => {
            if (this.game.window.didBotUpgrade <= 2) {
                this.game.window.didBotUpgrade += 1
            } else {
                // @ts-ignore
                original.apply(this.game.window.jv.upgrade_dialog,[a1,a2,a3])
            }
        }
    }


}