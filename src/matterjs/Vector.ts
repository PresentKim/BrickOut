import {Vector} from 'matter-js';

declare module "matter-js" {
    interface Vector {
        /** Returns a new vector with `x` and `y` copied from the given `vector`. */
        clone(): Vector;

        /** Adds the two vectors. */
        add(vec: Vector): Vector;

        /** Returns the angle in radians between the two vectors relative to the x-axis. */
        angle(vec: Vector): number;

        /** Returns the cross-product of two vectors. */
        cross(vec: Vector): number;

        /** Divides a vector and a scalar. */
        div(scalar: number): Vector;

        /** Returns the dot-product of two vectors. */
        dot(vec: Vector): number;

        /** Returns the magnitude (length) of a vector. */
        magnitude(): number;

        /** Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation). */
        magnitudeSquared(): number;

        /** Multiplies a vector and a scalar. */
        mult(scalar: number): Vector;

        /** Negates both components of a vector such that it points in the opposite direction. */
        neg(): Vector;

        /** Normalises a vector (such that its magnitude is `1`). */
        normalise(): Vector;

        /** Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction. */
        perp(negate?: boolean): Vector;

        /** Rotates the vector about (0, 0) by specified angle. */
        rotate(angle: number): Vector;

        /** Rotates the vector about a specified point by specified angle. */
        rotateAbout(angle: number, point: Vector): Vector;

        /** Subtracts the two vectors. */
        sub(vec: Vector): Vector;
    }
}

export const originCreate = Vector.create;
const props: (keyof Vector)[] = [
    "clone", "add", "angle", "cross", "div", "dot",
    "magnitude", "magnitudeSquared", "mult", "neg",
    "normalise", "perp", "rotate", "rotateAbout", "sub"
];

function bindVector(vec: Vector): Vector {
    for (const prop of props) {
        vec[prop as string] = function (...args: any[]): Vector {
            return bindVector(Vector[prop](vec, ...args) as Vector);
        }
    }
    return vec;
}

Vector.create = function (x: number = 0, y: number = 0): Vector {
    return bindVector(originCreate(x, y));
}