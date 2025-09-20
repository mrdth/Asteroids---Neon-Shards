export interface IntentInput {
  thrust: number; // 0-1 intensity
  turn: number; // -1 to 1 (left/right)
  fire: boolean; // trigger state
}

export class InputSystem {
  private keyboard: Phaser.Input.Keyboard.KeyboardPlugin;
  private gamepad?: Phaser.Input.Gamepad.Gamepad;

  // Keyboard mappings
  private keys: {
    thrust: Phaser.Input.Keyboard.Key[];
    turnLeft: Phaser.Input.Keyboard.Key[];
    turnRight: Phaser.Input.Keyboard.Key[];
    fire: Phaser.Input.Keyboard.Key[];
  };

  constructor(scene: Phaser.Scene) {
    this.keyboard = scene.input.keyboard!;

    // Initialize key mappings for multiple control schemes
    this.keys = {
      thrust: [
        this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      ],
      turnLeft: [
        this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      ],
      turnRight: [
        this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      ],
      fire: [
        this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      ],
    };

    // Try to get gamepad if available
    if (scene.input.gamepad) {
      this.gamepad = scene.input.gamepad.pad1;
    }
  }

  /**
   * Get normalized input intent from all input sources
   */
  public getIntent(): IntentInput {
    const intent: IntentInput = {
      thrust: 0,
      turn: 0,
      fire: false,
    };

    // Process keyboard input
    this.processKeyboardInput(intent);

    // Process gamepad input if available
    if (this.gamepad && this.gamepad.connected) {
      this.processGamepadInput(intent);
    }

    return intent;
  }

  private processKeyboardInput(intent: IntentInput): void {
    // Thrust input (0-1)
    if (this.isAnyKeyDown(this.keys.thrust)) {
      intent.thrust = 1.0;
    }

    // Turn input (-1 to 1)
    let turnInput = 0;
    if (this.isAnyKeyDown(this.keys.turnLeft)) {
      turnInput -= 1;
    }
    if (this.isAnyKeyDown(this.keys.turnRight)) {
      turnInput += 1;
    }
    intent.turn = turnInput;

    // Fire input
    if (this.isAnyKeyDown(this.keys.fire)) {
      intent.fire = true;
    }
  }

  private processGamepadInput(intent: IntentInput): void {
    if (!this.gamepad) return;

    // Face button for thrust (A button on Xbox, X on PlayStation)
    if (this.gamepad.A) {
      intent.thrust = Math.max(intent.thrust, 1.0);
    }

    // Right trigger for variable thrust
    if (this.gamepad.R2 > 0) {
      intent.thrust = Math.max(intent.thrust, this.gamepad.R2);
    }

    // Left stick for turning
    if (Math.abs(this.gamepad.leftStick.x) > 0.1) {
      // Deadzone
      intent.turn = this.gamepad.leftStick.x;
    }

    // D-pad for turning (digital input)
    if (this.gamepad.left) {
      intent.turn = Math.min(intent.turn - 1, -1);
    }
    if (this.gamepad.right) {
      intent.turn = Math.max(intent.turn + 1, 1);
    }

    // Right shoulder button for fire
    if (this.gamepad.R1) {
      intent.fire = true;
    }
  }

  private isAnyKeyDown(keys: Phaser.Input.Keyboard.Key[]): boolean {
    return keys.some((key) => key.isDown);
  }

  /**
   * Check if fire was just pressed (for single-shot firing)
   */
  public isFireJustPressed(): boolean {
    const fireJustPressed = this.keys.fire.some((key) => Phaser.Input.Keyboard.JustDown(key));

    if (this.gamepad && this.gamepad.connected) {
      return fireJustPressed || Phaser.Input.Gamepad.JustDown(this.gamepad, 5); // R1 button
    }

    return fireJustPressed;
  }

  /**
   * Update gamepad reference (called when gamepad connects/disconnects)
   */
  public updateGamepad(scene: Phaser.Scene): void {
    if (scene.input.gamepad) {
      this.gamepad = scene.input.gamepad.pad1;
    }
  }
}
