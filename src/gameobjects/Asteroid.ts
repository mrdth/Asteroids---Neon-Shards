import {ASTEROID_CONFIGS, AsteroidConfig, AsteroidSize,} from "../config/balance";
import {ScreenWrap} from "../utils/ScreenWrap";
import {MathUtils} from "../utils/MathUtils";

export interface AsteroidData {
  id: number;
  size: AsteroidSize;
  health: number;
  maxHealth: number;
  velocity: { x: number; y: number };
  angularVelocity: number;
  position: { x: number; y: number };
}

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
  private config: AsteroidConfig;
  private currentHealth: number;
  private maxHealth: number;
  private size: AsteroidSize;
  private lastDamageFrame = 0;
  private isActive = false;
  private id: number;
  private static nextId = 1;

  constructor(
    scene: Phaser.Scene,
    x = 0,
    y = 0,
    size: AsteroidSize = AsteroidSize.LARGE
  ) {
    super(scene, x, y, `asteroids-${size}`, 0); // Start with frame 0 (100% health)

    this.id = Asteroid.nextId++;
    this.size = size;
    this.config = ASTEROID_CONFIGS[size];
    this.maxHealth = this.config.health;
    this.currentHealth = this.maxHealth;
    this.isActive = true;

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configure physics body
    this.setupPhysicsBody();

    // Initialize visual properties
    this.setScale(this.config.scale);
    this.setOrigin(0.5, 0.5);
    this.setActive(true);
    this.setVisible(true);
  }

  private setupPhysicsBody(): void {
    if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) {
      // Use circle collision for more accurate asteroid physics
      const radius = ((this.width * this.config.scale) / 2) * 0.9; // Slightly smaller for better gameplay
      this.body.setCircle(radius);

      // Ensure the body doesn't get pushed around by other objects
      this.body.setBounce(1);
      this.body.setCollideWorldBounds(false); // We handle wrapping manually
    }
  }

  public initialize(
    x: number,
    y: number,
    velocity?: { x: number; y: number },
    angularVelocity?: number
  ): void {
    this.setPosition(x, y);
    this.currentHealth = this.maxHealth;
    this.lastDamageFrame = 0;
    this.isActive = true;

    // Set random velocity if not provided
    if (velocity) {
      this.body!.setVelocity(velocity.x, velocity.y);
    } else {
      this.setRandomVelocity();
    }

    // Set random angular velocity if not provided
    if (angularVelocity !== undefined) {
      this.body!.setAngularVelocity(angularVelocity);
    } else {
      this.setRandomAngularVelocity();
    }

    // Reset visual state
    this.setVisible(true);
    this.setActive(true);
    this.updateDamageFrame();
  }

  private setRandomVelocity(): void {
    const angle = Math.random() * Math.PI * 2;
    const speed = this.config.speed;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    this.body!.setVelocity(vx, vy);
  }

  private setRandomAngularVelocity(): void {
    const [minSpin, maxSpin] = this.config.spinRange;
    const angularVel = MathUtils.randomFloat(minSpin, maxSpin);
    this.body!.setAngularVelocity(angularVel);
  }

  public takeDamage(damage: number): boolean {
    if (!this.isActive) return false;

    this.currentHealth -= damage;
    this.updateDamageFrame();

    if (this.currentHealth <= 0) {
      this.currentHealth = 0;
      return true; // Asteroid is destroyed
    }

    return false;
  }

  public split(): AsteroidData[] {
    if (!this.isActive || this.size === AsteroidSize.SMALL) {
      return [];
    }

    const nextSize = this.getNextSmallerSize();
    const [minSplits, maxSplits] = this.config.splitCount;
    const splitCount = MathUtils.randomInt(minSplits, maxSplits);

    const splitData: AsteroidData[] = [];
    const velocities = this.calculateSplitVelocities(splitCount);

    for (let i = 0; i < splitCount; i++) {
      splitData.push({
        id: Asteroid.nextId++,
        size: nextSize,
        health: ASTEROID_CONFIGS[nextSize].health,
        maxHealth: ASTEROID_CONFIGS[nextSize].health,
        velocity: velocities[i],
        angularVelocity: MathUtils.randomFloat(-60, 60),
        position: {x: this.x, y: this.y},
      });
    }

    return splitData;
  }

  private getNextSmallerSize(): AsteroidSize {
    switch (this.size) {
      case AsteroidSize.LARGE:
        return AsteroidSize.MEDIUM;
      case AsteroidSize.MEDIUM:
        return AsteroidSize.SMALL;
      default:
        return AsteroidSize.SMALL; // Small asteroids don't split
    }
  }

  private calculateSplitVelocities(count: number): { x: number; y: number }[] {
    const velocities: { x: number; y: number }[] = [];
    const currentVel = this.body!.velocity;
    const parentSpeed = Math.sqrt(currentVel.x * currentVel.x + currentVel.y * currentVel.y);

    // Inherit some velocity from parent, add randomization
    const inheritanceFactor = 0.3;
    const randomFactor = 0.7;

    for (let i = 0; i < count; i++) {
      // Create random direction
      const angle = (Math.PI * 2 * i) / count + MathUtils.randomFloat(-0.5, 0.5);

      // Combine inherited and random velocity
      const inheritedVel = {
        x: currentVel.x * inheritanceFactor,
        y: currentVel.y * inheritanceFactor,
      };

      const randomSpeed = parentSpeed * randomFactor * MathUtils.randomFloat(0.5, 1.5);
      const randomVel = {
        x: Math.cos(angle) * randomSpeed,
        y: Math.sin(angle) * randomSpeed,
      };

      velocities.push({
        x: inheritedVel.x + randomVel.x,
        y: inheritedVel.y + randomVel.y,
      });
    }

    return velocities;
  }

  public update(): void {
    if (!this.isActive) return;

    // Handle screen wrapping
    const bounds = ScreenWrap.getGameBounds(this.scene);
    ScreenWrap.wrap(this, bounds);
  }

  private updateDamageFrame(): void {
    const healthPercent = this.currentHealth / this.maxHealth;
    let newFrame = 0;

    // Map health percentage to sprite frames
    // 100% = frame 0, 80% = frame 1, 60% = frame 2, 40% = frame 3, 20% = frame 4
    if (healthPercent > 0.8) {
      newFrame = 0; // 100% health
    } else if (healthPercent > 0.6) {
      newFrame = 1; // 80% health
    } else if (healthPercent > 0.4) {
      newFrame = 2; // 60% health
    } else if (healthPercent > 0.2) {
      newFrame = 3; // 40% health
    } else {
      newFrame = 4; // 20% health or less
    }

    // Update frame if it changed
    if (newFrame !== this.lastDamageFrame) {
      this.setFrame(newFrame);
      this.lastDamageFrame = newFrame;
    }
  }

  public reset(): void {
    this.isActive = false;
    this.setVisible(false);
    this.setActive(false);
    this.currentHealth = this.maxHealth;
    this.lastDamageFrame = 0;

    // Reset to full health frame
    this.setFrame(0);

    // Reset physics
    if (this.body) {
      this.body.setVelocity(0, 0);
      this.body.setAngularVelocity(0);
    }
  }

  public destroy(): void {
    super.destroy();
  }

  public getData(): AsteroidData {
    return {
      id: this.id,
      size: this.size,
      health: this.currentHealth,
      maxHealth: this.maxHealth,
      velocity: {x: this.body!.velocity.x, y: this.body!.velocity.y},
      angularVelocity: this.body!.angularVelocity,
      position: {x: this.x, y: this.y},
    };
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getSize(): AsteroidSize {
    return this.size;
  }

  public getId(): number {
    return this.id;
  }

  public getHealth(): number {
    return this.currentHealth;
  }

  public getMaxHealth(): number {
    return this.maxHealth;
  }
}
