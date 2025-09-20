import * as Phaser from "phaser";
import { Shard, ShardData } from "../gameobjects/Shard";
import { ObjectPool } from "../utils/ObjectPool";
import { ShardConfig, AsteroidSize } from "../config/balance";

export class ShardManager extends Phaser.Events.EventEmitter {
    private shardPool: ObjectPool<Shard>;
    private activeShards: Set<Shard>;
    private maxActiveShards: number;
    private scene: Phaser.Scene;
    private physicsGroup: Phaser.Physics.Arcade.Group;
    private nextShardId: number = 0;
    private config: ShardConfig;
    private readonly onShardCollectedHandler: (event: { shard: Shard; value: number; position: { x: number; y: number } }) => void;
    private readonly onShardExpiredHandler: (event: { shard: Shard; position: { x: number; y: number } }) => void;

    constructor(scene: Phaser.Scene, config: ShardConfig) {
        super();

        this.scene = scene;
        this.config = config;
        this.maxActiveShards = config.maxActiveShards;
        this.activeShards = new Set();

        // Create physics group for shards
        this.physicsGroup = scene.physics.add.group({
            classType: Shard,
            runChildUpdate: false // We'll update manually for better control
        });

        // Create object pool with factory and reset functions
        this.shardPool = new ObjectPool<Shard>(
            () => {
                const shard = new Shard(scene, -100, -100);
                this.physicsGroup.add(shard);
                return shard;
            },
            (shard: Shard) => {
                shard.deactivate();
            },
            undefined, // no activate function needed
            config.maxActiveShards + 10 // Pool size larger than max active for efficiency
        );

        this.onShardCollectedHandler = this.onShardCollected.bind(this);
        this.onShardExpiredHandler = this.onShardExpired.bind(this);

        // Listen for shard events
        scene.events.on("shard-collected", this.onShardCollectedHandler, this);
        scene.events.on("shard-expired", this.onShardExpiredHandler, this);
    }

    public spawnShard(x: number, y: number): Shard | null {
        // Check if we've reached the maximum active shards
        if (this.activeShards.size >= this.maxActiveShards) {
            return null;
        }

        const shard = this.shardPool.get();
        if (shard) {
            shard.spawn(x, y, this.config, this.nextShardId++);
            this.activeShards.add(shard);

            // Emit event for tracking
            this.emit('shard-spawned', shard);
        }

        return shard;
    }

    public spawnShardsFromAsteroid(asteroidSize: AsteroidSize, x: number, y: number): Shard[] {
        const shardCount = this.config.baseYield[asteroidSize];
        const spawnedShards: Shard[] = [];

        for (let i = 0; i < shardCount; i++) {
            // Add slight random offset to prevent all shards spawning in exact same spot
            const offsetRadius = 20; // pixels
            const angle = (Math.PI * 2 * i) / shardCount + Math.random() * 0.5; // Distribute around circle with randomness
            const offsetX = x + Math.cos(angle) * (Math.random() * offsetRadius);
            const offsetY = y + Math.sin(angle) * (Math.random() * offsetRadius);

            const shard = this.spawnShard(offsetX, offsetY);
            if (shard) {
                spawnedShards.push(shard);
            }
        }

        // Emit event for asteroid destruction shard drop
        this.emit('shards-from-asteroid', {
            asteroidSize,
            position: { x, y },
            shardCount: spawnedShards.length
        });

        return spawnedShards;
    }

    public returnShard(shard: Shard): void {
        if (this.activeShards.has(shard)) {
            this.activeShards.delete(shard);
            this.shardPool.return(shard);
        }
    }

    public update(dt: number, playerPosition: { x: number; y: number }): void {
        // Update all active shards with magnetic attraction
        for (const shard of this.activeShards) {
            if (shard.getIsActive()) {
                shard.update(
                    dt,
                    playerPosition,
                    this.config.magnetRadius,
                    this.config.magnetForce
                );
            }
        }
    }

    public checkCollisions(playerShip: Phaser.Physics.Arcade.Sprite): void {
        // Check collision with player for collection
        for (const shard of this.activeShards) {
            if (shard.getIsActive()) {
                const distance = Phaser.Math.Distance.Between(
                    playerShip.x, playerShip.y,
                    shard.x, shard.y
                );

                if (distance <= this.config.collectRadius) {
                    this.collectShard(shard);
                }
            }
        }
    }

    private collectShard(shard: Shard): void {
        if (!shard.getIsActive()) return;

        // Emit collection event with shard data
        this.emit('shard-collected', {
            shard,
            value: shard.getValue(),
            position: { x: shard.x, y: shard.y }
        });

        // Mark shard as collected
        shard.collect();
    }

    private onShardCollected(event: { shard: Shard; value: number; position: { x: number; y: number } }): void {
        this.returnShard(event.shard);
        console.log(`Shard collected! Value: ${event.value}`);
    }

    private onShardExpired(event: { shard: Shard; position: { x: number; y: number } }): void {
        this.returnShard(event.shard);
        console.log("Shard expired and disappeared");
    }

    public getActiveCount(): number {
        return this.activeShards.size;
    }

    public getActiveShards(): Set<Shard> {
        return new Set(this.activeShards);
    }

    public getAllActiveShards(): Shard[] {
        return Array.from(this.activeShards);
    }

    public clearAllShards(): void {
        // Return all active shards to their pool
        const shards = Array.from(this.activeShards);
        shards.forEach(shard => this.returnShard(shard));
    }

    public getPhysicsGroup(): Phaser.Physics.Arcade.Group {
        return this.physicsGroup;
    }

    public getPoolStats(): { poolSize: number; activeCount: number; maxActive: number } {
        return {
            poolSize: this.shardPool.getPoolSize(),
            activeCount: this.activeShards.size,
            maxActive: this.maxActiveShards
        };
    }

    public isAtCapacity(): boolean {
        return this.activeShards.size >= this.maxActiveShards;
    }

    public destroy(): void {
        // Clean up all shards
        this.clearAllShards();

        // Clear pool
        this.shardPool.clear();

        // Destroy physics group
        this.physicsGroup.destroy();

        // Remove all event listeners
        this.removeAllListeners();
        this.scene.events.off("shard-collected", this.onShardCollectedHandler);
        this.scene.events.off("shard-expired", this.onShardExpiredHandler);
    }
}
