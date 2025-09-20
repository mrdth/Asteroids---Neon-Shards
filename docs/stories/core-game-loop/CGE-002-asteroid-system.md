# Story: Asteroid System with Splitting & Physics

**Epic:** Core Game Loop
**Story ID:** CGE-002
**Priority:** High
**Points:** 13
**Status:** Completed

## Description

Implement the core asteroid system that provides the primary game objects for player interaction in Asteroids: Neon Shards. This system includes asteroid spawning, movement physics, splitting behavior (Large → Medium → Small), screen-wrapping, and collision detection with visual feedback through crack states.

Asteroids are the central game mechanic - they define the challenge, create the gameplay loop, and provide the source of Neon Shards when destroyed. The system must support random movement patterns, size-based health pools, and seamless splitting into smaller asteroids when damaged. Visual crack states provide feedback without requiring health bars, maintaining the clean aesthetic.

**GDD Reference:** Section 2.2 (Asteroid Behavior) - "Large → Medium → Small splitting. Random velocity + spin, screen-wrapping. Collision = death."

**Architecture Reference:** Section 6.4 (Asteroid Spawner & AI) - "Wave-driven counts; random spawn at safe distance from player. Large → Medium → Small split logic."

## Acceptance Criteria

### Functional Requirements
- [ ] Asteroids spawn at safe distance from player with random velocity and spin
- [ ] Three size types: Large (100 HP), Medium (50 HP), Small (20 HP) with base values
- [ ] Large asteroids split into 2-3 medium asteroids when destroyed
- [ ] Medium asteroids split into 2-3 small asteroids when destroyed
- [ ] Small asteroids are completely destroyed (no further splitting)
- [ ] All asteroids wrap seamlessly across screen boundaries
- [ ] Visual crack states indicate damage without health bars (25%, 50%, 75% damage thresholds)
- [ ] Asteroids maintain consistent movement patterns throughout their lifecycle
- [ ] Split asteroids inherit partial velocity from parent with added randomization

### Technical Requirements
- [ ] Code follows TypeScript strict mode standards
- [ ] Maintains 60 FPS with up to 20 asteroids on screen simultaneously
- [ ] No memory leaks during asteroid creation/destruction cycles
- [ ] Uses Phaser 3 Arcade Physics for movement and collision detection
- [ ] Object pooling for asteroids to prevent garbage collection hitches
- [ ] Collision detection optimized for performance with proper hitboxes
- [ ] Screen-wrap utility integration for boundary handling

### Game Design Requirements
- [ ] Base health values match GDD: Large 100, Medium 50, Small 20
- [ ] Movement speeds match GDD: Large 60, Medium 90, Small 130 units/sec
- [ ] Spin rates within GDD range: -60 to +60 degrees/sec
- [ ] Split behavior creates 2-3 smaller asteroids per GDD specification
- [ ] Visual crack progression provides clear damage feedback at 25%, 50%, 75%
- [ ] Asteroid sizes are visually distinct and easy to identify during gameplay

## Technical Specifications

### Files to Create/Modify

**New Files:**

- `src/gameobjects/Asteroid.ts` - Main asteroid class with physics, damage, and splitting logic
- `src/systems/AsteroidSpawner.ts` - Manages asteroid creation and wave-based spawning
- `src/systems/AsteroidManager.ts` - Pool management and asteroid lifecycle control
- `src/utils/ObjectPool.ts` - Generic object pooling utility for performance
- `tests/gameobjects/Asteroid.test.ts` - Unit tests for asteroid behavior and splitting
- `tests/systems/AsteroidSpawner.test.ts` - Unit tests for spawning logic

**Modified Files:**

- `src/scenes/GameScene.ts` - Add asteroid system instantiation and update integration
- `src/config/balance.ts` - Add asteroid configuration (health, speeds, split counts)
- `src/utils/ScreenWrap.ts` - Ensure compatibility with asteroid game objects
- `assets/sprites/asteroids.png` - Add asteroid sprite sheets with crack state animations

### Class/Interface Definitions

