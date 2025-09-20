export class ObjectPool<T> {
    private pool: T[] = [];
    private createFn: () => T;
    private resetFn: (obj: T) => void;
    private activeFn?: (obj: T) => void;

    constructor(
        createFn: () => T,
        resetFn: (obj: T) => void,
        activeFn?: (obj: T) => void,
        initialSize: number = 10
    ) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.activeFn = activeFn;

        // Pre-populate pool with initial objects
        for (let i = 0; i < initialSize; i++) {
            const obj = this.createFn();
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }

    public get(): T {
        let obj: T;

        if (this.pool.length > 0) {
            obj = this.pool.pop()!;
        } else {
            obj = this.createFn();
        }

        if (this.activeFn) {
            this.activeFn(obj);
        }

        return obj;
    }

    public return(obj: T): void {
        this.resetFn(obj);
        this.pool.push(obj);
    }

    public getPoolSize(): number {
        return this.pool.length;
    }

    public clear(): void {
        this.pool.length = 0;
    }
}