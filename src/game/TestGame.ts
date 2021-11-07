import {Bodies, Body, Bounds, IPair, Vector} from "matter-js";
import CanvasClick from 'canvas-click-wrapper';
import Game from "@/game/Game";
import {setBodySpeed} from "@/utils/utils";
import ColorHSLA from "@/utils/ColorHSLA";

const DUMMY_COUNT = 100;

export default class TestGame extends Game<HTMLDivElement> {
    private readonly dummies: Set<Body> = this.createDummies();
    private readonly leftSensor: Body = Bodies.rectangle(this.vw(25), this.vh(50), this.vw(50), this.vh(100), {
        isSensor: true,
        isStatic: true,
        render: {
            visible: false
        }
    });
    private readonly touchBalls: Array<Body> = [];

    public constructor() {
        super("matter-js-test", document.createElement("div"));
        this.engine.gravity.scale = 0;
        this.render.options.showDebug = true;

        this.engine.onCollisionStart(pairs => this.getCollidedDummies(pairs).forEach(dummy => dummy.render.opacity = 0.5));
        this.engine.onCollisionEnd(pairs => this.getCollidedDummies(pairs).forEach(dummy => dummy.render.opacity = 1.0));
        this.engine.onBeforeUpdate(() => {
            for (let dummy of this.dummies) {
                if (!Bounds.overlaps(this.render.bounds, dummy.bounds)) {
                    Body.translate(dummy, Vector.create(this.vw(50) - dummy.position.x, this.vh(50) - dummy.position.y))
                }
            }
        });
        this.engine.onBeforeUpdate(() => {
            this.dummies.forEach(dummy => setBodySpeed(dummy, this.vw(0.3)));
        });

        this.engine.world.add([
            this.leftSensor,
            ...this.dummies,
            ...this.createBorderWalls()
        ]);
    }

    public onClickStart(click: CanvasClick): void {
        if (this.touchBalls[click.identifier]) {
            this.engine.world.remove(this.touchBalls[click.identifier]);
        }
        this.touchBalls[click.identifier] = Bodies.circle(click.x, click.y, this.vw(7), {
            isStatic: true,
            render: {
                fillStyle: new ColorHSLA(click.identifier * 30).toString()
            }
        });
        this.engine.world.add(this.touchBalls[click.identifier]);
    }

    public onClickMove(click: CanvasClick): void {
        this.touchBalls[click.identifier]?.setPosition(Vector.create(click.x, click.y));
    }

    public onClickEnd(click: CanvasClick): void {
        if (this.touchBalls[click.identifier]) {
            this.engine.world.remove(this.touchBalls[click.identifier]);
            this.touchBalls.splice(click.identifier, 1);
        }
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

    private getCollidedDummies(pairs: Array<IPair>): Array<Body> {
        const collidedDummies: Array<Body> = [];
        for (const pair of pairs) {
            if (pair.bodyA === this.leftSensor && this.dummies.has(pair.bodyB)) {
                collidedDummies.push(pair.bodyB);
            } else if (pair.bodyB === this.leftSensor && this.dummies.has(pair.bodyA)) {
                collidedDummies.push(pair.bodyA);
            }
        }
        return collidedDummies;
    };
}