```typescript
// Asteroid size enumeration
enum AsteroidSize {
    LARGE = 'large',
    MEDIUM = 'medium',
    SMALL = 'small'
}

// Asteroid configuration per size
interface AsteroidConfig {
    health: number;
    speed: number;
    splitCount: [number, number]; // min/max splits
    scale: number;
    spinRange: [number, number]; // degrees/sec
}

// Asteroid data interface
interface AsteroidData {
    id: number;
    size: AsteroidSize;
    health: number;
    maxHealth: number;
    velocity: { x: number; y: number };
    angularVelocity: number;
    position: { x: number; y: number };
}

// Main Asteroid class
class Asteroid extends Phaser.Physics.Arcade.Sprite {
    private config: AsteroidConfig;
    private currentHealth: number;
    private maxHealth: number;
    private size: AsteroidSize;
    private crackSprites: Phaser.GameObjects.Sprite[];
    private lastCrackState: number;

    constructor(scene: Phaser.Scene, x: number, y: number, size: AsteroidSize) {
        super(scene, x, y, `asteroid-${size}`);
        // Initialize physics body, health, crack states
    }

    public takeDamage(damage: number): boolean {
        // Reduce health, update crack visuals, return true if destroyed
    }

    public split(): AsteroidData[] {
        // Generate split data for smaller asteroids, return empty if small
    }

    public update(dt: number): void {
        // Handle movement, screen wrapping, rotation
    }

    private updateCrackState(): void {
        // Show/hide crack sprites based on damage percentage
    }

    private calculateSplitVelocities(): { x: number; y: number }[] {
        // Generate velocities for split asteroids with inheritance + randomization
    }
}

// Asteroid spawner system
class AsteroidSpawner {
    private scene: Phaser.Scene;
    private asteroidManager: AsteroidManager;
    private safeSpawnRadius: number;

    constructor(scene: Phaser.Scene, manager: AsteroidManager) {
        // Initialize spawning system
    }

    public spawnWave(count: number, playerPos: { x: number; y: number }): Asteroid[] {
        // Spawn asteroids at safe distance from player
    }

    public spawnSplits(parentData: AsteroidData, splitData: AsteroidData[]): Asteroid[] {
        // Create split asteroids from parent destruction
    }

    private findSafeSpawnPosition(playerPos: { x: number; y: number }): { x: number; y: number } {
        // Calculate spawn position outside safe radius
    }
}

// Asteroid pool manager
class AsteroidManager {
    private pools: Map<AsteroidSize, ObjectPool<Asteroid>>;
    private activeAsteroids: Set<Asteroid>;
    private maxActiveCount: number = 20;

    constructor(scene: Phaser.Scene) {
        // Initialize object pools for each size
    }

    public getAsteroid(size: AsteroidSize, x: number, y: number): Asteroid {
        // Get asteroid from pool or create new one
    }

    public returnAsteroid(asteroid: Asteroid): void {
        // Return asteroid to pool for reuse
    }

    public getActiveCount(): number {
        // Return current active asteroid count
    }

    public update(dt: number): void {
        // Update all active asteroids
    }
}

// Generic object pool utility
class ObjectPool<T> {
    private pool: T[];
    private createFn: () => T;
    private resetFn: (obj: T) => void;

    constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize: number = 10) {
        // Initialize object pool with creation and reset functions
    }

    public get(): T {
        // Get object from pool or create new one
    }

    public return(obj: T): void {
        // Return object to pool for reuse
    }
}
```

### Integration Points

**Scene Integration:**

- GameScene: Create AsteroidManager and AsteroidSpawner instances
- GameScene: Call manager.update() in scene update loop
- GameScene: Handle asteroid destruction events for splitting and cleanup

**System Dependencies:**

- ScreenWrap: Reuse utility for asteroid boundary wrapping
- BALANCE config: Asteroid health, speed, and split parameters
- ObjectPool: Performance optimization for asteroid lifecycle management

**Event Communication:**

- Emits: `asteroid-destroyed` when asteroid health reaches zero
- Emits: `asteroid-split` when asteroid splits into smaller pieces
- Emits: `asteroid-spawned` when new asteroid is created
- Listens: `wave-start` to trigger wave-based asteroid spawning
- Listens: `game-pause` to halt asteroid movement updates

## Implementation Tasks

### Dev Agent Record

**Tasks:**

- [ ] Create AsteroidSize enum and AsteroidConfig interface in balance.ts with GDD values
- [ ] Implement ObjectPool utility class for generic object pooling
- [ ] Create Asteroid class extending Phaser.Physics.Arcade.Sprite
- [ ] Configure Arcade Physics body with proper collision bounds for each size
- [ ] Implement health system with damage tracking and destruction detection
- [ ] Add visual crack state system with sprite overlays at damage thresholds
- [ ] Implement splitting logic with velocity inheritance and randomization
- [ ] Create AsteroidManager with object pools for all three sizes
- [ ] Implement AsteroidSpawner with safe distance calculation from player
- [ ] Add screen wrapping integration to asteroid update loop
- [ ] Create GameScene integration with spawner and manager systems
- [ ] Add asteroid movement physics with random velocity and angular velocity
- [ ] Write unit tests for Asteroid damage, splitting, and movement calculations
- [ ] Write unit tests for AsteroidSpawner safe positioning and wave generation
- [ ] Integration testing with GameScene and physics collision detection
- [ ] Performance testing with 20 asteroids maintaining 60 FPS target

**Debug Log:**
| Task | File | Change | Reverted? |
|------|------|--------|-----------|
| | | | |

**Completion Notes:**

<!-- Only note deviations from requirements, keep under 50 words -->

