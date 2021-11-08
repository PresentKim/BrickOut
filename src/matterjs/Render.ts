import {Body, IRenderDefinition, IRenderLookAtObject, Render, Vector} from 'matter-js';

declare module "matter-js" {
    namespace Render {
        function bodies(render: Render, bodies: Body[], context: CanvasRenderingContext2D): void;
    }

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

type ShadowDefinition = {
    blur: number;
    color: string;
};
const renderDefault = Render.bodies;
const renderShadow: typeof Render.bodies = (render, bodies, context) => {
    const showInternalEdges = render.options.showInternalEdges;
    for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        const globalShadow: ShadowDefinition = body.plugin.shadow;

        // handle compound parts
        for (let k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
            const part = body.parts[k];
            const partShadow: ShadowDefinition = {...globalShadow, ...part.plugin.shadow};
            if (!part.render.visible)
                continue;

            context.globalAlpha = part.render.opacity * (render.options.showSleeping && body.isSleeping ? 0.5 : 1);
            context.fillStyle = part.render.fillStyle;

            //draw parts
            context.beginPath();
            if (part.circleRadius) {
                context.arc(part.position.x, part.position.y, part.circleRadius, 0, 2 * Math.PI);
            } else {
                const vertices = part.vertices as (Vector & { isInternal: boolean })[];
                context.moveTo(vertices[0].x, vertices[0].y);

                for (let j = 1; j < vertices.length; j++) {
                    if (!vertices[j - 1].isInternal || showInternalEdges) {
                        context.lineTo(vertices[j].x, vertices[j].y);
                    } else {
                        context.moveTo(vertices[j].x, vertices[j].y);
                    }

                    if (vertices[j].isInternal && !showInternalEdges) {
                        context.moveTo(vertices[(j + 1) % vertices.length].x, vertices[(j + 1) % vertices.length].y);
                    }
                }

                context.lineTo(vertices[0].x, vertices[0].y);
            }
            context.closePath();

            if (part.render.lineWidth) {
                context.save();
                context.lineWidth = part.render.lineWidth;
                context.strokeStyle = part.render.strokeStyle;
                context.shadowBlur = partShadow.blur ?? 0;
                context.shadowColor = partShadow.color ?? "";

                context.stroke();
                context.restore();
            }

            context.fill();

            context.globalAlpha = 1;
        }
    }
};
Render.bodies = (render, bodies, context) => {
    const options = render.options;
    if (options.wireframes) {
        //pass all bodies to origin method when wireframes is true
        renderDefault(render, bodies, context);
        return;
    }

    const defaultBodies: Body[] = [];
    const shadowBodies: Body[] = [];
    for (const body of bodies) {
        if (!body.render.visible)
            continue;

        if (!body.render.sprite || !body.render.sprite.texture) {
            if (body.plugin.shadow) {
                shadowBodies.push(body);
                continue;
            } else {
                let found = false;
                for (const part of body.parts) {
                    if (part.plugin.shadow) {
                        shadowBodies.push(body);
                        found = true;
                        break;
                    }
                }
                if (found) continue;
            }
        }
        defaultBodies.push(body);
    }
    renderDefault(render, defaultBodies, context);
    renderShadow(render, shadowBodies, context);
};