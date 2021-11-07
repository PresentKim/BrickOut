import {Body, Composite, Constraint, Events, ICompositeDefinition, Vector} from 'matter-js';

declare module "matter-js" {
    interface Composite {
        /** Returns all bodies in the given composite, including all bodies in its children, recursively. */
        allBodies(): Array<Body>;

        /** Returns all composites in the given composite, including all composites in its children, recursively. */
        allComposites(): Array<Composite>;

        /** Returns all constraints in the given composite, including all constraints in its children, recursively. */
        allConstraints(): Array<Constraint>;

        /**
         * Generic add function. Adds one or many body(s), constraint(s) or a composite(s) to the given composite.
         * Triggers `beforeAdd` and `afterAdd` events on the `composite`.
         */
        add(object: Body | Composite | Constraint | Array<Body | Composite | Constraint>): void;

        /**
         * Generic remove function. Removes one or many body(s), constraint(s) or a composite(s) to the given composite.
         * Optionally searching its children recursively.
         * Triggers `beforeRemove` and `afterRemove` events on the `composite`.
         */
        remove(object: Body | Composite | Constraint, deep?: boolean): void;

        /**
         * Removes all bodies, constraints and composites from the given composite.
         * Optionally clearing its children recursively.
         */
        clear(keepStatic: boolean, deep?: boolean): void;

        /** Moves the given object(s) from composite to given composite (equal to a remove followed by an add). */
        move(objects: Array<Body | Composite | Constraint>, targetComposite: Composite): void;

        /** Assigns new ids for all objects in the composite, recursively. */
        rebase(): Composite;

        /**
         * Sets the composite's `isModified` flag.
         * If `updateParents` is true, all parents will be set (default: false).
         * If `updateChildren` is true, all children will be set (default: false).
         */
        setModified(isModified: boolean, updateParents?: boolean, updateChildren?: boolean): void;

        /** Translates all children in the composite by a given vector relative to their current positions, */
        translate(translation: Vector, recursive?: boolean): void;

        /** Rotates all children in the composite by a given angle about the given point, without imparting any angular velocity. */
        rotate(rotation: number, point: Vector, recursive?: boolean): void;

        /** Scales all children in the composite, including updating physical properties (mass, area, axes, inertia), from a world-space point. */
        scale(scaleX: number, scaleY: number, point: Vector, recursive?: boolean): void;

        /** Fired listener when a call to `Composite.add` is made, before objects have been removed. */
        onBeforeAdd(listener: (parent: Body | Constraint | Composite) => void): void;

        /** Fired listener when a call to `Composite.add` is made, after objects have been added. */
        onAfterAdd(listener: (parent: Body | Constraint | Composite) => void): void;

        /** Fired listener when a call to `Composite.remove` is made, before objects have been added. */
        onBeforeRemove(listener: (parent: Body | Constraint | Composite) => void): void;

        /** Fired listener when a call to `Composite.remove` is made, after objects have been added. */
        onAfterRemove(listener: (parent: Body | Constraint | Composite) => void): void;
    }
}

export const originCreate = Composite.create;
const props: (keyof Composite)[] = [
    "allBodies", "allComposites", "allConstraints", "rebase", "add", "remove",
    "clear", "move", "setModified", "translate", "rotate", "scale"
];

Composite.create = function (options: ICompositeDefinition = {}): Composite {
    const instance: Composite = originCreate(options);
    for (const prop of props) instance[prop as string] = Composite[prop].bind(null, instance);
    instance.onBeforeAdd = listener => Events.on(instance, "beforeAdd", e => listener(e.object));
    instance.onAfterAdd = listener => Events.on(instance, "afterAdd", e => listener(e.object));
    instance.onBeforeRemove = listener => Events.on(instance, "beforeRemove", e => listener(e.object));
    instance.onAfterAdd = listener => Events.on(instance, "afterRemove", e => listener(e.object));
    return instance;
}