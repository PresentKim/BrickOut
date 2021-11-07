import {Bodies, Body, Events, IBodyDefinition, Vector} from 'matter-js';

declare module 'matter-js' {
    interface Body {
        /** Applies a force to a body from a given world-space position, including resulting torque. */
        applyForce(position: Vector, force: Vector): void;

        /** Rotates a body by a given angle relative to its current angle, without imparting any angular velocity. */
        rotate(rotation: number): void;

        /** Sets the mass of the body. Inverse mass and density are automatically updated to reflect the change. */
        setMass(mass: number): void;

        /** Sets the density of the body. Mass is automatically updated to reflect the change. */
        setDensity(density: number): void;

        /**
         * Sets the moment of inertia (i.e. second moment of area) of the body of the body.
         * Inverse inertia is automatically updated to reflect the change. Mass is not changed.
         */
        setInertia(inertia: number): void;

        /**
         * Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
         * Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
         * They are then automatically translated to world space based on `body.position`.
         *
         * The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
         * Vertices must form a convex hull, concave hulls are not supported.
         */
        setVertices(vertices: Array<Vector>): void;

        /**
         * Sets the parts of the `body` and updates mass, inertia and centroid.
         * Each part will have its parent set to `body`.
         * By default the convex hull will be automatically computed and set on `body`, unless `autoHull` is set to `false.`
         * Note that this method will ensure that the first part in `body.parts` will always be the `body`.
         */
        setParts(parts: Body[], autoHull?: boolean): void;

        /**
         * Set the centre of mass of the body.
         * The `centre` is a vector in world-space unless `relative` is set, in which case it is a translation.
         * The centre of mass is the point the body rotates about and can be used to simulate non-uniform density.
         * This is equal to moving `body.position` but not the `body.vertices`.
         * Invalid if the `centre` falls outside the body's convex hull.
         */
        setCentre(centre: Vector, relative?: boolean): void;

        /** Sets the position of the body instantly. Velocity, angle, force etc. are unchanged. */
        setPosition(position: Vector): void;

        setPosition(x: number, y: number): void;

        /** Sets the angle of the body instantly. Angular velocity, position, force etc. are unchanged. */
        setAngle(angle: number): void;

        /** Sets the linear velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`. */
        setVelocity(velocity: Vector): void;

        /** Sets the angular velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`. */
        setAngularVelocity(velocity: number): void;

        /** Sets the body as , including isStatic flag and setting mass and inertia to Infinity. */
        setStatic(isStatic: boolean): void;

        /** Scales the body, including updating physical properties (mass, area, axes, inertia), from a world-space point (default is body centre). */
        scale(scaleX: number, scaleY: number, point?: Vector): void;

        /** Moves a body by a given vector relative to its current position, without imparting any velocity. */
        translate(translation: Vector): void;

        /** Fired listener when body started sleep */
        onSleepStart(listener: (body: this) => void): void;

        /** Fired listener when body ended sleep */
        onSleepEnd(listener: (body: this) => void): void;

        /** Set rigid body model with a circle hull. */
        applyCircle(radius: number, maxSides?: number): void;

        /** Set rigid body model with a regular polygon hull with the given number of sides. */
        applyPolygon(sides: number, radius: number): void;

        /** Set rigid body model with a rectangle hull. */
        applyRectangle(width: number, height: number): void;

        /** Set a new rigid body model with a trapezoid hull. */
        applyTrapezoid(width: number, height: number, slope: number): void;
    }
}

export const originCreate = Body.create;
const props: (keyof Body)[] = [
    "applyForce", "rotate", "setMass", "setDensity", "setInertia",
    "setVertices", "setParts", "setCentre", "setAngle",
    "setVelocity", "setAngularVelocity", "setStatic", "scale", "translate"
];

Body.create = function (options: IBodyDefinition): Body {
    const instance: Body = originCreate(options);
    for (const prop of props) instance[prop as string] = Body[prop].bind(null, instance);
    instance.onSleepStart = listener => Events.on(instance, "sleepStart", listener.bind(null, instance));
    instance.onSleepEnd = listener => Events.on(instance, "sleepEnd", listener.bind(null, instance));
    instance.setPosition = function (vec: Vector | number, y?: number) {
        if (typeof vec === "number") vec = Vector.create(vec, y);
        Body.setPosition(instance, vec);
    };
    instance.applyCircle = (radius: number, maxSides?: number) => instance.setVertices(Bodies.circle(0, 0, radius, null, maxSides).vertices);
    instance.applyPolygon = (sides: number, radius: number) => instance.setVertices(Bodies.polygon(0, 0, radius, null).vertices);
    instance.applyRectangle = (width: number, height: number) => instance.setVertices(Bodies.rectangle(0, 0, width, height).vertices);
    instance.applyTrapezoid = (width: number, height: number, slope: number) => instance.setVertices(Bodies.trapezoid(0, 0, width, height, slope).vertices);
    return instance;
};