**Change Log:**

<!-- Only requirement changes during implementation -->

## Game Design Context

**GDD Reference:** Section 2.2 (Asteroid Behavior)

**Game Mechanic:** Large → Medium → Small splitting with physics-based movement

**Player Experience Goal:** Provide challenging, dynamic obstacles that create satisfying destruction feedback and escalating difficulty through splitting behavior. Visual crack states give clear damage feedback without cluttering the UI.

**Balance Parameters:**

- Large Asteroid: 100 HP, 60 units/sec speed, 2-3 splits
- Medium Asteroid: 50 HP, 90 units/sec speed, 2-3 splits
- Small Asteroid: 20 HP, 130 units/sec speed, no splits
- Spin Range: -60 to +60 degrees/sec for all sizes
- Max Active: 20 asteroids on screen simultaneously
- Safe Spawn: 150 pixel minimum distance from player

## Testing Requirements

### Unit Tests

**Test Files:**

- `tests/gameobjects/Asteroid.test.ts`
- `tests/systems/AsteroidSpawner.test.ts`
- `tests/systems/AsteroidManager.test.ts`
- `tests/utils/ObjectPool.test.ts`

**Test Scenarios:**

- Asteroid takes damage correctly and updates crack visuals at proper thresholds
- Large asteroids split into 2-3 medium asteroids with inherited velocity
- Medium asteroids split into 2-3 small asteroids with inherited velocity
- Small asteroids are destroyed completely without splitting
- Screen wrapping teleports asteroids seamlessly across boundaries
- Object pools manage asteroid lifecycle without memory leaks
- Spawner creates asteroids at safe distance from player position

### Game Testing

**Manual Test Cases:**

1. **Asteroid Movement and Physics Test**
   - Expected: Asteroids move with consistent velocity and rotation
   - Performance: 20 asteroids maintain 60 FPS with no stuttering

2. **Splitting Behavior Test**
   - Expected: Large/Medium asteroids split into 2-3 smaller asteroids
   - Edge Case: Split velocities are varied but inherit parent momentum

3. **Visual Damage Feedback Test**
   - Expected: Crack sprites appear at 25%, 50%, 75% damage thresholds
   - Edge Case: Multiple damage instances in single frame handled correctly

4. **Screen Wrapping Test**
   - Expected: Asteroids wrap seamlessly at all screen boundaries
   - Performance: No position glitches or teleportation artifacts

### Performance Tests

**Metrics to Verify:**

- Frame rate maintains 60 FPS with 20 active asteroids moving simultaneously
- Memory usage stays under 100MB for asteroid system (pools + active objects)
- Object pool recycling prevents garbage collection hitches during splitting
- Collision detection completes within 3ms per frame for all asteroids

## Dependencies

**Story Dependencies:**

- CGE-001: Player Ship Controls (completed) - Required for safe spawn distance calculation

**Technical Dependencies:**

- Phaser 3.70+ with Arcade Physics collision detection enabled
- TypeScript 5+ project with strict mode configuration
- ScreenWrap utility from player ship story

**Asset Dependencies:**

- Asteroid sprites: Three sizes with base and crack state variations
- Location: `assets/sprites/asteroids/large.png`, `medium.png`, `small.png`
- Crack overlays: Damage state sprites for visual feedback
- Location: `assets/sprites/asteroids/cracks/crack-25.png`, `crack-50.png`, `crack-75.png`

## Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Code reviewed and follows TypeScript strict standards
- [ ] Unit tests written and passing (>90% coverage for core logic)
- [ ] Integration tests passing with GameScene and physics systems
- [ ] Performance targets met (60 FPS with 20 asteroids)
- [ ] No ESLint warnings or errors in asteroid system code
- [ ] Object pooling prevents memory leaks during continuous gameplay
- [ ] Visual crack states provide clear damage feedback
- [ ] Splitting behavior matches GDD specifications exactly
- [ ] Screen wrapping works seamlessly for all asteroid sizes

## Notes

**Implementation Notes:**

- Use `setCircle()` for Arcade Physics bodies to ensure accurate collision detection
- Implement fixed-timestep physics accumulator for frame-rate independent movement
- Cache trigonometric calculations for performance optimization
- Ensure split velocity calculation includes both inheritance and randomization factors

**Design Decisions:**

- Object pooling: Chosen to prevent garbage collection during intensive splitting sequences
- Visual crack states: Replaces health bars to maintain clean aesthetic while providing feedback
- Three-size system: Balances gameplay complexity with implementation simplicity
- Safe spawn radius: Prevents unfair asteroid spawning directly on player

**Future Considerations:**

- Special asteroid types (Glowing, Corrupted) integration points prepared
- Particle effects for destruction and splitting events
- Audio integration hooks for destruction and impact sounds
- Procedural asteroid shape generation for variety (post-MVP)
