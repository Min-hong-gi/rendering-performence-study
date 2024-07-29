export function CanvasManagerFactory(selector: string) {
    /**
     * @type { HTMLCanvasElement }
     */
    const canvas = document.querySelector(selector) as HTMLCanvasElement;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let vw = canvas.width;
    let vh = canvas.height;

    return {
        get vw( ){
            return vw;
        },
        get vh( ){
            return vh;
        },
        resize() {
            canvas.width = canvas.clientWidth * 4;
            canvas.height = canvas.clientHeight * 4;

            vw = canvas.width;
            vh = canvas.height;
        },
        draw<T>(fn: (ctx: CanvasRenderingContext2D, vw: number, vh: number) => T): T {
            return fn(ctx, vw, vh);
        }
    }
}

export type CanvasManager = ReturnType<typeof CanvasManagerFactory>;