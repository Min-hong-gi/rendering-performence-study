import { Vector2D } from "../util/vector2D.js";

export class Entity {
    #color: string;
    public acceleration: Vector2D;
    public position: Vector2D;
    public velocity: Vector2D;
    constructor({
        acceleration,
        position,
        velocity,
        color,
    }: Partial<Entity> & {color: string}) {
        this.acceleration = acceleration ?? Vector2D.zero();
        this.position = position ?? Vector2D.zero();
        this.velocity = velocity ?? Vector2D.zero();
        this.#color = color ?? '#000';
    }

    get color() {
        return this.#color;
    }
    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }
}
