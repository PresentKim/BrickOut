import {Vector, Vertices} from 'matter-js';

declare module "matter-js" {
    namespace Vertices {
        function fromSize(width: number, height: number): Vector[];
    }
}
Vertices.fromSize = (width, height) => {
    return [
        Vector.create(0, 0),
        Vector.create(width, 0),
        Vector.create(width, height),
        Vector.create(0, height)
    ];
};