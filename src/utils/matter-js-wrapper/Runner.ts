import {Engine, IRunnerOptions, Runner} from 'matter-js';

declare module "matter-js" {
    interface Runner {
        /** Continuously ticks a `Matter.Engine` by calling `Runner.tick` on the `requestAnimationFrame` event. */
        run(engine: Engine): void;

        /** Alias for `Runner.run` */
        start(engine: Engine): void;

        /**
         * Ends execution of `Runner.run` on the given `runner`, by canceling the animation frame request event loop.
         * If you wish to only temporarily pause the engine, see `engine.enabled` instead.
         */
        stop(): void;

        /**
         * A game loop utility that updates the engine and renderer by one step (a 'tick').
         * Features delta smoothing, time correction and fixed or dynamic timing.
         * Triggers `beforeTick`, `tick` and `afterTick` events on the engine.
         * Consider just `Engine.update(engine, delta)` if you're using your own loop.
         */
        tick(engine: Engine, time: number): void;
    }
}

const create = Runner.create;
const props: (keyof Runner)[] = ["run", "stop", "tick"];

Runner.create = function (options?: IRunnerOptions): Runner {
    const instance = create(options);
    for (const prop of props) instance[prop as string] = Runner[prop].bind(null, instance);
    return instance;
}