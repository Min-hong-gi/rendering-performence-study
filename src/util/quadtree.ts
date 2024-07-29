export class QuadTree<T extends { x: number, y: number }> {
    #w: number;
    #h: number;
    x: number;
    y: number;
    #childNode: Array<QuadTree<T>> = [];
    items: Array<T> = [];
    #split: number;

    constructor({ w, h, x = w / 2, y = h / 2, split = 10 }: { w: number, h: number, x?: number, y?: number, split?: number }) {
        if (split < 2) {
            throw Error(`split ${split} is out of range.\nrnage: 2~`);
        }

        this.#w = w;
        this.#h = h;
        this.x = x;
        this.y = y;
        this.#split = split;
    }
    add(item: T | Array<T>) {
        if (Array.isArray(item)) {
            for (const el of item) {
                this.add(el);
            }
            return;
        }
        if (this.#childNode.length) {
            const quadrant = +(this.x < item.x) + +(this.y < item.y) * 2;
            this.#childNode[quadrant].add(item);
        } else {
            this.items.push(item);

            if (this.items.length > this.#split) {
                this.#childNode.push(new QuadTree<T>({
                    w: this.#w / 2,
                    h: this.#h / 2,
                    x: this.x - (this.#w / 4),
                    y: this.y - (this.#h / 4),
                    split: this.#split,
                }));
                this.#childNode.push(new QuadTree<T>({
                    w: this.#w / 2,
                    h: this.#h / 2,
                    x: this.x + (this.#w / 4),
                    y: this.y - (this.#h / 4),
                    split: this.#split,
                }));
                this.#childNode.push(new QuadTree<T>({
                    w: this.#w / 2,
                    h: this.#h / 2,
                    x: this.x - (this.#w / 4),
                    y: this.y + (this.#h / 4),
                    split: this.#split,
                }));
                this.#childNode.push(new QuadTree<T>({
                    w: this.#w / 2,
                    h: this.#h / 2,
                    x: this.x + (this.#w / 4),
                    y: this.y + (this.#h / 4),
                    split: this.#split,
                }));

                this.add(this.items.splice(0, this.items.length));
            }
        }

    }
    clear() {
        this.items = [];
        this.#childNode = [];
    }
    get(x: number, y: number): Array<T> {
        const quadrant = +(this.x < x) + +(this.y < y) * 2;
        if (this.#childNode.length) {
            return this.#childNode[quadrant].get(x, y);
        }
        return this.items;
    }
    fullItems(): Array<T> {
        if (this.#childNode.length) {
            return this.#childNode.reduce((p, x) => {
                return p.concat(x.fullItems())
            }, [] as Array<T>);
        }
        return this.items;
    }
    draw(ctx: CanvasRenderingContext2D, color = '#0000') {
        ctx.beginPath();
        ctx.rect(this.x - (this.#w / 2), this.y - (this.#h / 2), this.#w, this.#h);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.setLineDash([0])
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

        this.#childNode.forEach((x, i) => {
            x.draw(ctx);
        })
    }
}
