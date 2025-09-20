import * as Phaser from "phaser";
import { PlayerConfig, WeaponConfig } from "../config/balance";
import { InputSystem, IntentInput } from "../systems/InputSystem";
import { MathUtils } from "../utils/MathUtils";
import { ScreenWrap } from "../utils/ScreenWrap";
import { WeaponSystem } from "../systems/WeaponSystem";
import { BulletManager } from "../systems/BulletManager";

export class PlayerShip extends Phaser.Physics.Arcade.Sprite {
  private config: PlayerConfig;
  private inputSystem: InputSystem;
  private gameBounds: Phaser.Geom.Rectangle;
  private weaponSystem!: WeaponSystem;

  // Physics state
  private angularVelocity: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, config: PlayerConfig, weaponConfig: WeaponConfig) {
    // Create a simple triangle sprite for the ship
    const graphics = scene.add.graphics();
    graphics.fillStyle(0xffffff);
    graphics.fillTriangle(16, 0, 0, 32, 32, 32);
    graphics.generateTexture("ship", 32, 32);
    graphics.destroy();

    super(scene, x, y, "ship");

    this.config = config;
    this.inputSystem = new InputSystem(scene);
    this.gameBounds = ScreenWrap.getGameBounds(scene);

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configure physics body
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setDrag(0); // We'll handle friction manually for better control
    body.setMaxVelocity(this.config.maxSpeed);
    body.setCollideWorldBounds(false); // We handle screen wrapping instead

    // Set sprite properties
    this.setOrigin(0.5, 0.5);
    this.setDisplaySize(32, 32);

    // Set initial rotation to point upward (Phaser default is 0 = right)
    this.setRotation(-Math.PI / 2);

    // Initialize weapon system (will be set by GameScene)
    // Note: WeaponSystem needs BulletManager which is created in GameScene

    // Enable game object update
    scene.events.on("update", this.update, this);
  }

  public update(time: number, delta: number): void {
    // Convert delta from milliseconds to seconds for physics calculations
    const dt = delta / 1000;

    // Get input intent
    const intent = this.inputSystem.getIntent();

    // Apply rotation
    this.applyRotation(intent.turn, dt);

    // Apply thrust
    this.applyThrust(intent.thrust, dt);

    // Apply friction
    this.applyFriction(dt);

    // Handle screen wrapping
    ScreenWrap.wrap(this, this.gameBounds);

    // Update weapon system if available
    if (this.weaponSystem) {
      this.weaponSystem.updateWithInput(delta, { x: this.x, y: this.y }, this.rotation, intent);
    }

    // Emit events for audio/VFX
    if (intent.thrust > 0) {
      this.scene.events.emit("ship-thrust", { intensity: intent.thrust });
    }

    // Remove the old ship-fire event as weapon system handles firing now
  }

  private applyThrust(intensity: number, dt: number): void {
    if (intensity <= 0) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Calculate thrust vector based on ship's rotation
    const thrustVector = MathUtils.getThrustVector(
      this.rotation,
      this.config.thrust * intensity * dt,
    );

    // Apply thrust to velocity
    body.setVelocity(
      body.velocity.x + thrustVector.x,
      body.velocity.y + thrustVector.y,
    );

    // Clamp velocity to max speed
    const currentSpeed = MathUtils.magnitude(body.velocity.x, body.velocity.y);
    if (currentSpeed > this.config.maxSpeed) {
      const normalized = MathUtils.normalize(body.velocity.x, body.velocity.y);
      body.setVelocity(
        normalized.x * this.config.maxSpeed,
        normalized.y * this.config.maxSpeed,
      );
    }
  }

  private applyRotation(turnInput: number, dt: number): void {
    if (turnInput === 0) {
      // Apply angular friction when not turning
      this.angularVelocity *= 0.9;
      if (Math.abs(this.angularVelocity) < 0.01) {
        this.angularVelocity = 0;
      }
    } else {
      // Apply turn input to angular velocity
      const turnSpeedRadians = MathUtils.degreesToRadians(
        this.config.turnSpeed,
      );
      this.angularVelocity = turnInput * turnSpeedRadians;
    }

    // Apply angular velocity to rotation
    this.rotation += this.angularVelocity * dt;

    // Normalize rotation to prevent overflow
    while (this.rotation > Math.PI * 2) {
      this.rotation -= Math.PI * 2;
    }
    while (this.rotation < -Math.PI * 2) {
      this.rotation += Math.PI * 2;
    }
  }

  private applyFriction(dt: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    // Apply friction coefficient to velocity
    // Use frame-rate independent friction calculation
    const frictionFactor = Math.pow(this.config.friction, dt * 60); // Normalize to 60 FPS

    body.setVelocity(
      body.velocity.x * frictionFactor,
      body.velocity.y * frictionFactor,
    );

    // Stop very small velocities to prevent infinite tiny movements
    if (Math.abs(body.velocity.x) < 0.1) {
      body.velocity.x = 0;
    }
    if (Math.abs(body.velocity.y) < 0.1) {
      body.velocity.y = 0;
    }
  }

  /**
   * Handle collision with asteroid
   */
  public onCollision(): void {
    this.scene.events.emit("ship-destroyed");
    // For now, just reset position - later this will handle lives/respawn
    this.setPosition(this.gameBounds.width / 2, this.gameBounds.height / 2);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    this.angularVelocity = 0;
    this.setRotation(-Math.PI / 2);
  }

  /**
   * Get current speed for debugging/UI
   */
  public getCurrentSpeed(): number {
    const body = this.body as Phaser.Physics.Arcade.Body;
    return MathUtils.magnitude(body.velocity.x, body.velocity.y);
  }

  /**
   * Get thrust direction vector for particle effects
   */
  public getThrustDirection(): { x: number; y: number } {
    // Return opposite direction of ship's facing for exhaust
    return {
      x: -Math.cos(this.rotation),
      y: -Math.sin(this.rotation),
    };
  }

  /**
   * Set the weapon system for this ship
   */
  public setWeaponSystem(weaponSystem: WeaponSystem): void {
    this.weaponSystem = weaponSystem;
  }

  /**
   * Get the weapon system
   */
  public getWeaponSystem(): WeaponSystem | undefined {
    return this.weaponSystem;
  }

  /**
   * Fire weapon manually (for external systems)
   */
  public fireWeapon(): boolean {
    if (this.weaponSystem && this.weaponSystem.canFire()) {
      const bullet = this.weaponSystem.fire(this.x, this.y, this.rotation);
      return bullet !== null;
    }
    return false;
  }

  /**
   * Get weapon stats for UI
   */
  public getWeaponStats() {
    return this.weaponSystem?.getStats();
  }

  /**
   * Clean up when ship is destroyed
   */
  public destroy(): void {
    this.scene.events.off("update", this.update, this);
    if (this.weaponSystem) {
      this.weaponSystem.destroy();
    }
    super.destroy();
  }
}
