import { AsteroidManager } from './AsteroidManager';
import { Asteroid, AsteroidData } from '../gameobjects/Asteroid';
import { AsteroidSize, ASTEROID_SYSTEM_CONFIG } from '../config/balance';
import { MathUtils } from '../utils/MathUtils';

export interface SpawnWaveConfig {
    count: number;
    sizes?: AsteroidSize[];
    avoidPlayerRadius?: number;
}

export class AsteroidSpawner {
    private scene: Phaser.Scene;
    private asteroidManager: AsteroidManager;
    private safeSpawnRadius: number;
    private screenBounds: Phaser.Geom.Rectangle;

    constructor(scene: Phaser.Scene, asteroidManager: AsteroidManager) {
        this.scene = scene;
        this.asteroidManager = asteroidManager;
        this.safeSpawnRadius = ASTEROID_SYSTEM_CONFIG.safeSpawnRadius;
        this.screenBounds = new Phaser.Geom.Rectangle(0, 0, scene.cameras.main.width, scene.cameras.main.height);
    }

    public spawnWave(config: SpawnWaveConfig, playerPos: { x: number; y: number }): Asteroid[] {
        const { count, sizes = [AsteroidSize.LARGE], avoidPlayerRadius = this.safeSpawnRadius } = config;
        const spawnedAsteroids: Asteroid[] = [];

        for (let i = 0; i < count; i++) {
            // Don't spawn if at capacity
            if (this.asteroidManager.isAtCapacity()) {
                break;
            }

            // Get random size from provided sizes
            const size = sizes[MathUtils.randomInt(0, sizes.length - 1)];

            // Find safe spawn position
            const position = this.findSafeSpawnPosition(playerPos, avoidPlayerRadius);

            if (position) {
                const asteroid = this.asteroidManager.getAsteroid(size, position.x, position.y);
                if (asteroid) {
                    spawnedAsteroids.push(asteroid);
                }
            }
        }

        return spawnedAsteroids;
    }

    public spawnSplits(parentData: AsteroidData, splitData: AsteroidData[]): Asteroid[] {
        // Add small random offset to split positions to prevent overlap
        const spawnOffset = 20;
        const spawnedAsteroids: Asteroid[] = [];

        for (const data of splitData) {
            // Don't spawn if at capacity
            if (this.asteroidManager.isAtCapacity()) {
                break;
            }

            // Add random offset to spawn position
            const offsetAngle = Math.random() * Math.PI * 2;
            const offsetDistance = MathUtils.randomFloat(5, spawnOffset);
            const spawnX = data.position.x + Math.cos(offsetAngle) * offsetDistance;
            const spawnY = data.position.y + Math.sin(offsetAngle) * offsetDistance;

            const asteroid = this.asteroidManager.getAsteroid(
                data.size,
                spawnX,
                spawnY,
                data.velocity,
                data.angularVelocity
            );

            if (asteroid) {
                spawnedAsteroids.push(asteroid);
            }
        }

        return spawnedAsteroids;
    }

    public spawnAtEdge(size: AsteroidSize, playerPos: { x: number; y: number }): Asteroid | null {
        if (this.asteroidManager.isAtCapacity()) {
            return null;
        }

        const position = this.findEdgeSpawnPosition(playerPos);
        if (!position) {
            return null;
        }

        return this.asteroidManager.getAsteroid(size, position.x, position.y);
    }

    public spawnRandom(size: AsteroidSize, playerPos: { x: number; y: number }, avoidRadius?: number): Asteroid | null {
        if (this.asteroidManager.isAtCapacity()) {
            return null;
        }

        const position = this.findSafeSpawnPosition(playerPos, avoidRadius);
        if (!position) {
            return null;
        }

        return this.asteroidManager.getAsteroid(size, position.x, position.y);
    }

