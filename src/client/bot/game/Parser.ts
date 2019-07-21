import {Game} from "./Game";
import {fillInto} from "../../../Utils";

export  interface ParserState {
    parsers: {[id :string] : (x) => object};
}

export class Parser {
    game: Game;
    state: ParserState;

    private initialState() : ParserState{
        return {parsers : {}};
    }

    public constructor(game, state) {
        this.game = game;
        this.state = state;

        fillInto(this.initialState(),this.state)
    }



    public addParser = (parser: (data) => object, id = undefined): number => {
        if (!id) {
            id = new Date().valueOf();
            while (this.state.parsers[id]) id++;
        }
        this.state.parsers[id] = parser;
        return id;
    };

    public removeParser = (id) => delete this.state.parsers[id];


    public executeParsers = (data: object): object => {
        for (let [_, parser] of Object.entries(this.state.parsers)) {
            if (parser)
                data = parser(data);
        }
        return data;
    };
}