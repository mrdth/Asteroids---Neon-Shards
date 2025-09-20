import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShardManager } from '../../src/systems/ShardManager';
import { AsteroidManager } from '../../src/systems/AsteroidManager';
import { Asteroid } from '../../src/gameobjects/Asteroid';
import { SHARD_CONFIG, AsteroidSize, ASTEROID_CONFIGS } from '../../src/config/balance';

// Mock Phaser and related components
vi.mock('phaser', () => ({
    Events: {
        EventEmitter: class MockEventEmitter {
            private listeners: Map<string, Function[]> = new Map();

            on(event: string, fn: Function) {
                if (!this.listeners.has(event)) {
                    this.listeners.set(event, []);
                }
                this.listeners.get(event)!.push(fn);
            }

            emit(event: string, ...args: any[]) {
                const listeners = this.listeners.get(event) || [];
                listeners.forEach(fn => fn(...args));
            }

            removeAllListeners() {
                this.listeners.clear();
            }
        }
    },
    Physics: {
        Arcade: {
            Sprite: class MockSprite {
                scene: any;
                x: number = 0;
                y: number = 0;
                body: any;
                tint: number = 0xffffff;
                scale: number = 1;
                alpha: number = 1;
                visible: boolean = true;
                active: boolean = true;
                rotation: number = 0;

                constructor(scene: any, x: number, y: number, texture: string) {
                    this.scene = scene;
                    this.x = x;
                    this.y = y;
                    this.body = {
                        velocity: { x: 0, y: 0 },
                        setSize: vi.fn(),
                        setDrag: vi.fn(),
                        setCollideWorldBounds: vi.fn(),
                        setBounce: vi.fn(),
                        setCircle: vi.fn(),
                        setVelocity: vi.fn(),
                        setAcceleration: vi.fn()
                    };
                }

                setPosition(x: number, y: number) {
                    this.x = x;
                    this.y = y;
                    return this;
                }

                setScale(scale: number) {
                    this.scale = scale;
                    return this;
                }

                setOrigin() { return this; }
                setTint(tint: number) {
                    this.tint = tint;
                    return this;
                }
                setAlpha(alpha: number) {
                    this.alpha = alpha;
                    return this;
                }
                setVisible(visible: boolean) {
                    this.visible = visible;
                    return this;
                }
                setActive(active: boolean) {
                    this.active = active;
                    return this;
                }
                setRotation(rotation: number) {
                    this.rotation = rotation;
                    return this;
                }
            }
        }
    },
    Math: {
        Distance: {
            Between: (x1: number, y1: number, x2: number, y2: number) => {
                return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            }
        }
    }
}));

vi.mock('../../src/utils/ObjectPool');
vi.mock('../../src/utils/ScreenWrap');

// Mock scene
const createMockScene = () => ({
    add: { existing: vi.fn() },
    physics: {
        add: {
            existing: vi.fn(),
            group: vi.fn(() => ({
                add: vi.fn(),
                remove: vi.fn(),
                destroy: vi.fn()
            }))
        }
    },
    events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn()
    }
});

