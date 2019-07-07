import {Point} from "./Types";

export  function distanceBetween(p1: Point, p2: Point, allowDiagonals = false) : number {
    if (allowDiagonals){
        return (p1.x - p2.x)**2 + (p2.y - p1.y)**2;
    }
    return Math.abs(p1.x - p2.x) + Math.abs(p2.y - p1.y);
}