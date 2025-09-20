export class ScreenWrap {
  /**
   * Handle screen boundary wrapping for any game object
   * @param object - The game object to wrap (must have x, y, width, height properties)
   * @param bounds - The bounds rectangle to wrap within
   */
  static wrap(
    object: Phaser.GameObjects.GameObject & { x: number; y: number; width: number; height: number },
    bounds: Phaser.Geom.Rectangle
  ): void {
    const halfWidth = object.width / 2;
    const halfHeight = object.height / 2;

    // Wrap horizontally
    if (object.x + halfWidth < bounds.left) {
      object.x = bounds.right + halfWidth;
    } else if (object.x - halfWidth > bounds.right) {
      object.x = bounds.left - halfWidth;
    }

    // Wrap vertically
    if (object.y + halfHeight < bounds.top) {
      object.y = bounds.bottom + halfHeight;
    } else if (object.y - halfHeight > bounds.bottom) {
      object.y = bounds.top - halfHeight;
    }
  }

  /**
   * Check if an object is completely outside the bounds
   * @param object - The game object to check
   * @param bounds - The bounds rectangle
   * @returns true if the object is completely outside bounds
   */
  static isOutsideBounds(
    object: Phaser.GameObjects.GameObject & { x: number; y: number; width: number; height: number },
    bounds: Phaser.Geom.Rectangle
  ): boolean {
    const halfWidth = object.width / 2;
    const halfHeight = object.height / 2;

    return (
      object.x + halfWidth < bounds.left ||
      object.x - halfWidth > bounds.right ||
      object.y + halfHeight < bounds.top ||
      object.y - halfHeight > bounds.bottom
    );
  }

  /**
   * Get the standard game bounds for screen wrapping
   * @param scene - The Phaser scene to get bounds from
   * @returns Rectangle representing the screen bounds
   */
  static getGameBounds(scene: Phaser.Scene): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(0, 0, scene.cameras.main.width, scene.cameras.main.height);
  }
}
