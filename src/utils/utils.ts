import {Body, Vector} from "matter-js";

export function distance(v: Vector): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function directionNormalize(direction: Vector): Vector {
    const yaw = Math.atan2(direction.y, direction.x)
    return Vector.create(Math.cos(yaw) * 0.001, Math.sin(yaw)* 0.001);
}

export function setBodySpeed(body: Body, speed: number, limit: number = 1e-5): void {
    const velocityDistance = distance(body.velocity);
    if (velocityDistance >= limit) {
        const normalized = directionNormalize(body.velocity);
        body.force = Vector.create(normalized.x * (speed - velocityDistance), normalized.y * (speed - velocityDistance))
    }
}

export default {
    distance,
    directionNormalize,
    setBodySpeed
}