import {Engine, Events, IEngineDefinition, IPair} from 'matter-js';

declare module "matter-js" {
    interface Engine {
        /** Clears the engine including the world, pairs and broad phase. */
        clear(): void

        /** Merges engine by keeping the configuration of this, but replacing the world with the one from given engine. */
        merge(engine: Engine): void

        /**
         * Moves the simulation forward in time by `delta` ms.
         * The `correction` argument is an optional `Number` that specifies the time correction factor to apply to the update.
         * This can help improve the accuracy of the simulation in cases where `delta` is changing between updates.
         * The value of `correction` is defined as `delta / lastDelta`, i.e. the percentage change of `delta` over the last step.
         * Therefore the value is always `1` (no correction) when `delta` constant (or when no correction is desired, which is the default).
         * See the paper on <a href="http://lonesock.net/article/verlet.html">Time Corrected Verlet</a> for more information.
         *
         * Triggers `beforeUpdate` and `afterUpdate` events.
         * Triggers `collisionStart`, `collisionActive` and `collisionEnd` events.
         */
        update(delta?: number, correction?: number): void

        /** Fired listener just before an update */
        onBeforeUpdate(listener: (timestamp: number) => any): void

        /** Fired listener after engine update and all collision events */
        onAfterUpdate(listener: (timestamp: number) => any): void

        /** Fired listener after engine update, provides a list of all pairs that have started to collide in the current tick (if any) */
        onCollisionStart(listener: (pairs: Array<IPair>, timestamp: number) => any): void

        /** Fired listener after engine update, provides a list of all pairs that are colliding in the current tick (if any) */
        onCollisionActive(listener: (pairs: Array<IPair>, timestamp: number) => any): void

        /** Fired listener after engine update, provides a list of all pairs that have ended collision in the current tick (if any) */
        onCollisionEnd(listener: (pairs: Array<IPair>, timestamp: number) => any): void
    }
}

const create = Engine.create;
const props: (keyof Engine)[] = ["clear", "merge", "update"];

Engine.create = function (element?: HTMLElement | IEngineDefinition, options?: IEngineDefinition): Engine {
    const instance: Engine = create(element, options);
    for (const prop of props) instance[prop as string] = Engine[prop].bind(null, instance);
    instance.onBeforeUpdate = listener => Events.on(instance, "beforeUpdate", event => listener(event.timestamp));
    instance.onAfterUpdate = listener => Events.on(instance, "afterUpdate", event => listener(event.timestamp));
    instance.onCollisionStart = listener => Events.on(instance, "collisionStart", event => listener(event.pairs, event.timestamp));
    instance.onCollisionActive = listener => Events.on(instance, "collisionActive", event => listener(event.pairs, event.timestamp));
    instance.onCollisionEnd = listener => Events.on(instance, "collisionEnd", event => listener(event.pairs, event.timestamp));
    return instance;
}