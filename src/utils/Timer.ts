export class Timer {
  private static getHighResTimestamp(): number {
    if (typeof performance !== "undefined" && performance.now) {
      return performance.now();
    }
    return Date.now();
  }

  public static hasElapsed(lastTime: number, intervalMs: number): boolean {
    return this.getHighResTimestamp() - lastTime >= intervalMs;
  }

  public static getElapsedMs(startTime: number): number {
    return this.getHighResTimestamp() - startTime;
  }

  public static now(): number {
    return this.getHighResTimestamp();
  }
}
