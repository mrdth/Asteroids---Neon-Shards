import * as Phaser from "phaser";
import { PlayerShip } from "../gameobjects/PlayerShip";
import { PLAYER_CONFIG, AsteroidSize, WEAPON_CONFIG } from "../config/balance";
import { AsteroidManager } from "../systems/AsteroidManager";
import { AsteroidSpawner } from "../systems/AsteroidSpawner";
import { Asteroid } from "../gameobjects/Asteroid";
import { BulletManager } from "../systems/BulletManager";
import { WeaponSystem } from "../systems/WeaponSystem";

export class GameScene extends Phaser.Scene {
  private playerShip!: PlayerShip;
  private asteroidManager!: AsteroidManager;
  private asteroidSpawner!: AsteroidSpawner;
  private bulletManager!: BulletManager;
  private weaponSystem!: WeaponSystem;
  private gameLevel: number = 1;
  private playerLives: number = 3;
  private invulnerabilityTime: number = 0;
  private livesText!: Phaser.GameObjects.Text;
  private waveInProgress: boolean = false;

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

    // Load weapon assets
    this.load.image("bullet-neon", "assets/sprites/bullet-neon.png");
    this.load.audio("laser-shot", "assets/audio/laser-shot.ogg");
  }

  create(): void {
    // Create player ship at center of screen
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Initialize weapon systems first
    this.bulletManager = new BulletManager(this, WEAPON_CONFIG.maxActiveBullets);
    this.weaponSystem = new WeaponSystem(this, this.bulletManager, WEAPON_CONFIG);

    // Create player ship with weapon config
    this.playerShip = new PlayerShip(this, centerX, centerY, PLAYER_CONFIG, WEAPON_CONFIG);
    this.playerShip.setWeaponSystem(this.weaponSystem);

    // Initialize asteroid systems
    this.asteroidManager = new AsteroidManager(this);
    this.asteroidSpawner = new AsteroidSpawner(this, this.asteroidManager);

    // Set up event listeners for ship events
    this.events.on("ship-destroyed", this.onShipDestroyed, this);
    this.events.on("ship-thrust", this.onShipThrust, this);

    // Set up weapon event listeners
    this.events.on("weapon-fired", this.onWeaponFired, this);
    this.events.on("bullet-asteroid-collision", this.onBulletAsteroidCollision, this);

    // Set up asteroid event listeners
    this.asteroidManager.on("asteroid-spawned", this.onAsteroidSpawned, this);
    this.asteroidManager.on(
      "asteroid-destroyed",
      this.onAsteroidDestroyed,
      this,
    );
    this.asteroidManager.on("asteroid-split", this.onAsteroidSplit, this);

    // Set up collision detection
    this.setupCollisions();

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

    this.add.text(10, 45, "Space or S: Fire weapon (4 shots/sec)", {
      fontSize: "12px",
      color: "#cccccc",
    });

    this.add.text(10, 75, "Weapon System: ACTIVE - Bullets damage asteroids", {
      fontSize: "12px",
      color: "#00ff00",
    });

    // Add lives display
    this.livesText = this.add.text(10, 95, `Lives: ${this.playerLives}`, {
      fontSize: "16px",
      color: "#ffffff",
    });
  }

  update(time: number, delta: number): void {
    // Update weapon systems
    this.bulletManager.update(delta);

    // Update asteroid systems
    this.asteroidManager.update(time, delta);

    // Check bullet-asteroid collisions
    this.bulletManager.checkCollisions(this.asteroidManager.getAllActiveAsteroids());

    // Update invulnerability time
    if (this.invulnerabilityTime > 0) {
      this.invulnerabilityTime -= delta;

      // Flash the ship during invulnerability
      const flashRate = 200; // milliseconds
      this.playerShip.setVisible(Math.floor(time / flashRate) % 2 === 0);
    } else {
      this.playerShip.setVisible(true);
    }

    // Check for wave completion (only if wave is in progress)
    if (this.waveInProgress && this.asteroidManager.getActiveCount() === 0) {
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

  private onWeaponFired(event: { position: { x: number; y: number }; angle: number; bullet: any }): void {
    console.log("Weapon fired!");
    // Later: trigger fire sound/animation, muzzle flash
  }

  private onBulletAsteroidCollision(event: { bullet: any; asteroid: any; damage: number; position: { x: number; y: number } }): void {
    // Apply damage to asteroid
    const isDestroyed = this.asteroidManager.damageAsteroid(event.asteroid, event.damage);

    if (isDestroyed) {
      console.log(`Asteroid destroyed by bullet! Damage: ${event.damage}`);
    } else {
      console.log(`Asteroid hit! Damage: ${event.damage}, Health: ${event.asteroid.getHealth()}/${event.asteroid.getMaxHealth()}`);
    }
  }

  private startWave(): void {
    const playerPos = { x: this.playerShip.x, y: this.playerShip.y };
    const spawnedAsteroids = this.asteroidSpawner.spawnWaveByLevel(
      this.gameLevel,
      playerPos,
    );

    // Mark wave as in progress
    this.waveInProgress = true;

    console.log(
      `Wave ${this.gameLevel} started with ${spawnedAsteroids.length} asteroids`,
    );
  }

  private onWaveComplete(): void {
    console.log(`Wave ${this.gameLevel} completed!`);

    // Mark wave as no longer in progress to prevent multiple completions
    this.waveInProgress = false;

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

  private setupCollisions(): void {
    // Set up collision between player ship and asteroids
    this.physics.add.overlap(
      this.playerShip,
      this.asteroidManager.getPhysicsGroup(),
      this.handleShipAsteroidCollision,
      undefined,
      this
    );

    // Note: Bullet-asteroid collisions are handled manually in BulletManager.checkCollisions()
    // This provides better control over collision timing and damage application
  }

  private handleShipAsteroidCollision(
    ship: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    asteroid: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ): void {
    // Don't process collision if ship is invulnerable
    if (this.invulnerabilityTime > 0) {
      return;
    }

    const asteroidObj = asteroid as Asteroid;

    console.log(`Ship collided with ${asteroidObj.getSize()} asteroid!`);

    // Damage the asteroid on collision
    const collisionDamage = 30;
    const isDestroyed = this.asteroidManager.damageAsteroid(asteroidObj, collisionDamage);

    if (isDestroyed) {
      console.log(`Asteroid destroyed by collision!`);
    }

    // Damage the ship
    this.damageShip();
  }

  private damageShip(): void {
    this.playerLives--;
    this.livesText.setText(`Lives: ${this.playerLives}`);

    // Grant invulnerability for 2 seconds
    this.invulnerabilityTime = 2000;

    console.log(`Ship took damage! Lives remaining: ${this.playerLives}`);

    if (this.playerLives <= 0) {
      this.gameOver();
    } else {
      // Push ship away from center to avoid immediate re-collision
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;
      this.playerShip.setPosition(centerX, centerY);
      this.playerShip.body!.setVelocity(0, 0);
    }
  }

  private gameOver(): void {
    console.log("Game Over!");

    // Display game over text
    this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "GAME OVER\nPress R to Restart",
      {
        fontSize: "32px",
        color: "#ff0000",
        align: "center"
      }
    ).setOrigin(0.5);

    // Pause the game
    this.physics.pause();

    // Add restart functionality
    this.input.keyboard?.once('keydown-R', () => {
      this.scene.restart();
    });
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

  /**
   * Get reference to bullet manager for other systems
   */
  public getBulletManager(): BulletManager {
    return this.bulletManager;
  }

  /**
   * Get reference to weapon system for other systems
   */
  public getWeaponSystem(): WeaponSystem {
    return this.weaponSystem;
  }
}
