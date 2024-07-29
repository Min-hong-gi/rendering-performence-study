export function between(a: number, b: number) {
    return (n: number) => {
        return a < n && n < b;
    }
}