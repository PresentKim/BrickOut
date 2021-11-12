import {Bodies, Bounds, Engine, IChamferableBodyDefinition, Render, Runner, Vector} from "matter-js";
import CanvasClick from 'canvas-click-wrapper';
import {getScreenSize} from "@/utils/utils";

const BORDER_WALLS_OPTIONS: IChamferableBodyDefinition = {
    label: "border-wall",
    isStatic: true,
    render: {
        visible: false
    },
    restitution: 1,
    friction: 0,
    frictionAir: 0,
    mass: 0
};

export default abstract class Game<El extends HTMLElement> {
    public readonly engine: Engine;
    public readonly runner: Runner;
    public readonly render: Render;

    protected borderWalls = [
        Bodies.rectangle(0, 0, 0, 0, BORDER_WALLS_OPTIONS), //top
        Bodies.rectangle(0, 0, 0, 0, BORDER_WALLS_OPTIONS), //bottom
        Bodies.rectangle(0, 0, 0, 0, BORDER_WALLS_OPTIONS), //left
        Bodies.rectangle(0, 0, 0, 0, BORDER_WALLS_OPTIONS), //right
    ] as const;

    protected constructor(
            public readonly id: string,
            public readonly element: El,
            public readonly canvas: HTMLCanvasElement = document.createElement('canvas')
    ) {
        this.engine = Engine.create(this.element);
        this.runner = Runner.create()
        this.render = Render.create({
            engine: this.engine,
            element: this.element,
            canvas: this.canvas,
            options: {
                wireframes: false,
                showDebug: false,
                showSleeping: false
            }
        })

        window.onresize = this.onResize.bind(this, false);
        this.onResize(true);

        this.element.id = id;
        this.engine.gravity.scale = 0;

        this.render.context.disableImageSmoothing();

        CanvasClick.addClickListener('start', this.render.canvas, this.onClickStart.bind(this), this.render.canvas.parentElement);
        CanvasClick.addClickListener('move', this.render.canvas, this.onClickMove.bind(this), this.render.canvas.parentElement);
        CanvasClick.addClickListener('end', this.render.canvas, this.onClickEnd.bind(this), this.render.canvas.parentElement);

        this.render.run();
        this.runner.run(this.engine);
    }

    /** Fired when started click on canvas */
    public onClickStart(click: CanvasClick): void {
    }

    /** Fired when the click moves on the canvas */
    public onClickMove(click: CanvasClick): void {
    }

    /** Fired when ended click on canvas */
    public onClickEnd(click: CanvasClick): void {
    }

    public onResize(force: boolean): void {
        const {width, height} = getScreenSize();
        if (!force && this.canvas.width === width && this.canvas.height === height)
            return;

        this.canvas.width = width;
        this.canvas.height = height;

        this.render.options.width = width;
        this.render.options.height = height;

        this.borderWalls[0].setPosition(this.halfWidth, this.vh(-25));
        this.borderWalls[1].setPosition(this.halfWidth, this.vh(125));
        this.borderWalls[2].setPosition(this.vw(-25), this.halfHeight);
        this.borderWalls[3].setPosition(this.vw(125), this.halfHeight);
        this.borderWalls[0].applyRectangle(this.fullWidth, this.halfHeight);
        this.borderWalls[1].applyRectangle(this.fullWidth, this.halfHeight);
        this.borderWalls[2].applyRectangle(this.halfWidth, this.fullHeight);
        this.borderWalls[3].applyRectangle(this.halfWidth, this.fullHeight);
        this.render.bounds = Bounds.create([Vector.create(0, 0), Vector.create(width, height)]);
    }

    public vw(ratio: number) {
        return this.canvas.width * ratio / 100;
    }

    public vh(ratio: number) {
        return this.canvas.height * ratio / 100;
    }

    public vm(ratio: number) {
        return (this.vw(ratio) + this.vh(ratio)) / 2;
    }

    public get fullWidth(): number {
        return this.canvas.width;
    }

    public get fullHeight(): number {
        return this.canvas.height;
    }

    public get halfWidth(): number {
        return this.canvas.width / 2;
    }

    public get halfHeight(): number {
        return this.canvas.height / 2;
    }
}