describe('Shard Collection Flow Integration', () => {
    let shardManager: ShardManager;
    let asteroidManager: AsteroidManager;
    let mockScene: any;
    let gameState: {
        playerScore: number;
        shardsCollected: number;
        playerPosition: { x: number; y: number };
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockScene = createMockScene();

        shardManager = new ShardManager(mockScene, SHARD_CONFIG);
        asteroidManager = new AsteroidManager(mockScene);

        gameState = {
            playerScore: 0,
            shardsCollected: 0,
            playerPosition: { x: 400, y: 300 }
        };

        // Mock player ship for collision detection
        mockScene.playerShip = gameState.playerPosition;

        // Set up event handlers to simulate GameScene behavior
        shardManager.on('shard-collected', (event: any) => {
            gameState.playerScore += event.value;
            gameState.shardsCollected++;
        });
    });

    describe('Complete asteroid-to-shard-to-collection flow', () => {
        it('should handle full flow: asteroid destruction → shard spawn → collection', () => {
            // 1. Create and destroy a large asteroid
            const asteroid = asteroidManager.getAsteroid(AsteroidSize.LARGE, 100, 100);
            expect(asteroid).toBeDefined();

            // 2. Destroy asteroid and spawn shards
            const splitData = asteroidManager.destroyAsteroid(asteroid!, false); // Don't split for simplicity
            const shards = shardManager.spawnShardsFromAsteroid(AsteroidSize.LARGE, 100, 100);

            // 3. Verify correct number of shards spawned
            expect(shards).toHaveLength(SHARD_CONFIG.baseYield[AsteroidSize.LARGE]);
            expect(shardManager.getActiveCount()).toBe(SHARD_CONFIG.baseYield[AsteroidSize.LARGE]);

            // 4. Move player close to shards and check collection
            gameState.playerPosition = { x: 100, y: 100 };
            shardManager.checkCollisions(gameState.playerPosition as any);

            // 5. Verify score and collection count updated
            const expectedScore = SHARD_CONFIG.baseYield[AsteroidSize.LARGE] * SHARD_CONFIG.value;
            expect(gameState.playerScore).toBe(expectedScore);
            expect(gameState.shardsCollected).toBe(SHARD_CONFIG.baseYield[AsteroidSize.LARGE]);
            expect(shardManager.getActiveCount()).toBe(0); // All collected
        });

        it('should handle multiple asteroid destructions creating complex shard field', () => {
            const asteroidTypes = [AsteroidSize.LARGE, AsteroidSize.MEDIUM, AsteroidSize.SMALL];
            let expectedShards = 0;
            let expectedScore = 0;

            // Destroy multiple asteroids
            asteroidTypes.forEach((size, index) => {
                const asteroid = asteroidManager.getAsteroid(size, 100 + index * 50, 100);
                asteroidManager.destroyAsteroid(asteroid!, false);

                const shards = shardManager.spawnShardsFromAsteroid(size, 100 + index * 50, 100);
                expectedShards += SHARD_CONFIG.baseYield[size];
                expectedScore += SHARD_CONFIG.baseYield[size] * SHARD_CONFIG.value;
            });

            expect(shardManager.getActiveCount()).toBe(expectedShards);

            // Collect all shards
            gameState.playerPosition = { x: 125, y: 100 }; // Central position
            shardManager.checkCollisions(gameState.playerPosition as any);

            expect(gameState.playerScore).toBe(expectedScore);
            expect(gameState.shardsCollected).toBe(expectedShards);
        });
    });

    describe('Magnetic attraction behavior', () => {
        it('should attract shards when player enters magnetic range', () => {
            const shards = shardManager.spawnShardsFromAsteroid(AsteroidSize.MEDIUM, 100, 100);
            const shard = shards[0];

            // Player outside magnetic range
            gameState.playerPosition = { x: 100 + SHARD_CONFIG.magnetRadius + 10, y: 100 };
            shardManager.update(16, gameState.playerPosition);

            expect(shard.tint).toBe(0x00ffff); // Should be cyan (not attracting)

            // Player enters magnetic range
            gameState.playerPosition = { x: 100 + SHARD_CONFIG.magnetRadius - 10, y: 100 };
            shardManager.update(16, gameState.playerPosition);

            expect(shard.tint).toBe(0xffff00); // Should be yellow (attracting)
        });

        it('should move shards toward player during attraction', () => {
            const shards = shardManager.spawnShardsFromAsteroid(AsteroidSize.SMALL, 100, 100);
            const shard = shards[0];
            const initialX = shard.x;

            // Player to the right, within magnetic range
            gameState.playerPosition = { x: 200, y: 100 };

            // Multiple updates to allow movement
            for (let i = 0; i < 10; i++) {
                shardManager.update(16, gameState.playerPosition);
            }

            // Shard should have moved toward player (rightward)
            expect(shard.x).toBeGreaterThan(initialX);
        });
    });

    describe('Collection precision and timing', () => {
        it('should collect shards only when within collection radius', () => {
            const shards = shardManager.spawnShardsFromAsteroid(AsteroidSize.SMALL, 100, 100);

            // Player just outside collection radius
            gameState.playerPosition = {
                x: 100 + SHARD_CONFIG.collectRadius + 1,
                y: 100
            };
            shardManager.checkCollisions(gameState.playerPosition as any);

            expect(gameState.shardsCollected).toBe(0);
            expect(shardManager.getActiveCount()).toBe(1);

            // Player just inside collection radius
            gameState.playerPosition = {
                x: 100 + SHARD_CONFIG.collectRadius - 1,
                y: 100
            };
            shardManager.checkCollisions(gameState.playerPosition as any);

            expect(gameState.shardsCollected).toBe(1);
            expect(shardManager.getActiveCount()).toBe(0);
        });

        it('should handle rapid successive collections', () => {
            // Create multiple shards close together
            const positions = [
                { x: 100, y: 100 },
                { x: 105, y: 100 },
                { x: 110, y: 100 }
            ];

            positions.forEach(pos => {
                shardManager.spawnShard(pos.x, pos.y);
            });

            expect(shardManager.getActiveCount()).toBe(3);

            // Player moves through all shards
            gameState.playerPosition = { x: 105, y: 100 };
            shardManager.checkCollisions(gameState.playerPosition as any);

            expect(gameState.shardsCollected).toBe(3);
            expect(shardManager.getActiveCount()).toBe(0);
        });
    });

    describe('Shard lifecycle and expiration', () => {
        it('should expire shards after lifespan', () => {
            const shards = shardManager.spawnShardsFromAsteroid(AsteroidSize.SMALL, 100, 100);
            expect(shardManager.getActiveCount()).toBe(1);

            // Simulate time passing beyond lifespan
            shardManager.update(SHARD_CONFIG.lifespanMs + 100, gameState.playerPosition);

            expect(shardManager.getActiveCount()).toBe(0);
            expect(gameState.shardsCollected).toBe(0); // Expired, not collected
        });

        it('should handle mixed collection and expiration scenarios', () => {
            // Create multiple shards at different times
            const shard1 = shardManager.spawnShard(100, 100);

            // Age the first shard significantly
            shard1!.update(SHARD_CONFIG.lifespanMs * 0.9);

            const shard2 = shardManager.spawnShard(200, 100);

            expect(shardManager.getActiveCount()).toBe(2);

            // Collect the newer shard
            gameState.playerPosition = { x: 200, y: 100 };
            shardManager.checkCollisions(gameState.playerPosition as any);

            expect(gameState.shardsCollected).toBe(1);
            expect(shardManager.getActiveCount()).toBe(1);

            // Let the older shard expire
            shard1!.update(SHARD_CONFIG.lifespanMs * 0.2); // Push it over the edge

            expect(shardManager.getActiveCount()).toBe(0);
            expect(gameState.shardsCollected).toBe(1); // Still only one collected
        });
    });

    describe('Performance and capacity limits', () => {
        it('should respect maximum active shard limits', () => {
            // Try to spawn more shards than the limit
            const oversizedYield = SHARD_CONFIG.maxActiveShards + 10;

            for (let i = 0; i < oversizedYield; i++) {
                shardManager.spawnShard(i * 10, 100);
            }

            expect(shardManager.getActiveCount()).toBe(SHARD_CONFIG.maxActiveShards);
            expect(shardManager.isAtCapacity()).toBe(true);
        });

        it('should handle capacity gracefully during asteroid destruction', () => {
            // Fill to near capacity
            const remainingCapacity = 2;
            for (let i = 0; i < SHARD_CONFIG.maxActiveShards - remainingCapacity; i++) {
                shardManager.spawnShard(i, 100);
            }

            // Try to spawn from large asteroid (which would exceed capacity)
            const shards = shardManager.spawnShardsFromAsteroid(AsteroidSize.LARGE, 100, 200);

            expect(shards).toHaveLength(remainingCapacity);
            expect(shardManager.getActiveCount()).toBe(SHARD_CONFIG.maxActiveShards);
        });
    });

    describe('Game progression scenarios', () => {
        it('should handle typical wave clearing scenario', () => {
            // Simulate a wave with mixed asteroid sizes
            const waveAsteroids = [
                { size: AsteroidSize.LARGE, count: 2 },
                { size: AsteroidSize.MEDIUM, count: 3 },
                { size: AsteroidSize.SMALL, count: 5 }
            ];

            let totalExpectedShards = 0;
            let totalExpectedScore = 0;

            waveAsteroids.forEach(({ size, count }) => {
                for (let i = 0; i < count; i++) {
                    const asteroid = asteroidManager.getAsteroid(size, 100 + i * 30, 100);
                    asteroidManager.destroyAsteroid(asteroid!, false);

                    const shards = shardManager.spawnShardsFromAsteroid(size, 100 + i * 30, 100);
                    totalExpectedShards += SHARD_CONFIG.baseYield[size];
                    totalExpectedScore += SHARD_CONFIG.baseYield[size] * SHARD_CONFIG.value;
                }
            });

            expect(shardManager.getActiveCount()).toBe(totalExpectedShards);

            // Player collects all shards
            gameState.playerPosition = { x: 150, y: 100 };
            shardManager.checkCollisions(gameState.playerPosition as any);

            expect(gameState.playerScore).toBe(totalExpectedScore);
            expect(gameState.shardsCollected).toBe(totalExpectedShards);
            expect(shardManager.getActiveCount()).toBe(0);
        });

        it('should handle player death with active shards', () => {
            // Spawn some shards
            shardManager.spawnShardsFromAsteroid(AsteroidSize.LARGE, 100, 100);
            expect(shardManager.getActiveCount()).toBeGreaterThan(0);

            // Simulate player death - clear all shards
            shardManager.clearAllShards();

            expect(shardManager.getActiveCount()).toBe(0);
            expect(gameState.shardsCollected).toBe(0); // No collection during clear
        });
    });
});