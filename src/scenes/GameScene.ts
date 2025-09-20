import * as Phaser from "phaser";
import { PlayerShip } from "../gameobjects/PlayerShip";
import { PLAYER_CONFIG, AsteroidSize } from "../config/balance";
import { AsteroidManager } from "../systems/AsteroidManager";
import { AsteroidSpawner } from "../systems/AsteroidSpawner";
import { Asteroid } from "../gameobjects/Asteroid";

export class GameScene extends Phaser.Scene {
  private playerShip!: PlayerShip;
  private asteroidManager!: AsteroidManager;
  private asteroidSpawner!: AsteroidSpawner;
  private gameLevel: number = 1;

  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void {
    // Load asteroid spritesheet (5 frames: 100%, 80%, 60%, 40%, 20% health)
    this.load.spritesheet(
      "asteroids-large",
      "assets/images/asteroids-spritesheet.png",
      {
        frameWidth: 200,
        frameHeight: 200,
        startFrame: 0,
        endFrame: 4,
      },
    );

    // Use the same spritesheet for different sizes (we'll scale them)
    this.load.spritesheet(
      "asteroids-medium",
      "assets/images/asteroids-spritesheet.png",
      {
        frameWidth: 200,
        frameHeight: 200,
        startFrame: 0,
        endFrame: 4,
      },
    );

    this.load.spritesheet(
      "asteroids-small",
      "assets/images/asteroids-spritesheet.png",
      {
        frameWidth: 200,
        frameHeight: 200,
        startFrame: 0,
        endFrame: 4,
      },
    );
  }

  create(): void {
    // Create player ship at center of screen
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.playerShip = new PlayerShip(this, centerX, centerY, PLAYER_CONFIG);

    // Initialize asteroid systems
    this.asteroidManager = new AsteroidManager(this);
    this.asteroidSpawner = new AsteroidSpawner(this, this.asteroidManager);

    // Set up event listeners for ship events
    this.events.on("ship-destroyed", this.onShipDestroyed, this);
    this.events.on("ship-thrust", this.onShipThrust, this);
    this.events.on("ship-fire", this.onShipFire, this);

    // Set up asteroid event listeners
    this.asteroidManager.on("asteroid-spawned", this.onAsteroidSpawned, this);
    this.asteroidManager.on(
      "asteroid-destroyed",
      this.onAsteroidDestroyed,
      this,
    );
    this.asteroidManager.on("asteroid-split", this.onAsteroidSplit, this);

    // Start the first wave
    this.startWave();

    // Enable gamepad support
    if (this.input.gamepad) {
      this.input.gamepad.once(
        "connected",
        (gamepad: Phaser.Input.Gamepad.Gamepad) => {
          console.log("Gamepad connected:", gamepad.id);
        },
      );
    }

    // Add debug text (can be removed later)
    this.add.text(10, 10, "Asteroids: Neon Shards - Demo", {
      fontSize: "16px",
      color: "#ffffff",
    });

    this.add.text(10, 30, "WASD or Arrow Keys: Move/Turn", {
      fontSize: "12px",
      color: "#cccccc",
    });

    this.add.text(10, 45, "Space or S: Fire (placeholder)", {
      fontSize: "12px",
      color: "#cccccc",
    });

    this.add.text(10, 60, "F: Damage nearest asteroid (test)", {
      fontSize: "12px",
      color: "#cccccc",
    });

    // Add test controls for damaging asteroids
    this.setupTestControls();
  }

  update(time: number, delta: number): void {
    // Update asteroid systems
    this.asteroidManager.update(time, delta);

    // Check for wave completion
    if (this.asteroidManager.getActiveCount() === 0) {
      this.onWaveComplete();
    }
  }

  private onShipDestroyed(): void {
    console.log("Ship destroyed! Respawning...");
    // Later: handle lives, game over, explosion effects, etc.
  }

  private onShipThrust(data: { intensity: number }): void {
    // Later: trigger thrust particle effects, engine sound
    // console.log('Ship thrust:', data.intensity);
  }

  private onShipFire(): void {
    console.log("Ship fired!");
    // Later: create bullet, trigger fire sound/animation
  }

  private startWave(): void {
    const playerPos = { x: this.playerShip.x, y: this.playerShip.y };
    const spawnedAsteroids = this.asteroidSpawner.spawnWaveByLevel(
      this.gameLevel,
      playerPos,
    );

    console.log(
      `Wave ${this.gameLevel} started with ${spawnedAsteroids.length} asteroids`,
    );
  }

  private onWaveComplete(): void {
    console.log(`Wave ${this.gameLevel} completed!`);
    this.gameLevel++;

    // Wait a moment before starting next wave
    this.time.delayedCall(2000, () => {
      this.startWave();
    });
  }

  private onAsteroidSpawned(asteroid: Asteroid): void {
    // console.log('Asteroid spawned:', asteroid.getSize());
  }

  private onAsteroidDestroyed(asteroid: Asteroid): void {
    // console.log('Asteroid destroyed:', asteroid.getSize());
  }

  private onAsteroidSplit(parentAsteroid: Asteroid, splitData: any[]): void {
    console.log(
      `Asteroid split: ${parentAsteroid.getSize()} into ${splitData.length} pieces`,
    );
  }

  /**
   * Get reference to player ship for other systems
   */
  public getPlayerShip(): PlayerShip {
    return this.playerShip;
  }

  /**
   * Get reference to asteroid manager for other systems
   */
  public getAsteroidManager(): AsteroidManager {
    return this.asteroidManager;
  }

  private setupTestControls(): void {
    // Add keyboard listener for testing asteroid damage
    this.input.keyboard?.on("keydown-F", () => {
      this.damageNearestAsteroid();
    });
  }

  private damageNearestAsteroid(): void {
    const playerPos = { x: this.playerShip.x, y: this.playerShip.y };
    const activeAsteroids = this.asteroidManager.getAllActiveAsteroids();

    if (activeAsteroids.length === 0) return;

    // Find nearest asteroid
    let nearestAsteroid = activeAsteroids[0];
    let nearestDistance = Phaser.Math.Distance.Between(
      playerPos.x,
      playerPos.y,
      nearestAsteroid.x,
      nearestAsteroid.y,
    );

    for (let i = 1; i < activeAsteroids.length; i++) {
      const distance = Phaser.Math.Distance.Between(
        playerPos.x,
        playerPos.y,
        activeAsteroids[i].x,
        activeAsteroids[i].y,
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestAsteroid = activeAsteroids[i];
      }
    }

    // Damage the nearest asteroid (25 damage per hit)
    this.asteroidManager.damageAsteroid(nearestAsteroid, 25);
    console.log(
      `Damaged asteroid! Health: ${nearestAsteroid.getHealth()}/${nearestAsteroid.getMaxHealth()}`,
    );
  }

  /**
   * Get reference to player ship for other systems
   */
  public getPlayerShip(): PlayerShip {
    return this.playerShip;
  }

  /**
   * Get reference to asteroid manager for other systems
   */
  public getAsteroidManager(): AsteroidManager {
    return this.asteroidManager;
  }

  /**
   * Get reference to asteroid spawner for other systems
   */
  public getAsteroidSpawner(): AsteroidSpawner {
    return this.asteroidSpawner;
  }
}
