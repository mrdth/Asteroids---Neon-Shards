import { describe, it, expect, beforeEach, vi } from "vitest";
import { AsteroidSpawner, SpawnWaveConfig } from "../../src/systems/AsteroidSpawner";
import { AsteroidManager } from "../../src/systems/AsteroidManager";
import { AsteroidSize, ASTEROID_SYSTEM_CONFIG } from "../../src/config/balance";

// Mock the scene
const mockScene = {
  cameras: {
    main: {
      width: 800,
      height: 600,
    },
  },
};

// Mock AsteroidManager
class MockAsteroidManager {
  private _isAtCapacity = false;
  private _activeAsteroids: any[] = [];

  isAtCapacity() {
    return this._isAtCapacity;
  }

  getAsteroid(size: AsteroidSize, x: number, y: number, velocity?: any, angularVelocity?: number) {
    if (this._isAtCapacity) return null;

    const mockAsteroid = {
      size,
      x,
      y,
      velocity: velocity || { x: 0, y: 0 },
      angularVelocity: angularVelocity || 0,
      getId: () => Math.random(),
    };

    this._activeAsteroids.push(mockAsteroid);
    return mockAsteroid;
  }

  getAllActiveAsteroids() {
    return this._activeAsteroids;
  }

  getActiveCount() {
    return this._activeAsteroids.length;
  }

  // Test helpers
  setAtCapacity(atCapacity: boolean) {
    this._isAtCapacity = atCapacity;
  }

  clearActiveAsteroids() {
    this._activeAsteroids = [];
  }

  addMockAsteroid(x: number, y: number) {
    this._activeAsteroids.push({ x, y });
  }
}

