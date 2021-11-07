import {IRenderDefinition, IRenderLookAtObject, Render, Vector} from 'matter-js';

declare module "matter-js" {
    interface Render {
        /** Continuously updates the render canvas on the `requestAnimationFrame` event. */
        run(): void;

        /** Ends execution of `Render.run` on the given `render`, by canceling the animation frame request event loop. */
        stop(): void;

        /** Sets the pixel ratio of the renderer and updates the canvas. To automatically detect the correct ratio, pass the string `'auto'` for `pixelRatio`. */
        setPixelRatio(pixelRatio: number | 'auto'): void;

        /** Positions and sizes the viewport around the given object bounds. */
        lookAt(objects: IRenderLookAtObject | IRenderLookAtObject[], padding?: Vector, center?: boolean): void;
    }
}

export const originCreate = Render.create;
const props: (keyof Render)[] = ["run", "stop", "setPixelRatio", "lookAt"];

Render.create = function (options?: IRenderDefinition): Render {
    const instance = originCreate(options);
    for (const prop of props) instance[prop as string] = Render[prop].bind(null, instance);
    return instance;
}