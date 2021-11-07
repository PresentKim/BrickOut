import {Bounds, Vector, Vertices} from 'matter-js';

declare module "matter-js" {
    interface Bounds {
        /** Updates bounds using the given vertices and extends the bounds given a velocity. */
        update(vertices: Vertices, velocity: Vector): void;

        /** Translates the bounds by the given vector. */
        translate(vector: Vector): void;

        /** Shifts the bounds to the given position. */
        shift(position: Vector): void;

        /** Returns true if the bounds contains the given point. */
        contains(point: Vector): boolean;

        /** Returns true if the two bounds intersect. */
        overlaps(targetBounds: Bounds): boolean;
    }
}

const create = Bounds.create;
const props: (keyof Bounds)[] = ["contains", "overlaps", "update", "translate", "shift"];

Bounds.create = function (vertices: Vertices): Bounds {
    const instance: Bounds = create(vertices);
    for (const prop of props) instance[prop] = Bounds[prop].bind(null, instance);
    return instance;
}