    private findSafeSpawnPosition(playerPos: { x: number; y: number }, avoidRadius: number = this.safeSpawnRadius): { x: number; y: number } | null {
        const maxAttempts = 20;
        let attempts = 0;

        while (attempts < maxAttempts) {
            const x = MathUtils.randomFloat(0, this.screenBounds.width);
            const y = MathUtils.randomFloat(0, this.screenBounds.height);

            // Check distance from player
            const distanceToPlayer = MathUtils.distance(x, y, playerPos.x, playerPos.y);

            if (distanceToPlayer >= avoidRadius) {
                // Check if position overlaps with existing asteroids
                if (!this.isPositionOccupied(x, y, 50)) {
                    return { x, y };
                }
            }

            attempts++;
        }

        // If we can't find a safe position, spawn at screen edge
        return this.findEdgeSpawnPosition(playerPos);
    }

    private findEdgeSpawnPosition(playerPos: { x: number; y: number }): { x: number; y: number } | null {
        const margin = 50;
        const edge = MathUtils.randomInt(0, 3); // 0: top, 1: right, 2: bottom, 3: left

        let x: number;
        let y: number;

        switch (edge) {
            case 0: // Top
                x = MathUtils.randomFloat(0, this.screenBounds.width);
                y = -margin;
                break;
            case 1: // Right
                x = this.screenBounds.width + margin;
                y = MathUtils.randomFloat(0, this.screenBounds.height);
                break;
            case 2: // Bottom
                x = MathUtils.randomFloat(0, this.screenBounds.width);
                y = this.screenBounds.height + margin;
                break;
            case 3: // Left
                x = -margin;
                y = MathUtils.randomFloat(0, this.screenBounds.height);
                break;
            default:
                return null;
        }

        // Ensure minimum distance from player
        const distanceToPlayer = MathUtils.distance(x, y, playerPos.x, playerPos.y);
        if (distanceToPlayer < this.safeSpawnRadius) {
            // Try opposite edge
            switch (edge) {
                case 0:
                    y = this.screenBounds.height + margin;
                    break;
                case 1:
                    x = -margin;
                    break;
                case 2:
                    y = -margin;
                    break;
                case 3:
                    x = this.screenBounds.width + margin;
                    break;
            }
        }

        return { x, y };
    }

    private isPositionOccupied(x: number, y: number, checkRadius: number): boolean {
        const activeAsteroids = this.asteroidManager.getAllActiveAsteroids();

        for (const asteroid of activeAsteroids) {
            const distance = MathUtils.distance(x, y, asteroid.x, asteroid.y);
            if (distance < checkRadius) {
                return true;
            }
        }

        return false;
    }

    public canSpawn(): boolean {
        return !this.asteroidManager.isAtCapacity();
    }

    public getRemainingCapacity(): number {
        return ASTEROID_SYSTEM_CONFIG.maxActiveCount - this.asteroidManager.getActiveCount();
    }

    public updateScreenBounds(): void {
        this.screenBounds.width = this.scene.cameras.main.width;
        this.screenBounds.height = this.scene.cameras.main.height;
    }

    public setSafeSpawnRadius(radius: number): void {
        this.safeSpawnRadius = radius;
    }

    public getSafeSpawnRadius(): number {
        return this.safeSpawnRadius;
    }

    public getScreenBounds(): Phaser.Geom.Rectangle {
        return this.screenBounds;
    }

    public spawnWaveByLevel(level: number, playerPos: { x: number; y: number }): Asteroid[] {
        // Calculate wave configuration based on level
        const baseCount = Math.min(3 + level, 8);
        const largeCount = Math.min(Math.floor(level / 2) + 1, 4);
        const mediumCount = Math.max(0, baseCount - largeCount);

        const sizes: AsteroidSize[] = [];

        // Add large asteroids
        for (let i = 0; i < largeCount; i++) {
            sizes.push(AsteroidSize.LARGE);
        }

        // Add medium asteroids
        for (let i = 0; i < mediumCount; i++) {
            sizes.push(AsteroidSize.MEDIUM);
        }

        // For higher levels, add some small asteroids
        if (level > 5) {
            const smallCount = Math.min(level - 5, 3);
            for (let i = 0; i < smallCount; i++) {
                sizes.push(AsteroidSize.SMALL);
            }
        }

        return this.spawnWave({ count: sizes.length, sizes }, playerPos);
    }
}