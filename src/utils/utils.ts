import {Vector} from "matter-js";

export function distance(v: Vector): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function directionNormalize(direction: Vector): Vector {
    const yaw = Math.atan2(direction.y, direction.x)
    return Vector.create(Math.cos(yaw) * 0.001, Math.sin(yaw) * 0.001);
}

export function getScreenSize(): { width: number, height: number } {
    const HEIGHT = 540;
    const HEIGHT_MIN = HEIGHT * 16 / 9; //ratio 9:16 (Galaxy 4~)
    const HEIGHT_MAX = HEIGHT * 21 / 9; //ratio 9:21 (~Galaxy Fold)
    return {
        width: Math.min(HEIGHT_MAX, Math.max(HEIGHT_MIN, window.innerWidth / window.innerHeight * HEIGHT)),
        height: HEIGHT
    };
}

export default {
    distance,
    directionNormalize,
    getScreenSize
}