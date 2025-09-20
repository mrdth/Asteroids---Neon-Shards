import { beforeEach, describe, expect, it, vi } from "vitest";
import { Asteroid } from "../../src/gameobjects/Asteroid";
import { ASTEROID_CONFIGS, AsteroidSize } from "../../src/config/balance";

// Mock Phaser
vi.mock("phaser", () => ({
  Physics: {
    Arcade: {
      Sprite: class MockSprite {
        scene: any;
        x = 0;
        y = 0;
        width = 64;
        height = 64;
        rotation = 0;
        body: any;

        constructor(scene: any, x: number, y: number, texture: string) {
          this.scene = scene;
          this.x = x;
          this.y = y;
          this.body = {
            velocity: { x: 0, y: 0 },
            angularVelocity: 0,
            setCircle: vi.fn(),
            setBounce: vi.fn(),
            setCollideWorldBounds: vi.fn(),
            setVelocity: vi.fn((x: number, y: number) => {
              this.velocity.x = x;
              this.velocity.y = y;
            }),
            setAngularVelocity: vi.fn((av: number) => {
              this.angularVelocity = av;
            }),
          };
        }

        setPosition(x: number, y: number) {
          this.x = x;
          this.y = y;
          return this;
        }

        setScale(scale: number) {
          return this;
        }

        setOrigin(x: number, y: number) {
          return this;
        }

        setVisible(visible: boolean) {
          return this;
        }

        setActive(active: boolean) {
          return this;
        }

        destroy() {
          // Mock destroy
        }
      },
    },
  },
  GameObjects: {
    Sprite: class MockGameObjectSprite {
      x = 0;
      y = 0;
      rotation = 0;

      constructor() {}

      setOrigin() {
        return this;
      }

      setScale() {
        return this;
      }

      setVisible() {
        return this;
      }

      destroy() {}
    },
  },
}));

// Mock the scene and its methods
const mockScene = {
  add: {
    existing: vi.fn(),
    sprite: vi.fn(() => new (vi.mocked(require("phaser")).GameObjects.Sprite)()),
  },
  physics: {
    add: {
      existing: vi.fn(),
    },
  },
  cameras: {
    main: {
      width: 800,
      height: 600,
    },
  },
};

