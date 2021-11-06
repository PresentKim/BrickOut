import {Bodies, Body, Bounds, Composite, Engine, Events, IEventCollision, Vector} from "matter-js";
import CanvasClick from 'canvas-click-wrapper';
import Game from "@/game/Game";
import utils from "@/utils/utils";
import ColorHSLA from "@/utils/ColorHSLA";

const INVISIBLE = {visible: false};
const STATIC_INVISIBLE = {isStatic: true, render: INVISIBLE};

const DUMMY_COUNT = 100;

export default class TestGame extends Game<HTMLDivElement> {
    private readonly borders: Set<Body> = this.createBorderWalls();
    private readonly dummies: Set<Body> = this.createDummies();
    private readonly touchBalls: Array<Body> = [];

    public constructor() {
        super("matter-js-test", document.createElement("div"));
        this.engine.gravity.scale = 0;
        this.render.options.showDebug = true;

        const leftSensor = Bodies.rectangle(this.vw(25), this.vh(50), this.vw(50), this.vh(100), {
            isSensor: true,
            isStatic: true,
            render: {
                visible: false
            }
        });
        const getCollidedDummies: (e: IEventCollision<Engine>) => Array<Body> = event => {
            const collidedDummies: Array<Body> = [];
            for (const pair of event.pairs) {
                if (pair.bodyA === leftSensor && this.dummies.has(pair.bodyB)) {
                    collidedDummies.push(pair.bodyB);
                } else if (pair.bodyB === leftSensor && this.dummies.has(pair.bodyA)) {
                    collidedDummies.push(pair.bodyA);
                }
            }
            return collidedDummies;
        };
        Events.on(this.engine, 'collisionStart', event => getCollidedDummies(event).forEach(dummy => dummy.render.opacity = 0.5));
        Events.on(this.engine, 'collisionEnd', event => getCollidedDummies(event).forEach(dummy => dummy.render.opacity = 1.0));
        Events.on(this.engine, 'beforeUpdate', () => {
            for (let dummy of this.dummies) {
                if (!Bounds.overlaps(this.render.bounds, dummy.bounds)) {
                    Body.translate(dummy, Vector.create(this.vw(50) - dummy.position.x, this.vh(50) - dummy.position.y))
                }
                const velocityDistance = utils.distance(dummy.velocity);
                if (velocityDistance >= 1e-5) {
                    const normalized = utils.directionNormalize(dummy.velocity);
                    dummy.force = Vector.create(normalized.x * (this.vw(0.3) - velocityDistance), normalized.y * (this.vh(0.3) - velocityDistance))
                }
            }
        });

        Composite.add(this.engine.world, [
            leftSensor,
            ...this.borders,
            ...this.dummies
        ]);
    }

    public onClickStart(click: CanvasClick): void {
        if (this.touchBalls[click.identifier]) {
            Composite.remove(this.engine.world, this.touchBalls[click.identifier]);
        }
        this.touchBalls[click.identifier] = Bodies.circle(click.x, click.y, this.vw(7), {
            isStatic: true,
            render: {
                fillStyle: new ColorHSLA(click.identifier * 30).toString()
            }
        });
        Composite.add(this.engine.world, this.touchBalls[click.identifier]);
    }

    public onClickMove(click: CanvasClick): void {
        const ball = this.touchBalls[click.identifier];
        if (ball) {
            Body.setPosition(ball, {x: click.x, y: click.y});
        }
    }

    public onClickEnd(click: CanvasClick): void {
        if (this.touchBalls[click.identifier]) {
            Composite.remove(this.engine.world, this.touchBalls[click.identifier]);
            delete this.touchBalls[click.identifier];
        }
    }

    private createBorderWalls(): Set<Body> {
        const option = {
            label: "border-wall",
            ...STATIC_INVISIBLE,
            restitution: 1,
            friction: 0,
            frictionAir: 0,
            mass: 0,
        };

        return new Set([
            Bodies.rectangle(this.vw(50), this.vh(-25), this.vw(100), this.vh(50), option), //top
            Bodies.rectangle(this.vw(50), this.vh(125), this.vw(100), this.vh(50), option), //bottom
            Bodies.rectangle(this.vw(-25), this.vh(50), this.vw(50), this.vh(100), option), //left
            Bodies.rectangle(this.vw(125), this.vh(50), this.vw(50), this.vh(100), option), //right
        ]);
    }

    private createDummies(): Set<Body> {
        const bodies: Set<Body> = new Set();
        for (let i = 0; i < DUMMY_COUNT; ++i) {
            let size = this.vm(5 + Math.random() * 6);
            bodies.add(Bodies.rectangle(
                    this.vw(Math.random() * 100),
                    this.vh(Math.random() * 100),
                    size,
                    size,
                    {
                        label: `dummy-${i}`,
                        restitution: 1,
                        friction: 0,
                        frictionAir: 0,
                        render: {
                            fillStyle: "white",
                            sprite: {
                                texture: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAoElEQVQ4jWNkgAJFeYP/DBSA+w8vMDIwMDCwwAw7rC1FiXkMtgwM/+8/vMDISA3D4IZefQZxITYgvXUrXs1Pvb2ximMYSMggdHXoBjMRpZsEgGIgsa7DpwenC596e2MNJ1ziBA1ENgAbm2wDSQVUN5CkdEhMpNHWy+iBjiuW8fEHf6RQvbRhgjGoYRgDA9SFFJuGBBgZGCgv/mHg/sMLjAD7BDkUM4L9HwAAAABJRU5ErkJggg==",
                                xScale: size / 20,
                                yScale: size / 20
                            }
                        },
                        force: Vector.mult(Vector.create(Math.random() - 0.5, Math.random() - 0.5), 1e-3)
                    }));
        }
        return bodies;
    }
}
