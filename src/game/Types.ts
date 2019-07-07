export type Mob = {
    id: number,
    x: number,
    y: number,
    level: number,
    dir: number,
    last_dir: number,
    name: string,
    tribe: string,
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
}

export type IventoryItem = {
    col: any,
    eqp: boolean // isEquiped
    n: string   // Name
    qty: number  // Quantity
    slot: string // Slot
    tpl: string  // Template
}


export type GroundItem = {
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

export type Tile = {
    block: boolean,
    o: GroundItem[] // Items
}

export type Point = {
    x: number,
    y: number
}

export type PointMap = {
    [name:string] : Point
}
