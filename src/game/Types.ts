
export interface Mob extends Point{
    id: number,
    x: number,
    y: number,
    level: number,
    dir: number,
    last_dir: number,
    name: string,
    tribe: string,
    template : string | number,
    hpbar: { val },
    move: (x, y) => undefined,
    walking: boolean,
    speed: number,
    tile_speed: number,
    net_tile_speed: number,
    bonus: number,
    cur_speed: number,
    traveled: number,
    dx: number,
    dy: number,
    fromx: number,
    fromy: number,
    sx: number,
    sy: number,
    title : any
}

export interface IventoryItem {
    col: any,
    eqp: boolean // isEquiped
    n: string   // Name
    qty: number  // Quantity
    slot: string // Slot
    tpl: string  // Template
}

export interface IIventoryItem extends IventoryItem{
    name : string,
    equiped : boolean,
    qtd : number,
    template : string
}


export interface GroundItem {
    name: string,
    can_block: boolean,
    can_pickup: boolean,
    can_stack: boolean,
    owner: number,
    template: string,
    x: number,
    y: number,
    update: number

}

export interface Tile  {
    block: boolean,
    o: GroundItem[] // Items
}

export interface TilePoint extends Tile{
    x : number,
    y : number,
}

export interface ITile extends TilePoint{
    items : GroundItem[]
}

export interface Point {
    x: number,
    y: number
}

export interface PointMap  {
    [name:string] : Point
}
