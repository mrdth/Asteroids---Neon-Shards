import { describe, it, expect } from "vitest";
import { MathUtils } from "../../src/utils/MathUtils";

describe("MathUtils", () => {
  describe("degreesToRadians", () => {
    it("should convert 0 degrees to 0 radians", () => {
      expect(MathUtils.degreesToRadians(0)).toBe(0);
    });

    it("should convert 90 degrees to π/2 radians", () => {
      expect(MathUtils.degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 5);
    });

    it("should convert 180 degrees to π radians", () => {
      expect(MathUtils.degreesToRadians(180)).toBeCloseTo(Math.PI, 5);
    });

    it("should convert 360 degrees to 2π radians", () => {
      expect(MathUtils.degreesToRadians(360)).toBeCloseTo(2 * Math.PI, 5);
    });
  });

  describe("radiansToDegrees", () => {
    it("should convert 0 radians to 0 degrees", () => {
      expect(MathUtils.radiansToDegrees(0)).toBe(0);
    });

    it("should convert π/2 radians to 90 degrees", () => {
      expect(MathUtils.radiansToDegrees(Math.PI / 2)).toBeCloseTo(90, 5);
    });

    it("should convert π radians to 180 degrees", () => {
      expect(MathUtils.radiansToDegrees(Math.PI)).toBeCloseTo(180, 5);
    });

    it("should convert 2π radians to 360 degrees", () => {
      expect(MathUtils.radiansToDegrees(2 * Math.PI)).toBeCloseTo(360, 5);
    });
  });

  describe("getThrustVector", () => {
    it("should return correct vector for 0 radians (pointing right)", () => {
      const vector = MathUtils.getThrustVector(0, 100);
      expect(vector.x).toBeCloseTo(100, 5);
      expect(vector.y).toBeCloseTo(0, 5);
    });

    it("should return correct vector for π/2 radians (pointing down)", () => {
      const vector = MathUtils.getThrustVector(Math.PI / 2, 100);
      expect(vector.x).toBeCloseTo(0, 5);
      expect(vector.y).toBeCloseTo(100, 5);
    });

    it("should return correct vector for π radians (pointing left)", () => {
      const vector = MathUtils.getThrustVector(Math.PI, 100);
      expect(vector.x).toBeCloseTo(-100, 5);
      expect(vector.y).toBeCloseTo(0, 5);
    });

    it("should scale thrust magnitude correctly", () => {
      const vector = MathUtils.getThrustVector(0, 50);
      expect(vector.x).toBeCloseTo(50, 5);
      expect(vector.y).toBeCloseTo(0, 5);
    });
  });

  describe("clamp", () => {
    it("should return the value when within range", () => {
      expect(MathUtils.clamp(5, 0, 10)).toBe(5);
    });

    it("should return min when value is below minimum", () => {
      expect(MathUtils.clamp(-5, 0, 10)).toBe(0);
    });

    it("should return max when value is above maximum", () => {
      expect(MathUtils.clamp(15, 0, 10)).toBe(10);
    });

    it("should handle equal min and max values", () => {
      expect(MathUtils.clamp(5, 7, 7)).toBe(7);
    });
  });

  describe("magnitude", () => {
    it("should calculate magnitude of zero vector", () => {
      expect(MathUtils.magnitude(0, 0)).toBe(0);
    });

    it("should calculate magnitude of unit vectors", () => {
      expect(MathUtils.magnitude(1, 0)).toBe(1);
      expect(MathUtils.magnitude(0, 1)).toBe(1);
    });

    it("should calculate magnitude of 3-4-5 triangle", () => {
      expect(MathUtils.magnitude(3, 4)).toBe(5);
    });

    it("should handle negative components", () => {
      expect(MathUtils.magnitude(-3, 4)).toBe(5);
      expect(MathUtils.magnitude(3, -4)).toBe(5);
      expect(MathUtils.magnitude(-3, -4)).toBe(5);
    });
  });

  describe("normalize", () => {
    it("should return zero vector for zero input", () => {
      const result = MathUtils.normalize(0, 0);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    it("should normalize unit vectors to themselves", () => {
      const result = MathUtils.normalize(1, 0);
      expect(result.x).toBeCloseTo(1, 5);
      expect(result.y).toBeCloseTo(0, 5);
    });

    it("should normalize arbitrary vectors to unit length", () => {
      const result = MathUtils.normalize(3, 4);
      expect(result.x).toBeCloseTo(0.6, 5); // 3/5
      expect(result.y).toBeCloseTo(0.8, 5); // 4/5

      // Verify unit length
      const magnitude = MathUtils.magnitude(result.x, result.y);
      expect(magnitude).toBeCloseTo(1, 5);
    });

    it("should handle negative components", () => {
      const result = MathUtils.normalize(-6, 8);
      expect(result.x).toBeCloseTo(-0.6, 5);
      expect(result.y).toBeCloseTo(0.8, 5);

      // Verify unit length
      const magnitude = MathUtils.magnitude(result.x, result.y);
      expect(magnitude).toBeCloseTo(1, 5);
    });
  });
});
