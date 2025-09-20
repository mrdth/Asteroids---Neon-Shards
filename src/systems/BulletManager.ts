import * as Phaser from "phaser";
import { Bullet } from "../gameobjects/Bullet";
import { ObjectPool } from "../utils/ObjectPool";
import { WeaponConfig } from "../config/balance";
import { Asteroid } from "../gameobjects/Asteroid";

export class BulletManager {
  private bulletPool: ObjectPool<Bullet>;
  private activeBullets: Set<Bullet>;
  private maxActiveBullets: number;
  private scene: Phaser.Scene;
  private physicsGroup: Phaser.Physics.Arcade.Group;
  private nextBulletId = 0;

  constructor(scene: Phaser.Scene, maxBullets = 15) {
    this.scene = scene;
    this.maxActiveBullets = maxBullets;
    this.activeBullets = new Set();

    // Create physics group for bullets
    this.physicsGroup = scene.physics.add.group();

    // Create object pool with factory and reset functions
    this.bulletPool = new ObjectPool<Bullet>(
      () => {
        const bullet = new Bullet(scene, -100, -100);
        this.physicsGroup.add(bullet);
        return bullet;
      },
      (bullet: Bullet) => {
        bullet.deactivate();
      },
      undefined, // no activate function needed
      maxBullets * 2 // Pool size larger than max active for efficiency
    );

    // Listen for bullet events
    scene.events.on("bullet-hit", this.onBulletHit, this);
    scene.events.on("bullet-expired", this.onBulletExpired, this);
  }

  public getBullet(): Bullet | null {
    // Check if we've reached the maximum active bullets
    if (this.activeBullets.size >= this.maxActiveBullets) {
      return null;
    }

    const bullet = this.bulletPool.get();
    if (bullet) {
      this.activeBullets.add(bullet);
    }

    return bullet;
  }

  public fireBullet(x: number, y: number, angle: number, config: WeaponConfig): Bullet | null {
    const bullet = this.getBullet();
    if (!bullet) {
      return null;
    }

    bullet.fire(x, y, angle, config, this.nextBulletId++);
    return bullet;
  }

  public returnBullet(bullet: Bullet): void {
    if (this.activeBullets.has(bullet)) {
      this.activeBullets.delete(bullet);
      this.bulletPool.return(bullet);
    }
  }

  public update(dt: number): void {
    // Update all active bullets
    for (const bullet of this.activeBullets) {
      if (bullet.getIsActive()) {
        bullet.update(dt);
      }
    }

    // Clean up any bullets that became inactive
    const inactiveBullets: Bullet[] = [];
    for (const bullet of this.activeBullets) {
      if (!bullet.getIsActive()) {
        inactiveBullets.push(bullet);
      }
    }

    // Return inactive bullets to pool
    for (const bullet of inactiveBullets) {
      this.returnBullet(bullet);
    }
  }

  public getActiveBulletCount(): number {
    return this.activeBullets.size;
  }

  public getAllActiveBullets(): Bullet[] {
    return Array.from(this.activeBullets).filter((bullet) => bullet.getIsActive());
  }

  public getPhysicsGroup(): Phaser.Physics.Arcade.Group {
    return this.physicsGroup;
  }

  public checkCollisions(asteroids: Asteroid[]): void {
    for (const bullet of this.activeBullets) {
      if (!bullet.getIsActive()) continue;

      for (const asteroid of asteroids) {
        if (!asteroid.active) continue;

        // Check collision between bullet and asteroid
        if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), asteroid.getBounds())) {
          this.handleBulletAsteroidCollision(bullet, asteroid);
          break; // Bullet is destroyed, no need to check more asteroids
        }
      }
    }
  }

  private handleBulletAsteroidCollision(bullet: Bullet, asteroid: Asteroid): void {
    // Apply damage to asteroid
    const damage = bullet.getDamage();

    // Emit collision event for other systems
    this.scene.events.emit("bullet-asteroid-collision", {
      bullet,
      asteroid,
      damage,
      position: { x: bullet.x, y: bullet.y },
    });

    // Mark bullet as hit (will deactivate it)
    bullet.onHit();
  }

  public clearAllBullets(): void {
    // Return all bullets to pool
    for (const bullet of this.activeBullets) {
      this.bulletPool.return(bullet);
    }
    this.activeBullets.clear();
  }

  public destroy(): void {
    this.clearAllBullets();
    this.scene.events.off("bullet-hit", this.onBulletHit, this);
    this.scene.events.off("bullet-expired", this.onBulletExpired, this);
    this.physicsGroup.destroy();
  }

  private onBulletHit(event: { bullet: Bullet }): void {
    this.returnBullet(event.bullet);
  }

  private onBulletExpired(event: { bullet: Bullet }): void {
    this.returnBullet(event.bullet);
  }

  public getStats(): { active: number; poolSize: number; maxActive: number } {
    return {
      active: this.activeBullets.size,
      poolSize: this.bulletPool.getPoolSize(),
      maxActive: this.maxActiveBullets,
    };
  }
}
