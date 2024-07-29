import { CanvasManager } from "../manager/canvas.manager.js";
import { Vector2D } from "../util/vector2D.js";
import { Entity } from "./entity.core.js";

export class GravityEntity {
    #canvasManager: CanvasManager;
    #position: Vector2D;
    r: number;
    pow: number;

    constructor(position: Vector2D, r: number, pow: number, canvasManager: CanvasManager) {
        this.#position = position;
        this.r = r;
        this.pow = pow;
        this.#canvasManager = canvasManager;
    }
    draw(time: number) {
        this.#canvasManager.draw((ctx, vw, vh) => {
            const { x, y } = this.#position;

            ctx.beginPath();
            ctx.setLineDash([10, 15])
            ctx.lineDashOffset = Math.floor(time / -20);
            ctx.strokeStyle = '#f00';
            ctx.lineWidth = vw/500;
            ctx.arc(x, y, this.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = '#000';
            ctx.arc(x, y, this.pow, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        });
    }
    effect(entity: Entity) {
        const { position, velocity } = entity;
        const speed = velocity.size;
        const range = this.position.clone().sub(position);

        velocity.add(range.mul(this.pow / 1000)).normalize(speed);
    }

    get position() {
        return this.#position;
    }
}