interface GameWindow {
    hp_status : {val},
    connection : WebSocket
    getMob(id) : Mob
    me : Number
  
  }
  
  interface Mob {
    x : Number,
    y : Number,
    z : Number,
    name : String,
    hpbar : {val},
  }

  