import {Bodies, Body, Bounds, IPair, Render, Vector} from "matter-js";
import CanvasClick from 'canvas-click-wrapper';
import Game from "@/game/Game";
import ColorHSLA from "@/utils/ColorHSLA";

const DUMMY_COUNT = 30;

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
                dummy.setMotion(this.vw(0.3));
            }
        });

        this.engine.world.add([
            this.leftSensor,
            ...this.dummies,
            ...this.borderWalls
        ]);
    }

    public onResize(force: boolean) {
        super.onResize(force);
        this.leftSensor?.setPosition(this.vw(25), this.vh(50));
        this.leftSensor?.applyRectangle(this.vw(50), this.vh(100));
    }

    public onClickStart(click: CanvasClick): void {
        if (this.touchBalls[click.identifier]) {
            this.engine.world.remove(this.touchBalls[click.identifier]);
        }
        this.touchBalls[click.identifier] = this.createDummy(this.vm(10));
        this.touchBalls[click.identifier].isStatic = true;
        this.touchBalls[click.identifier].setPosition(click.x, click.y);
        this.engine.world.add(this.touchBalls[click.identifier]);
    }

    public onClickMove(click: CanvasClick): void {
        this.touchBalls[click.identifier]?.setPosition(Vector.create(click.x, click.y));
    }

    public onClickEnd(click: CanvasClick): void {
        if (this.touchBalls[click.identifier]) {
            const dummy = this.touchBalls.splice(click.identifier, 1)[0];
            this.dummies.add(dummy);
            dummy.isStatic = false;

            const diff = 1 - this.vm(5 + Math.random() * 3) / this.vm(10);
            let times = 100;
            const func = () => {
                if (times-- <= 0)
                    return;

                dummy.scale(1 - diff / 100, 1 - diff / 100);
                setTimeout(func, 10);
            }
            func();
        }
    }

    private createDummies(): Set<Body> {
        const bodies: Set<Body> = new Set();
        for (let i = 0; i < DUMMY_COUNT; ++i) {
            bodies.add(this.createDummy(this.vm(5 + Math.random() * 3)));
        }
        return bodies;
    }

    private createDummy(size: number): Body {
        const color = new ColorHSLA(Math.random() * 360);
        return Render.cacheTexture(this.render, Bodies.polygon(
                this.vw(Math.random() * 100),
                this.vh(Math.random() * 100),
                3 + Math.random() * 3,
                size,
                {
                    label: `dummy`,
                    restitution: 1,
                    friction: 0,
                    frictionAir: 0,
                    render: {
                        fillStyle: "rgba(0,0,0,0)",
                        lineWidth: this.vm(0.7),
                        strokeStyle: new ColorHSLA(color.h, 100, 70).toString(),
                    },
                    plugin: {
                        shadow: {
                            blur: this.vm(2),
                            color: color.toString(),
                        }
                    },
                    force: Vector.mult(Vector.create(Math.random() - 0.5, Math.random() - 0.5), 1e-3)
                })
        );
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
    }
}
