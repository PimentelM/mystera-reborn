export type Mob = {
    x : Number,
    y : Number,
    z : Number,
    name : String,
    hpbar : {val},
}

export type Item = {
    name : string,
    can_block : boolean,
    can_pickup: boolean,
    can_stack: boolean,
    owner : number,
    template : string,
    x : number,
    y : number,
    update : number

}
export type Tile = {
    block : boolean,
    items : Array<Item>
}