import * as Phaser from "phaser";
import { BulletManager } from "./BulletManager";
import { WeaponConfig } from "../config/balance";
import { Timer } from "../utils/Timer";
import { InputSystem, IntentInput } from "./InputSystem";
import { Bullet } from "../gameobjects/Bullet";

export class WeaponSystem {
    private scene: Phaser.Scene;
    private bulletManager: BulletManager;
    private config: WeaponConfig;
    private lastFireTime: number;
    private fireInterval: number;
    private inputSystem: InputSystem;

    constructor(scene: Phaser.Scene, bulletManager: BulletManager, config: WeaponConfig) {
        this.scene = scene;
        this.bulletManager = bulletManager;
        this.config = config;
        this.inputSystem = new InputSystem(scene);

        // Calculate fire interval from fire rate
        this.fireInterval = 1000 / config.fireRateHz; // Convert Hz to milliseconds
        this.lastFireTime = 0;

        // Listen for weapon events
        scene.events.on("bullet-fired", this.onBulletFired, this);
    }

    public update(dt: number, shipPosition: { x: number; y: number }, shipRotation: number): void {
        // Get input intent
        const intent = this.inputSystem.getIntent();

        // Check if fire button is pressed and we can fire
        if (intent.fire && this.canFire()) {
            this.fire(shipPosition.x, shipPosition.y, shipRotation);
        }
    }

    public updateWithInput(dt: number, shipPosition: { x: number; y: number }, shipRotation: number, intent: IntentInput): void {
        // Check if fire button is pressed and we can fire
        if (intent.fire && this.canFire()) {
            this.fire(shipPosition.x, shipPosition.y, shipRotation);
        }
    }

    public canFire(): boolean {
        return this.enforceFireRate();
    }

    public fire(shipX: number, shipY: number, shipAngle: number): Bullet | null {
        if (!this.canFire()) {
            return null;
        }

        // Calculate muzzle position
        const muzzlePos = this.calculateMuzzlePosition(shipX, shipY, shipAngle);

        // Fire bullet
        const bullet = this.bulletManager.fireBullet(
            muzzlePos.x,
            muzzlePos.y,
            shipAngle,
            this.config
        );

        if (bullet) {
            // Update last fire time
            this.lastFireTime = Timer.now();

            // Emit weapon fired event
            this.scene.events.emit("weapon-fired", {
                position: muzzlePos,
                angle: shipAngle,
                bullet
            });
        }

        return bullet;
    }

    public forceFireAt(x: number, y: number, angle: number): Bullet | null {
        // Force fire without rate limiting (for special cases like power-ups)
        const bullet = this.bulletManager.fireBullet(x, y, angle, this.config);

        if (bullet) {
            this.scene.events.emit("weapon-fired", {
                position: { x, y },
                angle,
                bullet
            });
        }

        return bullet;
    }

    public getFireRate(): number {
        return this.config.fireRateHz;
    }

    public getTimeSinceLastFire(): number {
        return Timer.getElapsedMs(this.lastFireTime);
    }

    public getFireCooldownPercent(): number {
        const elapsed = this.getTimeSinceLastFire();
        return Math.min(elapsed / this.fireInterval, 1.0);
    }

    public getBulletManager(): BulletManager {
        return this.bulletManager;
    }

    public updateConfig(newConfig: Partial<WeaponConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.fireInterval = 1000 / this.config.fireRateHz;
    }

    public destroy(): void {
        this.scene.events.off("bullet-fired", this.onBulletFired, this);
    }

    private calculateMuzzlePosition(shipX: number, shipY: number, shipAngle: number): { x: number; y: number } {
        // Calculate position at ship's muzzle based on rotation and offset
        const muzzleX = shipX + Math.cos(shipAngle) * this.config.muzzleOffset;
        const muzzleY = shipY + Math.sin(shipAngle) * this.config.muzzleOffset;

        return { x: muzzleX, y: muzzleY };
    }

    private enforceFireRate(): boolean {
        return Timer.hasElapsed(this.lastFireTime, this.fireInterval);
    }

    private onBulletFired(event: { bullet: Bullet; position: { x: number; y: number }; angle: number }): void {
        // Play laser sound effect
        this.scene.sound.play("laser-shot", {
            volume: 0.3, // Keep it reasonable
            rate: 1.0 + (Math.random() - 0.5) * 0.1 // Slight pitch variation for variety
        });
    }

    public getStats(): {
        fireRate: number;
        timeSinceLastFire: number;
        canFire: boolean;
        cooldownPercent: number;
        activeBullets: number;
    } {
        return {
            fireRate: this.config.fireRateHz,
            timeSinceLastFire: this.getTimeSinceLastFire(),
            canFire: this.canFire(),
            cooldownPercent: this.getFireCooldownPercent(),
            activeBullets: this.bulletManager.getActiveBulletCount()
        };
    }
}