import * as Phaser from "phaser";
import { GameScene } from "../scenes/GameScene";

const StartGame = (parent: string) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: parent,
    backgroundColor: "#000000",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [GameScene],
  };

  return new Phaser.Game(config);
};

export default StartGame;
