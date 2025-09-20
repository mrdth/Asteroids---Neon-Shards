import * as Phaser from "phaser";
import { WeaponConfig } from "../config/balance";
import { ScreenWrap } from "../utils/ScreenWrap";

export interface BulletData {
  id: number;
  damage: number;
  velocity: { x: number; y: number };
  timeToLive: number;
  ownerId: string;
}

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  private damage = 0;
  private timeToLive = 0;
  private initialLifetime = 0;
  private isActive = false;
  private gameBounds: Phaser.Geom.Rectangle;
  private bulletId = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bullet-neon");

    this.gameBounds = ScreenWrap.getGameBounds(scene);

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configure physics body - adjust size based on actual sprite (48x48 but scale it down)
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(false);
    // Scale down the bullet and set physics body to match
    this.setScale(0.25); // Scale 48x48 down to 12x12
    body.setSize(12, 12);

    // Set sprite properties
    this.setOrigin(0.5, 0.5);
    this.setVisible(false);
    this.setActive(false);
  }

  public fire(x: number, y: number, angle: number, config: WeaponConfig, id = 0): void {
    this.bulletId = id;
    this.damage = config.bulletDamage;
    this.timeToLive = config.bulletLifetimeMs;
    this.initialLifetime = config.bulletLifetimeMs;
    this.isActive = true;

    // Set position
    this.setPosition(x, y);
    this.setRotation(angle);

    // Calculate velocity from angle and speed
    const velocity = this.calculateVelocity(angle, config.bulletSpeed);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(velocity.x, velocity.y);

    // Make visible and active
    this.setVisible(true);
    this.setActive(true);

    // Emit bullet fired event
    this.scene.events.emit("bullet-fired", {
      bullet: this,
      position: { x, y },
      angle,
      damage: this.damage,
    });
  }

  public update(dt: number): void {
    if (!this.isActive) return;

    // Update lifetime
    this.timeToLive -= dt;

    // Check if bullet has expired
    if (this.timeToLive <= 0) {
      this.expire();
      return;
    }

    // Handle screen wrapping
    ScreenWrap.wrap(this, this.gameBounds);
  }

  public getDamage(): number {
    return this.damage;
  }

  public getId(): number {
    return this.bulletId;
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

  public deactivate(): void {
    this.isActive = false;
    this.setVisible(false);
    this.setActive(false);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);

    // Move off-screen to prevent collisions
    this.setPosition(-100, -100);
  }

  public onHit(): void {
    this.scene.events.emit("bullet-hit", {
      bullet: this,
      damage: this.damage,
      position: { x: this.x, y: this.y },
    });

    this.deactivate();
  }

  private expire(): void {
    this.scene.events.emit("bullet-expired", {
      bullet: this,
      position: { x: this.x, y: this.y },
    });

    this.deactivate();
  }

  private calculateVelocity(angle: number, speed: number): { x: number; y: number } {
    return {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };
  }
}
