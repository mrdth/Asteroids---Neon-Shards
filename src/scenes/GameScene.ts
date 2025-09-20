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
    // For now, the ship texture is generated procedurally in PlayerShip
    // Later we can load actual sprite assets here
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
    this.asteroidManager.on("asteroid-destroyed", this.onAsteroidDestroyed, this);
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
    this.add.text(10, 10, "Player Ship Controls Demo", {
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
    const spawnedAsteroids = this.asteroidSpawner.spawnWaveByLevel(this.gameLevel, playerPos);

    console.log(`Wave ${this.gameLevel} started with ${spawnedAsteroids.length} asteroids`);
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
    console.log(`Asteroid split: ${parentAsteroid.getSize()} into ${splitData.length} pieces`);
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
