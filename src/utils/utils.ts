import {Vector} from "matter-js";

export function distance(v: Vector): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function directionNormalize(direction: Vector): Vector {
    const yaw = Math.atan2(direction.y, direction.x)
    return Vector.create(Math.cos(yaw) * 0.001, Math.sin(yaw) * 0.001);
}

export default {
    distance,
    directionNormalize
}