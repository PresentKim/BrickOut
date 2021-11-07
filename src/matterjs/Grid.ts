import {Body, Engine, Grid, IGridDefinition} from 'matter-js';

declare module "matter-js" {
    interface Grid {
        /** Updates the grid. */
        update(bodies: Array<Body>, engine: Engine, forceUpdate: boolean): void;

        /** Clears the grid. */
        clear(): void;
    }
}

export const originCreate = Grid.create;
const props: (keyof Grid)[] = ["update", "clear"];

Grid.create = function (options?: IGridDefinition): Grid {
    const instance = originCreate(options);
    for (const prop of props) instance[prop as string] = Grid[prop].bind(null, instance);
    return instance;
}