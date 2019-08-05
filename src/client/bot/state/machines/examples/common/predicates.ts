import {Game} from "../../../../game/Game";

export let playerHasCloseTarget = async (game: Game) => {
    return game.player.hasTarget() && game.player.distanceTo(game.player.getTarget()) <= 1;
};

export let playerHasNoCloseTarget = async (game: Game) => {
    return !(game.player.hasTarget() && game.player.distanceTo(game.player.getTarget()) <= 1);
};
