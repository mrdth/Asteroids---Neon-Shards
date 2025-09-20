export class ObjectPool<T> {
  private pool: T[] = [];
  private readonly createFn: () => T;
  private readonly resetFn: (obj: T) => void;
  private readonly activeFn?: (obj: T) => void;

  constructor(
    createFn: () => T,
    resetFn: (obj: T) => void,
    activeFn?: (obj: T) => void,
    initialSize = 10
  ) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.activeFn = activeFn;

    for (let i = 0; i < initialSize; i++) {
      const obj = this.createFn();
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }

  get(): T {
    const obj = this.pool.length > 0 ? this.pool.pop()! : this.createFn();

    if (this.activeFn) {
      this.activeFn(obj);
    }

    return obj;
  }

  return(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }

  getPoolSize(): number {
    return this.pool.length;
  }

  clear(): void {
    this.pool.length = 0;
  }
}
