# 🚀 Asteroids: Neon Shards

> A vaporwave-inspired roguelite reimagining of the classic Asteroids arcade game

**Asteroids: Neon Shards** transforms the timeless space shooter into a modern roguelite experience. Blast through neon asteroids in stylized vaporwave aesthetic while collecting "Neon Shards" - a persistent currency that unlocks ship upgrades and abilities across runs.

## 🎮 Game Overview

**Genre:** Arcade Roguelite
**Platform:** Web (Desktop & Mobile browsers)
**Engine:** Phaser 3.70+ with TypeScript 5.0+
**Status:** In Development

### Core Game Loop

1. **Enter** asteroid field in your neon-powered ship
2. **Destroy** asteroids with precision laser weapons
3. **Collect** Neon Shards dropped from destroyed asteroids
4. **Survive** increasingly chaotic waves
5. **Death** leads to upgrade opportunities
6. **Upgrade** your ship with persistent Neon Shards
7. **Restart** stronger for deeper runs

### Key Features

- 🎯 **Classic Asteroids Mechanics** - Momentum-based ship movement, asteroid splitting, screen wrapping
- 💎 **Neon Shard Currency** - Collectible currency that persists between runs
- 🔫 **Precision Weapon System** - Rate-limited laser weapons with satisfying feedback
- 🌊 **Infinite Wave Progression** - Difficulty scales infinitely with smarter asteroid AI
- 🛸 **Roguelite Upgrades** - Persistent ship improvements for weapons, shields, and mobility
- 🎨 **Vaporwave Aesthetic** - Distinctive neon visual style with synthwave audio
- ⚡ **Performance Optimized** - 60 FPS target with object pooling and efficient collision detection

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) (v16+ recommended)
- Modern web browser with ES6+ support

### Installation & Development

```bash
# Clone the repository
git clone <repository-url>
cd "Asteroids - Neon Shards"

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:8080`

### Production Build

```bash
# Create optimized build
npm run build

# The built game will be in the `dist` folder
```

## 🎮 How to Play

### Controls

| Input             | Action                         |
| ----------------- | ------------------------------ |
| **W** / **↑**     | Thrust forward                 |
| **A** / **←**     | Turn left                      |
| **D** / **→**     | Turn right                     |
| **Space** / **S** | Fire weapon                    |
| **F**             | Debug: Damage nearest asteroid |

### Gameplay Tips

- 🎯 **Lead your shots** - Asteroids move unpredictably, aim where they're going
- 💎 **Collect quickly** - Neon Shards expire after 4 seconds
- 🧲 **Use magnetism** - Get within 160 pixels for automatic shard attraction
- ⚡ **Manage fire rate** - Weapon is capped at 4 shots per second
- 🌊 **Survive waves** - Each wave brings more asteroids with increased health

## 🏗️ Project Structure

```
src/
├── config/           # Game balance and configuration
│   └── balance.ts    # Tunable game parameters
├── core/             # Core game systems
│   └── Game.ts       # Main game configuration
├── scenes/           # Phaser game scenes
│   └── GameScene.ts  # Main gameplay scene
├── gameobjects/      # Game entity classes
│   ├── PlayerShip.ts # Player-controlled ship
│   ├── Asteroid.ts   # Destructible asteroid objects
│   └── Bullet.ts     # Weapon projectiles
├── systems/          # Modular game systems
│   ├── InputSystem.ts        # Input handling
│   ├── WeaponSystem.ts       # Weapon firing mechanics
│   ├── BulletManager.ts      # Bullet lifecycle management
│   ├── AsteroidManager.ts    # Asteroid spawning and physics
│   └── AsteroidSpawner.ts    # Wave-based asteroid generation
└── utils/            # Utility functions
    ├── MathUtils.ts     # Mathematical helpers
    ├── ObjectPool.ts    # Performance optimization
    ├── ScreenWrap.ts    # Boundary wrapping logic
    └── Timer.ts         # High-precision timing
```

## 🎨 Design Philosophy

### Core Design Pillars

1. **Player-First Fun** - Every decision prioritizes immediate enjoyment
2. **Replayability Through Progression** - Meaningful upgrades drive long-term engagement
3. **Distinct Aesthetic Identity** - Vaporwave style sets it apart from classic Asteroids
4. **Lean Scope, High Polish** - Focused feature set with exceptional execution
5. **Performance Excellence** - Smooth 60 FPS gameplay on all target platforms

### Balance Philosophy

