import {Bodies, Body, Engine, Render, Runner} from "matter-js";
import CanvasClick from 'canvas-click-wrapper';

export const WIDTH = 1080;
export const HEIGHT = 720;

export default abstract class Game<El extends HTMLElement> {
    public readonly engine: Engine;
    public readonly runner: Runner;
    public readonly render: Render;

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
                width: WIDTH,
                height: HEIGHT,

                wireframes: false,
                showDebug: false,
                showSleeping: false
            }
        })

        this.element.id = id;
        this.engine.gravity.scale = 0;

        /**
         * Disable smoothing feature of canvas context for use a clear dot image
         * @url https://github.com/niklasvh/html2canvas/issues/576#issuecomment-316739410
         */
        (this.render.context as any).imageSmoothingEnabled = false; //standard
        (this.render.context as any).mozImageSmoothingEnabled = false; //Firefox
        (this.render.context as any).oImageSmoothingEnabled = false; //Opera
        (this.render.context as any).webkitImageSmoothingEnabled = false; //Safari
        (this.render.context as any).msImageSmoothingEnabled = false; //IE

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

    public vw(ratio: number) {
        return this.render.canvas.width * ratio / 100;
    }

    public vh(ratio: number) {
        return this.render.canvas.height * ratio / 100;
    }

    public vm(ratio: number) {
        return (this.vw(ratio) + this.vh(ratio)) / 2;
    }


    protected createBorderWalls(): Array<Body> {
        const option = {
            label: "border-wall",
            ...{isStatic: true, render: {visible: false}},
            restitution: 1,
            friction: 0,
            frictionAir: 0,
            mass: 0,
        };

        return [
            Bodies.rectangle(this.vw(50), this.vh(-25), this.vw(100), this.vh(50), option), //top
            Bodies.rectangle(this.vw(50), this.vh(125), this.vw(100), this.vh(50), option), //bottom
            Bodies.rectangle(this.vw(-25), this.vh(50), this.vw(50), this.vh(100), option), //left
            Bodies.rectangle(this.vw(125), this.vh(50), this.vw(50), this.vh(100), option), //right
        ];
    }
}
