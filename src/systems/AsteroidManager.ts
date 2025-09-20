import { ObjectPool } from '../utils/ObjectPool';
import { Asteroid, AsteroidData } from '../gameobjects/Asteroid';
import { AsteroidSize, ASTEROID_SYSTEM_CONFIG } from '../config/balance';

export class AsteroidManager extends Phaser.Events.EventEmitter {
    private scene: Phaser.Scene;
    private pools: Map<AsteroidSize, ObjectPool<Asteroid>>;
    private activeAsteroids: Set<Asteroid>;
    private maxActiveCount: number;
    private physicsGroup: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene) {
        super();

        this.scene = scene;
        this.maxActiveCount = ASTEROID_SYSTEM_CONFIG.maxActiveCount;
        this.activeAsteroids = new Set();
        this.pools = new Map();

        // Create physics group for asteroids
        this.physicsGroup = scene.physics.add.group({
            classType: Asteroid,
            runChildUpdate: true
        });

        // Initialize object pools for each asteroid size
        this.initializePools();
    }

    private initializePools(): void {
        const poolSizes = {
            [AsteroidSize.LARGE]: 8,
            [AsteroidSize.MEDIUM]: 15,
            [AsteroidSize.SMALL]: 25
        };

        for (const size of Object.values(AsteroidSize)) {
            const pool = new ObjectPool<Asteroid>(
                () => new Asteroid(this.scene, 0, 0, size),
                (asteroid: Asteroid) => asteroid.reset(),
                (asteroid: Asteroid) => {
                    this.physicsGroup.add(asteroid);
                },
                poolSizes[size]
            );
            this.pools.set(size, pool);
        }
    }

    public getAsteroid(size: AsteroidSize, x: number, y: number, velocity?: { x: number; y: number }, angularVelocity?: number): Asteroid | null {
        if (this.activeAsteroids.size >= this.maxActiveCount) {
            return null; // Cannot create more asteroids
        }

        const pool = this.pools.get(size);
        if (!pool) {
            console.error(`No pool found for asteroid size: ${size}`);
            return null;
        }

        const asteroid = pool.get();
        asteroid.initialize(x, y, velocity, angularVelocity);
        this.activeAsteroids.add(asteroid);

        // Emit asteroid spawned event
        this.emit('asteroid-spawned', asteroid);

        return asteroid;
    }

    public returnAsteroid(asteroid: Asteroid): void {
        if (!this.activeAsteroids.has(asteroid)) {
            return; // Asteroid not managed by this manager
        }

        this.activeAsteroids.delete(asteroid);
        this.physicsGroup.remove(asteroid);

        const pool = this.pools.get(asteroid.getSize());
        if (pool) {
            pool.return(asteroid);
        }

        // Emit asteroid destroyed event
        this.emit('asteroid-destroyed', asteroid);
    }

    public destroyAsteroid(asteroid: Asteroid, causeSplit: boolean = true): AsteroidData[] {
        if (!this.activeAsteroids.has(asteroid)) {
            return [];
        }

        let splitData: AsteroidData[] = [];

        if (causeSplit) {
            splitData = asteroid.split();

            if (splitData.length > 0) {
                // Emit split event
                this.emit('asteroid-split', asteroid, splitData);
            }
        }

        // Remove the destroyed asteroid
        this.returnAsteroid(asteroid);

        return splitData;
    }

    public createSplitAsteroids(splitData: AsteroidData[]): Asteroid[] {
        const newAsteroids: Asteroid[] = [];

        for (const data of splitData) {
            const asteroid = this.getAsteroid(
                data.size,
                data.position.x,
                data.position.y,
                data.velocity,
                data.angularVelocity
            );

            if (asteroid) {
                newAsteroids.push(asteroid);
            }
        }

        return newAsteroids;
    }

    public update(time: number, delta: number): void {
        // Update all active asteroids
        this.activeAsteroids.forEach(asteroid => {
            asteroid.update(time, delta);
        });
    }

    public getActiveCount(): number {
        return this.activeAsteroids.size;
    }

    public getActiveAsteroids(): Set<Asteroid> {
        return new Set(this.activeAsteroids);
    }

    public getAllActiveAsteroids(): Asteroid[] {
        return Array.from(this.activeAsteroids);
    }

    public getAsteroidsBySize(size: AsteroidSize): Asteroid[] {
        return Array.from(this.activeAsteroids).filter(asteroid => asteroid.getSize() === size);
    }

    public clearAllAsteroids(): void {
        // Return all active asteroids to their pools
        const asteroids = Array.from(this.activeAsteroids);
        asteroids.forEach(asteroid => this.returnAsteroid(asteroid));
    }

    public damageAsteroid(asteroid: Asteroid, damage: number): boolean {
        if (!this.activeAsteroids.has(asteroid)) {
            return false;
        }

        const isDestroyed = asteroid.takeDamage(damage);

        if (isDestroyed) {
            // Handle destruction and splitting
            const splitData = this.destroyAsteroid(asteroid, true);

            // Create split asteroids
            if (splitData.length > 0) {
                this.createSplitAsteroids(splitData);
            }

            return true;
        }

        return false;
    }

    public getPhysicsGroup(): Phaser.Physics.Arcade.Group {
        return this.physicsGroup;
    }

    public getPoolStats(): { [key: string]: { poolSize: number; activeCount: number } } {
        const stats: { [key: string]: { poolSize: number; activeCount: number } } = {};

        for (const [size, pool] of this.pools.entries()) {
            const activeCount = Array.from(this.activeAsteroids).filter(a => a.getSize() === size).length;
            stats[size] = {
                poolSize: pool.getPoolSize(),
                activeCount: activeCount
            };
        }

        return stats;
    }

    public isAtCapacity(): boolean {
        return this.activeAsteroids.size >= this.maxActiveCount;
    }

    public destroy(): void {
        // Clean up all asteroids
        this.clearAllAsteroids();

        // Clear all pools
        this.pools.forEach(pool => pool.clear());
        this.pools.clear();

        // Destroy physics group
        this.physicsGroup.destroy();

        // Remove all event listeners
        this.removeAllListeners();
    }
}