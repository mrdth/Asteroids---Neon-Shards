import * as Phaser from "phaser";
import { ShardConfig } from "../config/balance";
import { MathUtils } from "../utils/MathUtils";

export interface ShardData {
  id: number;
  value: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  timeToLive: number;
}

export class Shard extends Phaser.Physics.Arcade.Sprite {
  private value = 0;
  private timeToLive = 0;
  private initialLifetime = 0;
  private isActive = false;
  private shardId = 0;
  private isBeingAttracted = false;
  private attractionTarget: { x: number; y: number } | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "shard-neon");

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configure physics body
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(false);

    // Scale down the shard and set physics body to match
    this.setScale(0.5); // Adjust based on actual sprite size
    body.setSize(16, 16);
    body.setDrag(50); // Add some drag for natural feel

    // Set sprite properties
    this.setOrigin(0.5, 0.5);
    this.setVisible(false);
    this.setActive(false);

    // Add a subtle glow effect (will be enhanced with postFX later)
    this.setTint(0x00ffff); // Neon cyan color
  }

  public spawn(x: number, y: number, config: ShardConfig, id = 0): void {
    this.shardId = id;
    this.value = config.value;
    this.timeToLive = config.lifespanMs;
    this.initialLifetime = config.lifespanMs;
    this.isActive = true;
    this.isBeingAttracted = false;
    this.attractionTarget = null;

    // Set position
    this.setPosition(x, y);

    // Give shard initial random velocity for scatter effect
    const scatterSpeed = 80; // pixels/second
    const angle = Math.random() * Math.PI * 2;
    const velocity = {
      x: Math.cos(angle) * scatterSpeed,
      y: Math.sin(angle) * scatterSpeed,
    };

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(velocity.x, velocity.y);

    // Make visible and active
    this.setVisible(true);
    this.setActive(true);

    // Start with slight rotation
    this.setRotation(Math.random() * Math.PI * 2);

    // Emit shard spawned event
    this.scene.events.emit("shard-spawned", {
      shard: this,
      position: { x, y },
      value: this.value,
    });
  }

  public update(
    dt: number,
    playerPosition?: { x: number; y: number },
    magnetRadius?: number,
    magnetForce?: number
  ): void {
    if (!this.isActive) return;

    // Update lifetime
    this.timeToLive -= dt;

    // Check if shard has expired
    if (this.timeToLive <= 0) {
      this.expire();
      return;
    }

    // Handle magnetic attraction to player
    if (playerPosition && magnetRadius && magnetForce) {
      this.handleMagneticAttraction(playerPosition, magnetRadius, magnetForce, dt);
    }

    // Add subtle rotation animation
    this.rotation += (dt / 1000) * 2; // 2 radians per second

    // Add fade effect as shard approaches expiration
    const lifetimePercent = this.getLifetimePercent();
    if (lifetimePercent < 0.3) {
      // Start fading when 30% lifetime remains
      const alpha = lifetimePercent / 0.3;
      this.setAlpha(alpha);
    }

    // Add pulsing glow effect
    const pulseScale = 0.5 + 0.1 * Math.sin(Date.now() / 200 + this.shardId);
    this.setScale(pulseScale);
  }

  private handleMagneticAttraction(
    playerPosition: { x: number; y: number },
    magnetRadius: number,
    magnetForce: number,
    dt: number
  ): void {
    const distance = MathUtils.distance(this.x, this.y, playerPosition.x, playerPosition.y);

    if (distance <= magnetRadius) {
      this.isBeingAttracted = true;
      this.attractionTarget = playerPosition;

      // Calculate attraction force vector
      const forceVector = MathUtils.normalize(playerPosition.x - this.x, playerPosition.y - this.y);

      // Apply force proportional to distance (closer = stronger attraction)
      const forceMultiplier = 1 - distance / magnetRadius;
      const scaledForce = magnetForce * forceMultiplier;

      const body = this.body as Phaser.Physics.Arcade.Body;

      // Apply velocity directly toward player for immediate attraction effect
      const attractionVelocity = {
        x: forceVector.x * scaledForce,
        y: forceVector.y * scaledForce,
      };

      // Blend with existing velocity to maintain smooth movement
      const currentVel = body.velocity;
      const blendFactor = 0.7; // How much to favor attraction vs current velocity

      body.setVelocity(
        currentVel.x * (1 - blendFactor) + attractionVelocity.x * blendFactor,
        currentVel.y * (1 - blendFactor) + attractionVelocity.y * blendFactor
      );

      // Change tint to indicate attraction
      this.setTint(0xffff00); // Yellow when being attracted
    } else {
      if (this.isBeingAttracted) {
        this.isBeingAttracted = false;
        this.attractionTarget = null;

        // Reset tint
        this.setTint(0x00ffff); // Back to cyan
      }
    }
  }

  public getValue(): number {
    return this.value;
  }

  public getId(): number {
    return this.shardId;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getRemainingLifetime(): number {
    return this.timeToLive;
  }

  public getLifetimePercent(): number {
    return this.timeToLive / this.initialLifetime;
  }

  public isAttracting(): boolean {
    return this.isBeingAttracted;
  }

  public collect(): void {
    this.scene.events.emit("shard-collected", {
      shard: this,
      value: this.value,
      position: { x: this.x, y: this.y },
    });

    this.deactivate();
  }

  public deactivate(): void {
    this.isActive = false;
    this.setVisible(false);
    this.setActive(false);
    this.isBeingAttracted = false;
    this.attractionTarget = null;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);

    // Reset properties
    this.setAlpha(1);
    this.setScale(0.5);
    this.setTint(0x00ffff);

    // Move off-screen to prevent collisions
    this.setPosition(-100, -100);
  }

  private expire(): void {
    this.scene.events.emit("shard-expired", {
      shard: this,
      position: { x: this.x, y: this.y },
    });

    this.deactivate();
  }
}