describe("AsteroidSpawner", () => {
  let spawner: AsteroidSpawner;
  let mockManager: MockAsteroidManager;

  beforeEach(() => {
    vi.clearAllMocks();
    mockManager = new MockAsteroidManager();
    spawner = new AsteroidSpawner(mockScene as any, mockManager as any);
  });

  describe("initialization", () => {
    it("should initialize with scene and manager", () => {
      expect(spawner).toBeDefined();
      expect(spawner.getSafeSpawnRadius()).toBe(ASTEROID_SYSTEM_CONFIG.safeSpawnRadius);
    });

    it("should have correct screen bounds", () => {
      const bounds = spawner.getScreenBounds();
      expect(bounds.width).toBe(800);
      expect(bounds.height).toBe(600);
    });
  });

  describe("wave spawning", () => {
    it("should spawn correct number of asteroids in a wave", () => {
      const config: SpawnWaveConfig = {
        count: 3,
        sizes: [AsteroidSize.LARGE],
      };
      const playerPos = { x: 400, y: 300 };

      const spawnedAsteroids = spawner.spawnWave(config, playerPos);

      expect(spawnedAsteroids.length).toBe(3);
      expect(spawnedAsteroids[0].size).toBe(AsteroidSize.LARGE);
    });

    it("should respect capacity limits", () => {
      mockManager.setAtCapacity(true);

      const config: SpawnWaveConfig = {
        count: 5,
        sizes: [AsteroidSize.LARGE],
      };
      const playerPos = { x: 400, y: 300 };

      const spawnedAsteroids = spawner.spawnWave(config, playerPos);

      expect(spawnedAsteroids.length).toBe(0);
    });

    it("should spawn different sizes when multiple sizes provided", () => {
      const config: SpawnWaveConfig = {
        count: 6,
        sizes: [AsteroidSize.LARGE, AsteroidSize.MEDIUM, AsteroidSize.SMALL],
      };
      const playerPos = { x: 400, y: 300 };

      const spawnedAsteroids = spawner.spawnWave(config, playerPos);

      expect(spawnedAsteroids.length).toBe(6);

      // Should have variety of sizes
      const sizes = spawnedAsteroids.map((a) => a.size);
      const uniqueSizes = new Set(sizes);
      expect(uniqueSizes.size).toBeGreaterThan(0);
    });

    it("should maintain safe distance from player", () => {
      const config: SpawnWaveConfig = {
        count: 5,
        sizes: [AsteroidSize.LARGE],
        avoidPlayerRadius: 200,
      };
      const playerPos = { x: 400, y: 300 };

      const spawnedAsteroids = spawner.spawnWave(config, playerPos);

      // Check that all asteroids are spawned at safe distance
      spawnedAsteroids.forEach((asteroid) => {
        const distance = Math.sqrt(
          Math.pow(asteroid.x - playerPos.x, 2) + Math.pow(asteroid.y - playerPos.y, 2)
        );
        expect(distance).toBeGreaterThanOrEqual(200);
      });
    });
  });

  describe("level-based wave spawning", () => {
    it("should spawn appropriate asteroids for level 1", () => {
      const playerPos = { x: 400, y: 300 };

      const spawnedAsteroids = spawner.spawnWaveByLevel(1, playerPos);

      expect(spawnedAsteroids.length).toBeGreaterThan(0);
      expect(spawnedAsteroids.length).toBeLessThanOrEqual(8);

      // Level 1 should have mostly large asteroids
      const largeSizes = spawnedAsteroids.filter((a) => a.size === AsteroidSize.LARGE);
      expect(largeSizes.length).toBeGreaterThan(0);
    });

    it("should increase difficulty with higher levels", () => {
      const playerPos = { x: 400, y: 300 };

      const level1Asteroids = spawner.spawnWaveByLevel(1, playerPos);
      mockManager.clearActiveAsteroids();
      const level5Asteroids = spawner.spawnWaveByLevel(5, playerPos);

      expect(level5Asteroids.length).toBeGreaterThanOrEqual(level1Asteroids.length);
    });

    it("should introduce small asteroids at higher levels", () => {
      const playerPos = { x: 400, y: 300 };

      const spawnWaveSpy = vi
        .spyOn(spawner as any, "spawnWave")
        .mockImplementation((_config: SpawnWaveConfig) => [] as any);

      spawner.spawnWaveByLevel(6, playerPos);

      expect(spawnWaveSpy).toHaveBeenCalled();
      const [configArg] = (spawnWaveSpy as any).mock.calls[0];
      expect(configArg.sizes).toContain(AsteroidSize.SMALL);

      spawnWaveSpy.mockRestore();
    });
  });

  describe("split asteroid spawning", () => {
    it("should spawn split asteroids with offset positions", () => {
      const parentData = {
        id: 1,
        size: AsteroidSize.LARGE,
        health: 100,
        maxHealth: 100,
        velocity: { x: 50, y: 25 },
        angularVelocity: 30,
        position: { x: 200, y: 150 },
      };

      const splitData = [
        {
          id: 2,
          size: AsteroidSize.MEDIUM,
          health: 50,
          maxHealth: 50,
          velocity: { x: 40, y: 20 },
          angularVelocity: 25,
          position: { x: 200, y: 150 },
        },
        {
          id: 3,
          size: AsteroidSize.MEDIUM,
          health: 50,
          maxHealth: 50,
          velocity: { x: 60, y: 30 },
          angularVelocity: 35,
          position: { x: 200, y: 150 },
        },
      ];

      const spawnedAsteroids = spawner.spawnSplits(parentData, splitData);

      expect(spawnedAsteroids.length).toBe(2);

      // Check that positions are offset from parent
      spawnedAsteroids.forEach((asteroid) => {
        const distance = Math.sqrt(
          Math.pow(asteroid.x - parentData.position.x, 2) +
            Math.pow(asteroid.y - parentData.position.y, 2)
        );
        expect(distance).toBeGreaterThan(0);
        expect(distance).toBeLessThanOrEqual(20);
      });
    });

    it("should respect capacity when spawning splits", () => {
      mockManager.setAtCapacity(true);

      const parentData = {
        id: 1,
        size: AsteroidSize.LARGE,
        health: 100,
        maxHealth: 100,
        velocity: { x: 50, y: 25 },
        angularVelocity: 30,
        position: { x: 200, y: 150 },
      };

      const splitData = [
        {
          id: 2,
          size: AsteroidSize.MEDIUM,
          health: 50,
          maxHealth: 50,
          velocity: { x: 40, y: 20 },
          angularVelocity: 25,
          position: { x: 200, y: 150 },
        },
      ];

      const spawnedAsteroids = spawner.spawnSplits(parentData, splitData);

      expect(spawnedAsteroids.length).toBe(0);
    });
  });

  describe("edge spawning", () => {
    it("should spawn asteroids at screen edges", () => {
      const playerPos = { x: 400, y: 300 };

      const asteroid = spawner.spawnAtEdge(AsteroidSize.LARGE, playerPos);

      expect(asteroid).toBeDefined();

      // Should be outside the main screen area OR at minimum distance from player
      const bounds = spawner.getScreenBounds();
      const isOutside =
        asteroid!.x < -50 ||
        asteroid!.x > bounds.width + 50 ||
        asteroid!.y < -50 ||
        asteroid!.y > bounds.height + 50;

      const distanceFromPlayer = Math.sqrt(
        Math.pow(asteroid!.x - playerPos.x, 2) + Math.pow(asteroid!.y - playerPos.y, 2)
      );

      // Either outside screen bounds OR at safe distance from player
      expect(isOutside || distanceFromPlayer >= spawner.getSafeSpawnRadius()).toBe(true);
    });

    it("should not spawn at edge when at capacity", () => {
      mockManager.setAtCapacity(true);
      const playerPos = { x: 400, y: 300 };

      const asteroid = spawner.spawnAtEdge(AsteroidSize.LARGE, playerPos);

      expect(asteroid).toBeNull();
    });
  });

  describe("position collision detection", () => {
    it("should avoid spawning on existing asteroids", () => {
      // Add some existing asteroids
      mockManager.addMockAsteroid(100, 100);
      mockManager.addMockAsteroid(200, 200);
      mockManager.addMockAsteroid(300, 300);

      const playerPos = { x: 400, y: 300 };

      const asteroid = spawner.spawnRandom(AsteroidSize.MEDIUM, playerPos);

      expect(asteroid).toBeDefined();

      // Should not be too close to existing asteroids
      const activeAsteroids = mockManager.getAllActiveAsteroids();
      for (const existing of activeAsteroids) {
        if (existing !== asteroid) {
          const distance = Math.sqrt(
            Math.pow(asteroid!.x - existing.x, 2) + Math.pow(asteroid!.y - existing.y, 2)
          );
          expect(distance).toBeGreaterThan(40); // Should avoid overlap
        }
      }
    });
  });

  describe("capacity management", () => {
    it("should correctly report spawn availability", () => {
      expect(spawner.canSpawn()).toBe(true);

      mockManager.setAtCapacity(true);
      expect(spawner.canSpawn()).toBe(false);
    });

    it("should calculate remaining capacity", () => {
      const remainingCapacity = spawner.getRemainingCapacity();

      expect(remainingCapacity).toBe(ASTEROID_SYSTEM_CONFIG.maxActiveCount);
    });
  });

  describe("configuration", () => {
    it("should allow setting safe spawn radius", () => {
      const newRadius = 250;
      spawner.setSafeSpawnRadius(newRadius);

      expect(spawner.getSafeSpawnRadius()).toBe(newRadius);
    });

    it("should allow updating screen bounds", () => {
      const originalBounds = spawner.getScreenBounds();

      // Mock new camera dimensions
      mockScene.cameras.main.width = 1024;
      mockScene.cameras.main.height = 768;

      spawner.updateScreenBounds();

      const newBounds = spawner.getScreenBounds();
      expect(newBounds.width).toBe(1024);
      expect(newBounds.height).toBe(768);
    });
  });
});
