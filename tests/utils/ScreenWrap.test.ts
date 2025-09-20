import { describe, it, expect, beforeEach } from "vitest";
import { ScreenWrap } from "../../src/utils/ScreenWrap";

describe("ScreenWrap", () => {
  let bounds: Phaser.Geom.Rectangle;
  let mockObject: any;

  beforeEach(() => {
    bounds = new Phaser.Geom.Rectangle(0, 0, 800, 600);
    mockObject = {
      x: 400,
      y: 300,
      width: 32,
      height: 32,
    };
  });

  describe("wrap method", () => {
    it("should wrap object from left edge to right edge", () => {
      mockObject.x = -20; // Outside left bound (object width is 32, so center is at -20)

      ScreenWrap.wrap(mockObject, bounds);

      expect(mockObject.x).toBe(816); // 800 + 16 (half width)
    });

    it("should wrap object from right edge to left edge", () => {
      mockObject.x = 820; // Outside right bound

      ScreenWrap.wrap(mockObject, bounds);

      expect(mockObject.x).toBe(-16); // 0 - 16 (half width)
    });

    it("should wrap object from top edge to bottom edge", () => {
      mockObject.y = -20; // Outside top bound

      ScreenWrap.wrap(mockObject, bounds);

      expect(mockObject.y).toBe(616); // 600 + 16 (half height)
    });

    it("should wrap object from bottom edge to top edge", () => {
      mockObject.y = 620; // Outside bottom bound

      ScreenWrap.wrap(mockObject, bounds);

      expect(mockObject.y).toBe(-16); // 0 - 16 (half height)
    });

    it("should not wrap object that is within bounds", () => {
      mockObject.x = 400;
      mockObject.y = 300;

      const originalX = mockObject.x;
      const originalY = mockObject.y;

      ScreenWrap.wrap(mockObject, bounds);

      expect(mockObject.x).toBe(originalX);
      expect(mockObject.y).toBe(originalY);
    });

    it("should handle corner wrapping correctly", () => {
      mockObject.x = -20; // Outside left
      mockObject.y = -20; // Outside top

      ScreenWrap.wrap(mockObject, bounds);

      expect(mockObject.x).toBe(816); // Wrapped to right
      expect(mockObject.y).toBe(616); // Wrapped to bottom
    });

    it("should work with different object sizes", () => {
      const largeObject = {
        x: -50,
        y: 300,
        width: 64,
        height: 64,
      };

      ScreenWrap.wrap(largeObject, bounds);

      expect(largeObject.x).toBe(832); // 800 + 32 (half of 64)
    });
  });

  describe("isOutsideBounds method", () => {
    it("should return true when object is completely outside left bound", () => {
      mockObject.x = -20;

      const result = ScreenWrap.isOutsideBounds(mockObject, bounds);

      expect(result).toBe(true);
    });

    it("should return true when object is completely outside right bound", () => {
      mockObject.x = 820;

      const result = ScreenWrap.isOutsideBounds(mockObject, bounds);

      expect(result).toBe(true);
    });

    it("should return true when object is completely outside top bound", () => {
      mockObject.y = -20;

      const result = ScreenWrap.isOutsideBounds(mockObject, bounds);

      expect(result).toBe(true);
    });

    it("should return true when object is completely outside bottom bound", () => {
      mockObject.y = 620;

      const result = ScreenWrap.isOutsideBounds(mockObject, bounds);

      expect(result).toBe(true);
    });

    it("should return false when object is completely inside bounds", () => {
      mockObject.x = 400;
      mockObject.y = 300;

      const result = ScreenWrap.isOutsideBounds(mockObject, bounds);

      expect(result).toBe(false);
    });

    it("should return false when object is partially outside bounds", () => {
      mockObject.x = 790; // Partially outside right bound

      const result = ScreenWrap.isOutsideBounds(mockObject, bounds);

      expect(result).toBe(false);
    });

    it("should handle edge cases at exact boundaries", () => {
      // Object touching left edge
      mockObject.x = 16; // Half width from left edge

      let result = ScreenWrap.isOutsideBounds(mockObject, bounds);
      expect(result).toBe(false);

      // Object touching right edge
      mockObject.x = 784; // Half width from right edge

      result = ScreenWrap.isOutsideBounds(mockObject, bounds);
      expect(result).toBe(false);
    });
  });

  describe("getGameBounds method", () => {
    it("should return correct bounds from scene camera", () => {
      const mockScene = {
        cameras: {
          main: {
            width: 1024,
            height: 768,
          },
        },
      } as any;

      const result = ScreenWrap.getGameBounds(mockScene);

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.width).toBe(1024);
      expect(result.height).toBe(768);
    });

    it("should work with different screen sizes", () => {
      const mockScene = {
        cameras: {
          main: {
            width: 1920,
            height: 1080,
          },
        },
      } as any;

      const result = ScreenWrap.getGameBounds(mockScene);

      expect(result.width).toBe(1920);
      expect(result.height).toBe(1080);
    });
  });

  describe("integration with game objects", () => {
    it("should work with objects that have fractional positions", () => {
      mockObject.x = -20.7; // Outside left bound (object center at -20.7, left edge at -36.7)
      mockObject.y = -20.3; // Outside top bound (object center at -20.3, top edge at -36.3)

      ScreenWrap.wrap(mockObject, bounds);

      expect(mockObject.x).toBeCloseTo(816, 1); // bounds.right + halfWidth = 800 + 16
      expect(mockObject.y).toBeCloseTo(616, 1); // bounds.bottom + halfHeight = 600 + 16
    });

    it("should preserve object properties other than position", () => {
      const objectWithProperties = {
        x: -20,
        y: 300,
        width: 32,
        height: 32,
        rotation: 1.5,
        velocity: { x: 100, y: 50 },
        customProperty: "test",
      };

      ScreenWrap.wrap(objectWithProperties, bounds);

      expect(objectWithProperties.rotation).toBe(1.5);
      expect(objectWithProperties.velocity).toEqual({ x: 100, y: 50 });
      expect(objectWithProperties.customProperty).toBe("test");
    });
  });
});