describe("Asteroid", () => {
  let asteroid: Asteroid;

  beforeEach(() => {
    vi.clearAllMocks();
    asteroid = new Asteroid(mockScene as any, 100, 100, AsteroidSize.LARGE);
  });

  describe("initialization", () => {
    it("should create asteroid with correct size and health", () => {
      expect(asteroid.getSize()).toBe(AsteroidSize.LARGE);
      expect(asteroid.getHealth()).toBe(ASTEROID_CONFIGS[AsteroidSize.LARGE].health);
      expect(asteroid.getMaxHealth()).toBe(ASTEROID_CONFIGS[AsteroidSize.LARGE].health);
    });

    it("should initialize with physics body setup", () => {
      expect(mockScene.add.existing).toHaveBeenCalledWith(asteroid);
      expect(mockScene.physics.add.existing).toHaveBeenCalledWith(asteroid);
    });

    it("should have unique IDs for different asteroids", () => {
      const asteroid2 = new Asteroid(mockScene as any, 200, 200, AsteroidSize.MEDIUM);
      expect(asteroid.getId()).not.toBe(asteroid2.getId());
    });
  });

  describe("damage system", () => {
    it("should take damage correctly", () => {
      const initialHealth = asteroid.getHealth();
      const damage = 25;

      const isDestroyed = asteroid.takeDamage(damage);

      expect(isDestroyed).toBe(false);
      expect(asteroid.getHealth()).toBe(initialHealth - damage);
    });

    it("should be destroyed when health reaches zero", () => {
      const health = asteroid.getHealth();

      const isDestroyed = asteroid.takeDamage(health);

      expect(isDestroyed).toBe(true);
      expect(asteroid.getHealth()).toBe(0);
    });

    it("should not take damage when inactive", () => {
      asteroid.reset();
      const initialHealth = asteroid.getMaxHealth();

      const isDestroyed = asteroid.takeDamage(50);

      expect(isDestroyed).toBe(false);
      expect(asteroid.getHealth()).toBe(initialHealth);
    });
  });

  describe("splitting behavior", () => {
    it("should split large asteroid into medium asteroids", () => {
      const largeAsteroid = new Asteroid(mockScene as any, 100, 100, AsteroidSize.LARGE);
      largeAsteroid.initialize(100, 100);

      const splitData = largeAsteroid.split();

      expect(splitData.length).toBeGreaterThanOrEqual(2);
      expect(splitData.length).toBeLessThanOrEqual(3);
      expect(splitData[0].size).toBe(AsteroidSize.MEDIUM);
      expect(splitData[0].health).toBe(ASTEROID_CONFIGS[AsteroidSize.MEDIUM].health);
    });

    it("should split medium asteroid into small asteroids", () => {
      const mediumAsteroid = new Asteroid(mockScene as any, 100, 100, AsteroidSize.MEDIUM);
      mediumAsteroid.initialize(100, 100);

      const splitData = mediumAsteroid.split();

      expect(splitData.length).toBeGreaterThanOrEqual(2);
      expect(splitData.length).toBeLessThanOrEqual(3);
      expect(splitData[0].size).toBe(AsteroidSize.SMALL);
      expect(splitData[0].health).toBe(ASTEROID_CONFIGS[AsteroidSize.SMALL].health);
    });

    it("should not split small asteroids", () => {
      const smallAsteroid = new Asteroid(mockScene as any, 100, 100, AsteroidSize.SMALL);
      smallAsteroid.initialize(100, 100);

      const splitData = smallAsteroid.split();

      expect(splitData.length).toBe(0);
    });

    it("should not split inactive asteroids", () => {
      asteroid.reset();

      const splitData = asteroid.split();

      expect(splitData.length).toBe(0);
    });

    it("should inherit velocity from parent with randomization", () => {
      asteroid.initialize(100, 100, { x: 100, y: 50 });

      const splitData = asteroid.split();

      expect(splitData.length).toBeGreaterThan(0);

      // Check that split velocities are influenced by parent velocity
      for (const data of splitData) {
        expect(typeof data.velocity.x).toBe("number");
        expect(typeof data.velocity.y).toBe("number");
        expect(data.velocity.x).not.toBe(0);
        expect(data.velocity.y).not.toBe(0);
      }
    });
  });

  describe("initialization and reset", () => {
    it("should initialize with position and velocity", () => {
      const x = 200;
      const y = 150;
      const velocity = { x: 50, y: -30 };
      const angularVelocity = 45;

      asteroid.initialize(x, y, velocity, angularVelocity);

      expect(asteroid.x).toBe(x);
      expect(asteroid.y).toBe(y);
      expect(asteroid.getIsActive()).toBe(true);
    });

    it("should reset to inactive state", () => {
      asteroid.initialize(100, 100);

      asteroid.reset();

      expect(asteroid.getIsActive()).toBe(false);
      expect(asteroid.getHealth()).toBe(asteroid.getMaxHealth());
    });

    it("should generate random velocity when not provided", () => {
      // This test verifies that the asteroid can initialize without explicit velocity
      asteroid.initialize(100, 100);

      expect(asteroid.getIsActive()).toBe(true);
      // The body velocity should be set during initialization
    });
  });

  describe("data export", () => {
    it("should export correct asteroid data", () => {
      const x = 150;
      const y = 200;
      const velocity = { x: 75, y: -25 };
      const angularVelocity = 30;

      asteroid.initialize(x, y, velocity, angularVelocity);
      asteroid.takeDamage(25); // Reduce health

      const data = asteroid.getData();

      expect(data.id).toBe(asteroid.getId());
      expect(data.size).toBe(asteroid.getSize());
      expect(data.health).toBe(asteroid.getHealth());
      expect(data.maxHealth).toBe(asteroid.getMaxHealth());
      expect(data.position.x).toBe(x);
      expect(data.position.y).toBe(y);
      expect(typeof data.velocity.x).toBe("number");
      expect(typeof data.velocity.y).toBe("number");
      expect(typeof data.angularVelocity).toBe("number");
    });
  });

  describe("size configurations", () => {
    it("should have correct health values for each size", () => {
      const large = new Asteroid(mockScene as any, 0, 0, AsteroidSize.LARGE);
      const medium = new Asteroid(mockScene as any, 0, 0, AsteroidSize.MEDIUM);
      const small = new Asteroid(mockScene as any, 0, 0, AsteroidSize.SMALL);

      expect(large.getMaxHealth()).toBe(100);
      expect(medium.getMaxHealth()).toBe(50);
      expect(small.getMaxHealth()).toBe(20);
    });

    it("should use correct configurations for each size", () => {
      const sizes = [AsteroidSize.LARGE, AsteroidSize.MEDIUM, AsteroidSize.SMALL];

      sizes.forEach((size) => {
        const testAsteroid = new Asteroid(mockScene as any, 0, 0, size);
        const config = ASTEROID_CONFIGS[size];

        expect(testAsteroid.getSize()).toBe(size);
        expect(testAsteroid.getMaxHealth()).toBe(config.health);
      });
    });
  });
});
