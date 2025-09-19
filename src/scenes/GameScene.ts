import * as Phaser from "phaser";
import { PlayerShip } from "../gameobjects/PlayerShip";
import { PLAYER_CONFIG } from "../config/balance";

export class GameScene extends Phaser.Scene {
  private playerShip!: PlayerShip;

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

    // Set up event listeners for ship events
    this.events.on("ship-destroyed", this.onShipDestroyed, this);
    this.events.on("ship-thrust", this.onShipThrust, this);
    this.events.on("ship-fire", this.onShipFire, this);

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
    // The PlayerShip handles its own update through scene events
    // This is called automatically by Phaser
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

  /**
   * Get reference to player ship for other systems
   */
  public getPlayerShip(): PlayerShip {
    return this.playerShip;
  }
}
