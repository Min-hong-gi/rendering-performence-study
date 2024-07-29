export class Vector2D {
    static zero() {
        return new Vector2D(0, 0);
    }

    #x: number;
    #y: number;

    constructor(x: number, y: number) {
        this.#x = x;
        this.#y = y;
    }
    get x() {
        return this.#x;
    }
    set x(x: number) {
        this.#x = x;
    }
    get y() {
        return this.#y;
    }
    set y(y: number) {
        this.#y = y;
    }
    get size() {
        return Math.sqrt(this.#x ** 2 + this.#y ** 2);
    }
    add(vector: Vector2D): Vector2D;
    add(x: number, y: number): Vector2D;
    add(vector: number | Vector2D, y?: number): this {
        if (isVector2D(vector)) {
            this.#x += vector.#x;
            this.#y += vector.#y;
        } else if (typeof y === 'number') {
            this.#x += vector;
            this.#y += y;
        }
        return this;
    }
    sub(vector: Vector2D): Vector2D;
    sub(x: number, y: number): Vector2D;
    sub(vector: number | Vector2D, y?: number): this {
        if (isVector2D(vector)) {
            this.#x -= vector.#x;
            this.#y -= vector.#y;
        } else if (typeof y === 'number') {
            this.#x -= vector;
            this.#y -= y;
        }
        return this;
    }
    mul(vector: Vector2D): Vector2D;
    mul(val: number): Vector2D;
    mul(x: number, y: number): Vector2D;
    mul(val: number | Vector2D, y?: number) {
        if (isVector2D(val)) {
            this.#x *= val.x;
            this.#y *= val.y;
        } else {
            this.#x *= val;
            if (typeof y === 'number') {
                this.#y *= y;
            } else {
                this.#y *= val;
            }
        }
        return this;
    }
    avg(vector: Vector2D): Vector2D;
    avg(x: number): Vector2D;
    avg(x: number, y: number): Vector2D;
    avg(val: number | Vector2D, y?: number) {
        if (isVector2D(val)) {
            this.#x /= val.x;
            this.#y /= val.y;
        } else {
            this.#x /= val;
            if (typeof y === 'number') {
                this.#y /= y;
            } else {
                this.#y /= val;
            }
        }
        return this;
    }
    normalize(n: number) {
        const size = this.size;
        if (size === 0) {
            return this;
        }
        this.#x /= size;
        this.#y /= size;

        this.#x *= n;
        this.#y *= n;
        return this;
    }

    clone() {
        return new Vector2D(this.#x, this.#y);
    }
}

function isVector2D(val: any): val is Vector2D {
    if (val && val instanceof Vector2D) {
        return true;
    }
    return false;
}
