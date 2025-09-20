import { describe, it, expect, beforeEach, vi } from "vitest";
import { ShardManager } from "../../src/systems/ShardManager";
import { SHARD_CONFIG, AsteroidSize } from "../../src/config/balance";
import { Shard } from "../../src/gameobjects/Shard";

// Mock ObjectPool
vi.mock("../../src/utils/ObjectPool", () => ({
  ObjectPool: class MockObjectPool {
    private pool: any[] = [];
    private createFn: () => any;
    private resetFn: (obj: any) => void;

    constructor(createFn: () => any, resetFn: (obj: any) => void, activateFn: any, size: number) {
      this.createFn = createFn;
      this.resetFn = resetFn;
      // Pre-populate pool
      for (let i = 0; i < size; i++) {
        this.pool.push(this.createFn());
      }
    }

    get() {
      return this.pool.pop() || this.createFn();
    }

    return(obj: any) {
      this.resetFn(obj);
      this.pool.push(obj);
    }

    getPoolSize() {
      return this.pool.length;
    }

    clear() {
      this.pool = [];
    }
  },
}));

// Mock Shard
vi.mock("../../src/gameobjects/Shard", () => ({
  Shard: class MockShard {
    private _id = 0;
    private _value = 0;
    private _active = false;
    private _x = 0;
    private _y = 0;

    constructor(scene: any, x: number, y: number) {
      this._x = x;
      this._y = y;
    }

    get x() {
      return this._x;
    }
    get y() {
      return this._y;
    }

    spawn(x: number, y: number, config: any, id: number) {
      this._x = x;
      this._y = y;
      this._id = id;
      this._value = config.value;
      this._active = true;
    }

    update() {}

    getId() {
      return this._id;
    }
    getValue() {
      return this._value;
    }
    getIsActive() {
      return this._active;
    }

    collect() {
      this._active = false;
    }

    deactivate() {
      this._active = false;
      this._x = -100;
      this._y = -100;
    }
  },
}));

