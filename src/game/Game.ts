import {Engine, Render, Runner} from "matter-js";
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

        CanvasClick.addClickListener('start', this.render.canvas, this.onClickStart.bind(this));
        CanvasClick.addClickListener('move', this.render.canvas, this.onClickMove.bind(this));
        CanvasClick.addClickListener('end', this.render.canvas, this.onClickEnd.bind(this));

        Render.run(this.render);
        Runner.run(this.runner, this.engine);
    }

    public onClickStart(click: CanvasClick): void {
    }

    public onClickMove(click: CanvasClick): void {
    }

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
}
