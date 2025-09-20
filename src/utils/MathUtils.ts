export class MathUtils {
  /**
   * Convert degrees to radians
   */
  static degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convert radians to degrees
   */
  static radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  /**
   * Calculate thrust vector based on rotation angle
   * @param rotation - Rotation in radians
   * @param thrust - Thrust magnitude
   * @returns Object with x and y components
   */
  static getThrustVector(rotation: number, thrust: number): { x: number; y: number } {
    return {
      x: Math.cos(rotation) * thrust,
      y: Math.sin(rotation) * thrust,
    };
  }

  /**
   * Clamp a value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Calculate the magnitude of a vector
   */
  static magnitude(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
  }

  /**
   * Normalize a vector to unit length
   */
  static normalize(x: number, y: number): { x: number; y: number } {
    const mag = this.magnitude(x, y);
    if (mag === 0) {
      return { x: 0, y: 0 };
    }
    return { x: x / mag, y: y / mag };
  }

  /**
   * Generate a random float between min and max (inclusive)
   */
  static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Generate a random integer between min and max (inclusive)
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Calculate distance between two points
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    return this.magnitude(x2 - x1, y2 - y1);
  }
}