- **Fire Rate Limiting** (4 shots/sec) prevents weapon spam while maintaining responsiveness
- **Magnetic Shard Collection** (160px radius) creates risk/reward positioning decisions
- **Progressive Scaling** (+20% HP, +5% speed per wave) ensures long-term challenge
- **Persistent Progression** drives "just one more run" engagement

## 🔧 Technical Details

### Technology Stack

- **Engine:** Phaser 3.70+ (Arcade Physics)
- **Language:** TypeScript 5.0+ (strict mode)
- **Build Tool:** Vite 6.3+ (ES modules, hot reload)
- **Code Quality:** ESLint + Prettier + Husky
- **Testing:** Vitest for unit tests
- **Performance:** Object pooling, texture atlases, optimized collision detection

### Performance Targets

- 🎯 **Frame Rate:** 60 FPS sustained on desktop and mid-range mobile
- ⚡ **Load Time:** <3 seconds initial boot
- 💾 **Memory Usage:** <200MB peak memory consumption
- 🔄 **Input Latency:** <100ms response time for all controls

### Architecture Highlights

- **Modular Systems** - Each game system is independent and testable
- **Object Pooling** - Prevents garbage collection hitches during intense gameplay
- **Event-Driven Communication** - Loose coupling between systems via Phaser events
- **Data-Driven Balance** - All game parameters externalized to config files

## 🧪 Development Status

### ✅ Completed Features

- **Player Ship Controls** - Momentum-based movement with screen wrapping
- **Asteroid System** - Spawning, physics, damage states, and splitting mechanics
- **Weapon System** - Rate-limited laser firing with bullet physics
- **Collision Detection** - Ship-asteroid and bullet-asteroid interactions
- **Wave Progression** - Infinite scaling difficulty with proper pacing
- **Life System** - Player lives with invulnerability frames and game over

### 🚧 In Development

- **Neon Shards Collection** - Drop system with magnetic attraction (CGE-004)
- **Score & HUD System** - Real-time score tracking and display
- **Visual Effects** - Particle systems for explosions and impacts
- **Audio Integration** - Sound effects and background music

### 📋 Planned Features

- **Meta-Progression Hub** - Upgrade tree for persistent ship improvements
- **Vaporwave Visual Polish** - Enhanced neon aesthetics and post-processing
- **Special Asteroid Types** - Glowing (boosts) and Corrupted (risk/reward) variants
- **Mobile Optimization** - Touch controls and responsive UI
- **Performance Optimization** - Advanced rendering and memory optimizations

## 🧪 Testing

### Running Tests

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage Goals

- **Systems Logic:** >90% coverage for game systems and mechanics
- **Integration Testing:** Full scene and system interaction validation
- **Performance Testing:** Frame rate and memory usage validation
- **Manual Testing:** Gameplay feel and balance validation

## 📋 Development Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Development server with hot reload |
| `npm run build`      | Production build with optimization |
| `npm run preview`    | Preview production build locally   |
| `npm run lint`       | ESLint code quality checking       |
| `npm run lint:fix`   | Auto-fix linting issues            |
| `npm test`           | Run unit test suite                |
| `npm run type-check` | TypeScript type validation         |

## 🎯 Project Goals

### Technical Validation

- Prove Phaser 3 + TypeScript can deliver console-quality web games
- Demonstrate effective object pooling and performance optimization
- Validate event-driven architecture for complex game systems

### Game Design Validation

- Modernize classic arcade mechanics for contemporary audiences
- Balance immediate fun with long-term progression hooks
- Create distinctive aesthetic identity within established genre

### Development Process Validation

- Test BMAD (story-driven development) methodology on real project
- Validate AI-assisted development workflow for game creation
- Demonstrate comprehensive documentation driving implementation

## 🤝 Contributing

This project uses a story-driven development approach with comprehensive documentation:

1. **Game Design Document** - `docs/design/game-design-doc.md`
2. **Technical Architecture** - `docs/architecture/game-architecture.md`
3. **Development Stories** - `docs/stories/` (implementation-ready feature specifications)

### Development Workflow

1. Review existing stories in `docs/stories/`
2. Implement features according to story specifications
3. Run tests to validate implementation
4. Update documentation with any deviations

## 📜 License

[Add appropriate license information]

## 🙏 Acknowledgments

- **Phaser Community** - Excellent game engine and documentation
- **Vaporwave Artists** - Aesthetic inspiration for visual design
- **Classic Asteroids** - Timeless gameplay foundation
- **Roguelite Genre** - Progression mechanics inspiration

---

**Built with ❤️ using Phaser 3, TypeScript, and modern web technologies**

_For the love of retro gaming and neon aesthetics_ ✨