// Mock Phaser
vi.mock("phaser", () => ({
  Events: {
    EventEmitter: class MockEventEmitter {
      private listeners = new Map<string, Function[]>();

      on(event: string, fn: Function) {
        if (!this.listeners.has(event)) {
          this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(fn);
      }

      emit(event: string, ...args: any[]) {
        const listeners = this.listeners.get(event) || [];
        listeners.forEach((fn) => fn(...args));
      }

      removeAllListeners() {
        this.listeners.clear();
      }
    },
  },
  Math: {
    Distance: {
      Between: (x1: number, y1: number, x2: number, y2: number) => {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      },
    },
  },
}));

// Mock scene
const mockScene = {
  physics: {
    add: {
      group: vi.fn(() => ({
        add: vi.fn(),
        destroy: vi.fn(),
      })),
    },
  },
  events: {
    on: vi.fn(),
    off: vi.fn(),
  },
};

describe("ShardManager", () => {
  let shardManager: ShardManager;

  beforeEach(() => {
    vi.clearAllMocks();
    shardManager = new ShardManager(mockScene as any, SHARD_CONFIG);
  });

  describe("constructor", () => {
    it("should initialize with correct properties", () => {
      expect(shardManager.getActiveCount()).toBe(0);
      expect(shardManager.isAtCapacity()).toBe(false);
    });

    it("should create physics group", () => {
      expect(mockScene.physics.add.group).toHaveBeenCalled();
    });

    it("should set up event listeners", () => {
      expect(mockScene.events.on).toHaveBeenCalledWith(
        "shard-collected",
        expect.any(Function),
        expect.any(Object)
      );
      expect(mockScene.events.on).toHaveBeenCalledWith(
        "shard-expired",
        expect.any(Function),
        expect.any(Object)
      );
    });
  });

  describe("spawnShard", () => {
    it("should spawn a shard at given position", () => {
      const shard = shardManager.spawnShard(100, 200);

      expect(shard).toBeDefined();
      expect(shard!.x).toBe(100);
      expect(shard!.y).toBe(200);
      expect(shard!.getIsActive()).toBe(true);
      expect(shardManager.getActiveCount()).toBe(1);
    });

    it("should return null when at capacity", () => {
      // Fill to capacity
      for (let i = 0; i < SHARD_CONFIG.maxActiveShards; i++) {
        shardManager.spawnShard(i, i);
      }

      expect(shardManager.isAtCapacity()).toBe(true);

      const shard = shardManager.spawnShard(999, 999);
      expect(shard).toBeNull();
    });

    it("should assign unique IDs to shards", () => {
      const shard1 = shardManager.spawnShard(100, 100);
      const shard2 = shardManager.spawnShard(200, 200);

      expect(shard1!.getId()).not.toBe(shard2!.getId());
      expect(shard1!.getId()).toBeGreaterThanOrEqual(0);
      expect(shard2!.getId()).toBeGreaterThanOrEqual(0);
    });
  });

  describe("spawnShardsFromAsteroid", () => {
    it("should spawn correct number of shards for large asteroid", () => {
      const shards = shardManager.spawnShardsFromAsteroid(AsteroidSize.LARGE, 100, 100);

      expect(shards).toHaveLength(SHARD_CONFIG.baseYield[AsteroidSize.LARGE]);
      expect(shardManager.getActiveCount()).toBe(SHARD_CONFIG.baseYield[AsteroidSize.LARGE]);
    });

    it("should spawn correct number of shards for medium asteroid", () => {
      const shards = shardManager.spawnShardsFromAsteroid(AsteroidSize.MEDIUM, 100, 100);

      expect(shards).toHaveLength(SHARD_CONFIG.baseYield[AsteroidSize.MEDIUM]);
      expect(shardManager.getActiveCount()).toBe(SHARD_CONFIG.baseYield[AsteroidSize.MEDIUM]);
    });

    it("should spawn correct number of shards for small asteroid", () => {
      const shards = shardManager.spawnShardsFromAsteroid(AsteroidSize.SMALL, 100, 100);

      expect(shards).toHaveLength(SHARD_CONFIG.baseYield[AsteroidSize.SMALL]);
      expect(shardManager.getActiveCount()).toBe(SHARD_CONFIG.baseYield[AsteroidSize.SMALL]);
    });

    it("should spawn shards with slight position offset", () => {
      const shards = shardManager.spawnShardsFromAsteroid(AsteroidSize.MEDIUM, 100, 100);

      shards.forEach((shard) => {
        const distance = Math.sqrt((shard.x - 100) ** 2 + (shard.y - 100) ** 2);
        expect(distance).toBeGreaterThan(0); // Should have some offset
        expect(distance).toBeLessThanOrEqual(20); // But within offset radius
      });
    });

    it("should respect capacity limits", () => {
      // Fill to near capacity
      const remainingCapacity = 2;
      for (let i = 0; i < SHARD_CONFIG.maxActiveShards - remainingCapacity; i++) {
        shardManager.spawnShard(i, i);
      }

      // Try to spawn more shards than remaining capacity
      const shards = shardManager.spawnShardsFromAsteroid(AsteroidSize.LARGE, 100, 100);

      expect(shards).toHaveLength(remainingCapacity);
      expect(shardManager.getActiveCount()).toBe(SHARD_CONFIG.maxActiveShards);
    });
  });

  describe("update", () => {
    it("should update all active shards", () => {
      const shard1 = shardManager.spawnShard(100, 100);
      const shard2 = shardManager.spawnShard(200, 200);

      const updateSpy1 = vi.spyOn(shard1!, "update");
      const updateSpy2 = vi.spyOn(shard2!, "update");

      const playerPosition = { x: 150, y: 150 };
      const dt = 16;

      shardManager.update(dt, playerPosition);

      expect(updateSpy1).toHaveBeenCalledWith(
        dt,
        playerPosition,
        SHARD_CONFIG.magnetRadius,
        SHARD_CONFIG.magnetForce
      );
      expect(updateSpy2).toHaveBeenCalledWith(
        dt,
        playerPosition,
        SHARD_CONFIG.magnetRadius,
        SHARD_CONFIG.magnetForce
      );
    });

    it("should skip inactive shards", () => {
      const shard = shardManager.spawnShard(100, 100);
      shard!.deactivate();

      const updateSpy = vi.spyOn(shard!, "update");

      shardManager.update(16, { x: 150, y: 150 });

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe("checkCollisions", () => {
    it("should collect shard when player is within collection radius", () => {
      const shard = shardManager.spawnShard(100, 100);

      const mockPlayer = {
        x: 100 + SHARD_CONFIG.collectRadius - 1, // Just within range
        y: 100,
      };

      const collectSpy = vi.spyOn(shard!, "collect");

      shardManager.checkCollisions(mockPlayer as any);

      expect(collectSpy).toHaveBeenCalled();
    });

    it("should not collect shard when player is outside collection radius", () => {
      const shard = shardManager.spawnShard(100, 100);

      const mockPlayer = {
        x: 100 + SHARD_CONFIG.collectRadius + 1, // Just outside range
        y: 100,
      };

      const collectSpy = vi.spyOn(shard!, "collect");

      shardManager.checkCollisions(mockPlayer as any);

      expect(collectSpy).not.toHaveBeenCalled();
    });

    it("should skip inactive shards", () => {
      const shard = shardManager.spawnShard(100, 100);
      shard!.deactivate();

      const mockPlayer = { x: 100, y: 100 };
      const collectSpy = vi.spyOn(shard!, "collect");

      shardManager.checkCollisions(mockPlayer as any);

      expect(collectSpy).not.toHaveBeenCalled();
    });
  });

  describe("returnShard", () => {
    it("should remove shard from active set", () => {
      const shard = shardManager.spawnShard(100, 100);
      expect(shardManager.getActiveCount()).toBe(1);

      shardManager.returnShard(shard!);

      expect(shardManager.getActiveCount()).toBe(0);
    });

    it("should handle shard not in active set gracefully", () => {
      const mockShard = new Shard(mockScene as any, 0, 0);

      expect(() => shardManager.returnShard(mockShard)).not.toThrow();
      expect(shardManager.getActiveCount()).toBe(0);
    });
  });

  describe("clearAllShards", () => {
    it("should return all active shards to pool", () => {
      shardManager.spawnShard(100, 100);
      shardManager.spawnShard(200, 200);
      shardManager.spawnShard(300, 300);

      expect(shardManager.getActiveCount()).toBe(3);

      shardManager.clearAllShards();

      expect(shardManager.getActiveCount()).toBe(0);
    });
  });

  describe("getPoolStats", () => {
    it("should return correct pool statistics", () => {
      shardManager.spawnShard(100, 100);
      shardManager.spawnShard(200, 200);

      const stats = shardManager.getPoolStats();

      expect(stats.activeCount).toBe(2);
      expect(stats.maxActive).toBe(SHARD_CONFIG.maxActiveShards);
      expect(stats.poolSize).toBeGreaterThan(0);
    });
  });

  describe("event handling", () => {
    it("should handle shard collected event", () => {
      const shard = shardManager.spawnShard(100, 100);
      const returnShardSpy = vi.spyOn(shardManager, "returnShard");

      // Simulate shard collection event
      mockScene.events.on.mock.calls.find((call) => call[0] === "shard-collected")[1]({
        shard,
        value: 10,
        position: { x: 100, y: 100 },
      });

      expect(returnShardSpy).toHaveBeenCalledWith(shard);
    });

    it("should handle shard expired event", () => {
      const shard = shardManager.spawnShard(100, 100);
      const returnShardSpy = vi.spyOn(shardManager, "returnShard");

      // Simulate shard expiration event
      mockScene.events.on.mock.calls.find((call) => call[0] === "shard-expired")[1]({
        shard,
        position: { x: 100, y: 100 },
      });

      expect(returnShardSpy).toHaveBeenCalledWith(shard);
    });
  });

  describe("destroy", () => {
    it("should clean up all resources", () => {
      shardManager.spawnShard(100, 100);
      shardManager.spawnShard(200, 200);

      const clearSpy = vi.spyOn(shardManager, "clearAllShards");

      shardManager.destroy();

      expect(clearSpy).toHaveBeenCalled();
      expect(mockScene.events.off).toHaveBeenCalledWith("shard-collected", expect.any(Function));
      expect(mockScene.events.off).toHaveBeenCalledWith("shard-expired", expect.any(Function));
    });
  });
});
