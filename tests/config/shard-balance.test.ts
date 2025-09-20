import { describe, it, expect } from "vitest";
import { SHARD_CONFIG, ASTEROID_CONFIGS, AsteroidSize } from "../../src/config/balance";

describe("Shard Configuration", () => {
  describe("SHARD_CONFIG", () => {
    it("should have all required properties", () => {
      expect(SHARD_CONFIG).toHaveProperty("baseYield");
      expect(SHARD_CONFIG).toHaveProperty("value");
      expect(SHARD_CONFIG).toHaveProperty("lifespanMs");
      expect(SHARD_CONFIG).toHaveProperty("magnetRadius");
      expect(SHARD_CONFIG).toHaveProperty("magnetForce");
      expect(SHARD_CONFIG).toHaveProperty("collectRadius");
      expect(SHARD_CONFIG).toHaveProperty("maxActiveShards");
    });

    it("should have positive values for all numeric properties", () => {
      expect(SHARD_CONFIG.value).toBeGreaterThan(0);
      expect(SHARD_CONFIG.lifespanMs).toBeGreaterThan(0);
      expect(SHARD_CONFIG.magnetRadius).toBeGreaterThan(0);
      expect(SHARD_CONFIG.magnetForce).toBeGreaterThan(0);
      expect(SHARD_CONFIG.collectRadius).toBeGreaterThan(0);
      expect(SHARD_CONFIG.maxActiveShards).toBeGreaterThan(0);
    });

    it("should have reasonable performance limits", () => {
      // Performance considerations
      expect(SHARD_CONFIG.maxActiveShards).toBeLessThanOrEqual(100);
      expect(SHARD_CONFIG.lifespanMs).toBeGreaterThan(1000); // At least 1 second
      expect(SHARD_CONFIG.lifespanMs).toBeLessThan(10000); // No more than 10 seconds
    });

    it("should have collect radius smaller than magnet radius", () => {
      expect(SHARD_CONFIG.collectRadius).toBeLessThan(SHARD_CONFIG.magnetRadius);
    });
  });

  describe("baseYield configuration", () => {
    it("should have yield for all asteroid sizes", () => {
      expect(SHARD_CONFIG.baseYield).toHaveProperty(AsteroidSize.LARGE);
      expect(SHARD_CONFIG.baseYield).toHaveProperty(AsteroidSize.MEDIUM);
      expect(SHARD_CONFIG.baseYield).toHaveProperty(AsteroidSize.SMALL);
    });

    it("should have positive yield values", () => {
      Object.values(SHARD_CONFIG.baseYield).forEach((yieldValue) => {
        expect(yieldValue).toBeGreaterThan(0);
        expect(Number.isInteger(yieldValue)).toBe(true);
      });
    });

    it("should have appropriate scaling (larger asteroids = more shards)", () => {
      expect(SHARD_CONFIG.baseYield[AsteroidSize.LARGE]).toBeGreaterThan(
        SHARD_CONFIG.baseYield[AsteroidSize.MEDIUM]
      );
      expect(SHARD_CONFIG.baseYield[AsteroidSize.MEDIUM]).toBeGreaterThan(
        SHARD_CONFIG.baseYield[AsteroidSize.SMALL]
      );
    });

    it("should have reasonable maximum shard spawning per wave", () => {
      // Assuming worst case: all large asteroids
      const maxAsteroidsPerWave = 10; // reasonable estimate
      const maxShardsPerWave = maxAsteroidsPerWave * SHARD_CONFIG.baseYield[AsteroidSize.LARGE];

      expect(maxShardsPerWave).toBeLessThanOrEqual(SHARD_CONFIG.maxActiveShards);
    });
  });

  describe("balance and gameplay considerations", () => {
    it("should provide reasonable score progression", () => {
      // Calculate score per asteroid destruction
      const scorePerLarge = SHARD_CONFIG.baseYield[AsteroidSize.LARGE] * SHARD_CONFIG.value;
      const scorePerMedium = SHARD_CONFIG.baseYield[AsteroidSize.MEDIUM] * SHARD_CONFIG.value;
      const scorePerSmall = SHARD_CONFIG.baseYield[AsteroidSize.SMALL] * SHARD_CONFIG.value;

      expect(scorePerLarge).toBeGreaterThan(scorePerMedium);
      expect(scorePerMedium).toBeGreaterThan(scorePerSmall);
      expect(scorePerSmall).toBeGreaterThan(0);

      // Score values should be reasonable for game feel
      expect(scorePerLarge).toBeGreaterThanOrEqual(30);
      expect(scorePerLarge).toBeLessThanOrEqual(100);
    });

    it("should have appropriate magnetic attraction settings", () => {
      // Magnet radius should be reasonable for gameplay
      expect(SHARD_CONFIG.magnetRadius).toBeGreaterThan(50); // Not too small
      expect(SHARD_CONFIG.magnetRadius).toBeLessThan(300); // Not too large

      // Magnet force should be strong enough to be noticeable
      expect(SHARD_CONFIG.magnetForce).toBeGreaterThan(50);
      expect(SHARD_CONFIG.magnetForce).toBeLessThan(1000);
    });

    it("should have appropriate collection radius for precision", () => {
      // Collection radius should be forgiving but not too easy
      expect(SHARD_CONFIG.collectRadius).toBeGreaterThan(10);
      expect(SHARD_CONFIG.collectRadius).toBeLessThan(50);
    });

    it("should balance lifespan with gameplay flow", () => {
      // Lifespan should give players time to collect but create urgency
      expect(SHARD_CONFIG.lifespanMs).toBeGreaterThanOrEqual(3000); // At least 3 seconds
      expect(SHARD_CONFIG.lifespanMs).toBeLessThanOrEqual(6000); // No more than 6 seconds
    });
  });

  describe("integration with asteroid system", () => {
    it("should have consistent data types with asteroid system", () => {
      // Verify that all asteroid sizes in SHARD_CONFIG match ASTEROID_CONFIGS
      Object.keys(SHARD_CONFIG.baseYield).forEach((asteroidSize) => {
        expect(ASTEROID_CONFIGS).toHaveProperty(asteroidSize);
      });

      Object.keys(ASTEROID_CONFIGS).forEach((asteroidSize) => {
        expect(SHARD_CONFIG.baseYield).toHaveProperty(asteroidSize);
      });
    });

    it("should scale appropriately with asteroid health", () => {
      // More health = more shards should make sense
      const largeHealth = ASTEROID_CONFIGS[AsteroidSize.LARGE].health;
      const mediumHealth = ASTEROID_CONFIGS[AsteroidSize.MEDIUM].health;
      const smallHealth = ASTEROID_CONFIGS[AsteroidSize.SMALL].health;

      const largeShards = SHARD_CONFIG.baseYield[AsteroidSize.LARGE];
      const mediumShards = SHARD_CONFIG.baseYield[AsteroidSize.MEDIUM];
      const smallShards = SHARD_CONFIG.baseYield[AsteroidSize.SMALL];

      // Shard-to-health ratio should be roughly consistent
      const largeRatio = largeShards / largeHealth;
      const mediumRatio = mediumShards / mediumHealth;
      const smallRatio = smallShards / smallHealth;

      // Ratios should be relatively close (within reasonable bounds)
      expect(Math.abs(largeRatio - mediumRatio)).toBeLessThan(0.02);
      expect(Math.abs(mediumRatio - smallRatio)).toBeLessThan(0.02);
    });
  });

  describe("edge cases and validation", () => {
    it("should handle zero shard scenarios gracefully", () => {
      // All yields should be at least 1 to ensure feedback
      Object.values(SHARD_CONFIG.baseYield).forEach((yieldValue) => {
        expect(yieldValue).toBeGreaterThanOrEqual(1);
      });
    });

    it("should prevent infinite or invalid values", () => {
      Object.values(SHARD_CONFIG).forEach((value) => {
        if (typeof value === "number") {
          expect(Number.isFinite(value)).toBe(true);
          expect(Number.isNaN(value)).toBe(false);
        }
      });

      Object.values(SHARD_CONFIG.baseYield).forEach((yieldValue) => {
        expect(Number.isFinite(yieldValue)).toBe(true);
        expect(Number.isNaN(yieldValue)).toBe(false);
      });
    });

    it("should have integer values where appropriate", () => {
      expect(Number.isInteger(SHARD_CONFIG.value)).toBe(true);
      expect(Number.isInteger(SHARD_CONFIG.lifespanMs)).toBe(true);
      expect(Number.isInteger(SHARD_CONFIG.maxActiveShards)).toBe(true);

      Object.values(SHARD_CONFIG.baseYield).forEach((yieldValue) => {
        expect(Number.isInteger(yieldValue)).toBe(true);
      });
    });
  });

  describe("performance and memory considerations", () => {
    it("should have reasonable limits for concurrent shards", () => {
      // Maximum shards should not exceed reasonable memory usage
      expect(SHARD_CONFIG.maxActiveShards).toBeLessThanOrEqual(100);

      // Should be able to handle multiple waves worth of shards
      const estimatedShardsPerWave = 15; // Rough estimate
      expect(SHARD_CONFIG.maxActiveShards).toBeGreaterThanOrEqual(estimatedShardsPerWave * 2);
    });

    it("should have appropriate lifespan for cleanup", () => {
      // Lifespan should be long enough for collection but short enough for cleanup
      const minReasonableLifespan = 2000; // 2 seconds
      const maxReasonableLifespan = 8000; // 8 seconds

      expect(SHARD_CONFIG.lifespanMs).toBeGreaterThanOrEqual(minReasonableLifespan);
      expect(SHARD_CONFIG.lifespanMs).toBeLessThanOrEqual(maxReasonableLifespan);
    });
  });
});
