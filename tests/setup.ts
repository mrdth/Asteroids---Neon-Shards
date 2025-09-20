// Mock Phaser for testing
import "canvas";

global.Phaser = {
  Scene: class MockScene {
    add = {
      existing: vi.fn(),
      graphics: vi.fn(() => ({
        fillStyle: vi.fn(),
        fillTriangle: vi.fn(),
        generateTexture: vi.fn(),
        destroy: vi.fn(),
      })),
      text: vi.fn(),
    };
    physics = {
      add: {
        existing: vi.fn(),
      },
    };
    input = {
      keyboard: {
        addKey: vi.fn(() => ({ isDown: false })),
      },
      gamepad: null,
    };
    events = {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    };
    cameras = {
      main: {
        width: 800,
        height: 600,
      },
    };
  },
  Physics: {
    Arcade: {
      Sprite: class MockSprite {
        x = 0;
        y = 0;
        width = 32;
        height = 32;
        rotation = 0;
        scale = 1;
        frame = 0;
        visible = true;
        active = true;
        body = {
          velocity: { x: 0, y: 0 },
          angularVelocity: 0,
          setVelocity: vi.fn((x: number, y: number) => {
            this.body.velocity.x = x;
            this.body.velocity.y = y;
          }),
          setAngularVelocity: vi.fn((value: number) => {
            this.body.angularVelocity = value;
          }),
          setDrag: vi.fn(),
          setMaxVelocity: vi.fn(),
          setCollideWorldBounds: vi.fn(),
          setCircle: vi.fn(),
          setBounce: vi.fn(),
        };

        constructor(scene: any, x: number, y: number, texture: string) {
          this.x = x;
          this.y = y;
        }

        setOrigin = vi.fn();
        setDisplaySize = vi.fn();
        setRotation = vi.fn((rot: number) => {
          this.rotation = rot;
        });
        setPosition = vi.fn((x: number, y: number) => {
          this.x = x;
          this.y = y;
          return this;
        });
        setScale = vi.fn((scale: number) => {
          this.scale = scale;
          return this;
        });
        setFrame = vi.fn((frame: number) => {
          this.frame = frame;
          return this;
        });
        setVisible = vi.fn((visible: boolean) => {
          this.visible = visible;
          return this;
        });
        setActive = vi.fn((active: boolean) => {
          this.active = active;
          return this;
        });
        destroy = vi.fn();
      },
      Body: class MockBody {
        velocity = { x: 0, y: 0 };
        angularVelocity = 0;
        setVelocity = vi.fn((x: number, y: number) => {
          this.velocity.x = x;
          this.velocity.y = y;
        });
        setAngularVelocity = vi.fn((value: number) => {
          this.angularVelocity = value;
        });
        setDrag = vi.fn();
        setMaxVelocity = vi.fn();
        setCollideWorldBounds = vi.fn();
        setCircle = vi.fn();
        setBounce = vi.fn();
      },
    },
  },
  Input: {
    Keyboard: {
      KeyCodes: {
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        SPACE: 32,
      },
      JustDown: vi.fn(() => false),
    },
    Gamepad: {
      JustDown: vi.fn(() => false),
    },
  },
  Geom: {
    Rectangle: class MockRectangle {
      constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
      ) {}

      get left() {
        return this.x;
      }
      get right() {
        return this.x + this.width;
      }
      get top() {
        return this.y;
      }
      get bottom() {
        return this.y + this.height;
      }
    },
  },
  GameObjects: {
    GameObject: class MockGameObject {
      x = 0;
      y = 0;
      width = 0;
      height = 0;
    },
  },
} as any;
