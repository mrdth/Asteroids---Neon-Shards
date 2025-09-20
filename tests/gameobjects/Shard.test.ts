import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Shard, ShardData } from '../../src/gameobjects/Shard';
import { SHARD_CONFIG } from '../../src/config/balance';

// Mock Phaser
vi.mock('phaser', () => ({
    Physics: {
        Arcade: {
            Sprite: class MockSprite {
                scene: any;
                x: number = 0;
                y: number = 0;
                width: number = 16;
                height: number = 16;
                rotation: number = 0;
                body: any;
                tint: number = 0xffffff;
                scale: number = 1;
                alpha: number = 1;
                visible: boolean = true;
                active: boolean = true;

                constructor(scene: any, x: number, y: number, texture: string) {
                    this.scene = scene;
                    this.x = x;
                    this.y = y;
                    this.body = {
                        velocity: { x: 0, y: 0 },
                        setSize: vi.fn(),
                        setDrag: vi.fn(),
                        setCollideWorldBounds: vi.fn(),
                        setVelocity: vi.fn((x: number, y: number) => {
                            this.body.velocity.x = x;
                            this.body.velocity.y = y;
                        }),
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

                setOrigin(x: number, y: number) {
                    return this;
                }

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
    }
}));

// Mock scene
const mockScene = {
    add: {
        existing: vi.fn()
    },
    physics: {
        add: {
            existing: vi.fn()
        }
    },
    events: {
        emit: vi.fn()
    }
};

describe('Shard', () => {
    let shard: Shard;

    beforeEach(() => {
        vi.clearAllMocks();
        shard = new Shard(mockScene as any, 100, 100);
    });

    describe('constructor', () => {
        it('should initialize with correct properties', () => {
            expect(shard.x).toBe(100);
            expect(shard.y).toBe(100);
            expect(shard.visible).toBe(false);
            expect(shard.active).toBe(false);
            expect(shard.tint).toBe(0x00ffff); // Cyan
            expect(shard.scale).toBe(0.5);
        });

        it('should add itself to scene and physics', () => {
            expect(mockScene.add.existing).toHaveBeenCalledWith(shard);
            expect(mockScene.physics.add.existing).toHaveBeenCalledWith(shard);
        });
    });

    describe('spawn', () => {
        it('should activate shard with correct properties', () => {
            const config = SHARD_CONFIG;
            const shardId = 42;

            shard.spawn(200, 300, config, shardId);

            expect(shard.getId()).toBe(shardId);
            expect(shard.getValue()).toBe(config.value);
            expect(shard.getIsActive()).toBe(true);
            expect(shard.x).toBe(200);
            expect(shard.y).toBe(300);
            expect(shard.visible).toBe(true);
            expect(shard.active).toBe(true);
        });

        it('should emit shard-spawned event', () => {
            const config = SHARD_CONFIG;

            shard.spawn(200, 300, config, 1);

            expect(mockScene.events.emit).toHaveBeenCalledWith('shard-spawned', {
                shard,
                position: { x: 200, y: 300 },
                value: config.value
            });
        });

        it('should set random initial velocity', () => {
            const config = SHARD_CONFIG;
            const setVelocityMock = vi.fn();
            shard.body.setVelocity = setVelocityMock;

            shard.spawn(200, 300, config, 1);

            expect(setVelocityMock).toHaveBeenCalled();
            const [vx, vy] = setVelocityMock.mock.calls[0];
            const speed = Math.sqrt(vx * vx + vy * vy);
            expect(speed).toBeCloseTo(80, 1); // scatterSpeed = 80
        });
    });

    describe('update', () => {
        beforeEach(() => {
            shard.spawn(100, 100, SHARD_CONFIG, 1);
        });

        it('should reduce time to live', () => {
            const initialLifetime = shard.getRemainingLifetime();
            const dt = 100; // 100ms

            shard.update(dt);

            expect(shard.getRemainingLifetime()).toBe(initialLifetime - dt);
        });

        it('should expire when time to live reaches zero', () => {
            const config = SHARD_CONFIG;
            shard.spawn(100, 100, config, 1);

            // Fast forward past lifespan
            shard.update(config.lifespanMs + 100);

            expect(shard.getIsActive()).toBe(false);
            expect(mockScene.events.emit).toHaveBeenCalledWith('shard-expired', {
                shard,
                position: { x: 100, y: 100 }
            });
        });

        it('should update rotation for animation', () => {
            const initialRotation = shard.rotation;
            const dt = 1000; // 1 second

            shard.update(dt);

            expect(shard.rotation).toBeCloseTo(initialRotation + 2, 1); // 2 radians per second
        });

        it('should fade out as lifespan decreases', () => {
            const config = SHARD_CONFIG;
            shard.spawn(100, 100, config, 1);

            // Update to 20% remaining lifetime (below 30% threshold)
            const remainingTime = config.lifespanMs * 0.2;
            shard.update(config.lifespanMs - remainingTime);

            const expectedAlpha = 0.2 / 0.3; // lifetimePercent / 0.3
            expect(shard.alpha).toBeCloseTo(expectedAlpha, 2);
        });
    });

    describe('magnetic attraction', () => {
        beforeEach(() => {
            shard.spawn(100, 100, SHARD_CONFIG, 1);
        });

        it('should attract to player when within range', () => {
            const playerPosition = { x: 200, y: 100 }; // 100 pixels away
            const magnetRadius = 150;
            const magnetForce = 200;
            const dt = 16; // ~60fps

            shard.update(dt, playerPosition, magnetRadius, magnetForce);

            expect(shard.isAttracting()).toBe(true);
            expect(shard.tint).toBe(0xffff00); // Yellow when attracting
        });

        it('should not attract when outside range', () => {
            const playerPosition = { x: 300, y: 100 }; // 200 pixels away
            const magnetRadius = 150;
            const magnetForce = 200;
            const dt = 16;

            shard.update(dt, playerPosition, magnetRadius, magnetForce);

            expect(shard.isAttracting()).toBe(false);
            expect(shard.tint).toBe(0x00ffff); // Cyan when not attracting
        });

        it('should apply velocity toward player when attracting', () => {
            const playerPosition = { x: 200, y: 100 }; // 100 pixels away (right)
            const magnetRadius = 150;
            const magnetForce = 200;
            const dt = 16;
            const setVelocityMock = vi.fn();

            // Mock current velocity
            shard.body.velocity = { x: 0, y: 0 };
            shard.body.setVelocity = setVelocityMock;

            shard.update(dt, playerPosition, magnetRadius, magnetForce);

            expect(setVelocityMock).toHaveBeenCalled();
            const [vx, vy] = setVelocityMock.mock.calls[0];
            expect(vx).toBeGreaterThan(0); // Should move toward player (positive x direction)
            expect(Math.abs(vy)).toBeLessThan(Math.abs(vx)); // Should be mostly horizontal
        });

        it('should reset tint when leaving attraction range', () => {
            const closePosition = { x: 150, y: 100 }; // Within range
            const farPosition = { x: 300, y: 100 }; // Outside range
            const magnetRadius = 150;
            const magnetForce = 200;
            const dt = 16;

            // First update: enter attraction range
            shard.update(dt, closePosition, magnetRadius, magnetForce);
            expect(shard.tint).toBe(0xffff00); // Yellow

            // Second update: leave attraction range
            shard.update(dt, farPosition, magnetRadius, magnetForce);
            expect(shard.tint).toBe(0x00ffff); // Back to cyan
        });
    });

    describe('collection', () => {
        beforeEach(() => {
            shard.spawn(100, 100, SHARD_CONFIG, 1);
        });

        it('should emit shard-collected event when collected', () => {
            shard.collect();

            expect(mockScene.events.emit).toHaveBeenCalledWith('shard-collected', {
                shard,
                value: SHARD_CONFIG.value,
                position: { x: 100, y: 100 }
            });
        });

        it('should deactivate after collection', () => {
            shard.collect();

            expect(shard.getIsActive()).toBe(false);
            expect(shard.visible).toBe(false);
            expect(shard.active).toBe(false);
        });
    });

    describe('deactivate', () => {
        beforeEach(() => {
            shard.spawn(100, 100, SHARD_CONFIG, 1);
        });

        it('should reset all properties', () => {
            shard.deactivate();

            expect(shard.getIsActive()).toBe(false);
            expect(shard.visible).toBe(false);
            expect(shard.active).toBe(false);
            expect(shard.isAttracting()).toBe(false);
            expect(shard.alpha).toBe(1);
            expect(shard.scale).toBe(0.5);
            expect(shard.tint).toBe(0x00ffff);
            expect(shard.x).toBe(-100);
            expect(shard.y).toBe(-100);
        });

        it('should stop velocity', () => {
            const setVelocityMock = vi.fn();
            shard.body.setVelocity = setVelocityMock;

            shard.deactivate();

            expect(setVelocityMock).toHaveBeenCalledWith(0, 0);
        });
    });

    describe('getters', () => {
        it('should return correct lifetime percentage', () => {
            const config = SHARD_CONFIG;
            shard.spawn(100, 100, config, 1);

            // Use half the lifetime
            shard.update(config.lifespanMs / 2);

            expect(shard.getLifetimePercent()).toBeCloseTo(0.5, 2);
        });

        it('should return correct value and id', () => {
            const config = SHARD_CONFIG;
            const shardId = 123;

            shard.spawn(100, 100, config, shardId);

            expect(shard.getValue()).toBe(config.value);
            expect(shard.getId()).toBe(shardId);
        });
    });
});