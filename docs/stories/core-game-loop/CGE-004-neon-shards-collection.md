# Story: Neon Shards Collection & Magnetic Drop System

**Epic:** Core Game Loop
**Story ID:** CGE-004
**Priority:** High
**Points:** 12
**Status:** Completed

## Description

Implement the core currency collection system that drives the game's roguelite progression loop. When asteroids are destroyed, they drop "Neon Shards" that players must collect within a limited timeframe. The shards feature magnetic attraction to the player when they get close, creating satisfying collection gameplay that rewards aggressive positioning near destroyed asteroids.

This system establishes the fundamental reward loop that makes asteroid destruction immediately gratifying while building toward long-term progression. Shards serve as both in-run score currency and persistent meta-currency for upgrades between runs, making every destroyed asteroid meaningful to the player's advancement.

The implementation includes size-based shard yields, wave-based scaling bonuses, magnetic collection physics with customizable radius, visual and audio feedback for collection, and temporary lifespan management to maintain gameplay tension around collection timing.

**GDD Reference:** Section 2.3 (Neon Shards) - "Dropped on asteroid destruction (size-based). Brief lifespan + magnetic pull toward player. Used for score (in-run) and upgrades (meta)" and Section 2.5 (Asteroid Health & Rewards) - "Shard yield: Large 5, Medium 3, Small 1 (+5% per wave)"

**Architecture Reference:** Section 6.6 (Shards & Magnetism) - "Spawn from destroyed asteroids; short lifespan; magnetic pull to player within radius. Collect increments run score and post-run persistent shards via Summary"

## Acceptance Criteria

### Functional Requirements

- [ ] Shards automatically spawn at destroyed asteroid positions with correct yield amounts
- [ ] Large asteroids drop 5 shards, medium asteroids drop 3 shards, small asteroids drop 1 shard
- [ ] Shard yield increases by +5% per wave (scaling with game progression)
- [ ] Shards have 4-second lifespan and disappear with warning animation if not collected
- [ ] Magnetic attraction activates when player is within 160 pixels of any shard
- [ ] Magnetic pull smoothly accelerates shards toward player center with physics-based movement
- [ ] Player collision with shards immediately collects them with visual/audio feedback
- [ ] Run score increases by shard value when collected (displayed in HUD)
- [ ] Persistent shard total accumulates for post-run meta-progression
- [ ] Multiple shards can be collected simultaneously without performance issues

### Technical Requirements

- [ ] Code follows TypeScript strict mode standards with proper type safety
- [ ] Maintains 60 FPS with 20+ active shards and magnetic physics calculations
- [ ] Object pooling prevents memory allocation during shard spawning/collection cycles
- [ ] Uses Phaser 3 Arcade Physics for efficient collision detection and magnetic movement
- [ ] Shard lifespan uses high-precision timing for consistent 4-second duration
- [ ] Magnetic force calculation optimized to avoid expensive distance calculations per frame
- [ ] No memory leaks during extended gameplay with continuous shard spawning/collection
- [ ] Integration with existing GameScene update loop without affecting other system performance

### Game Design Requirements

- [ ] Shard collection feels immediately rewarding with satisfying visual and audio feedback
- [ ] Magnetic radius (160 pixels) creates tactical decisions about risk vs. reward positioning
- [ ] Lifespan tension (4 seconds) encourages active collection without feeling punitive
- [ ] Wave scaling (+5% per wave) maintains reward progression throughout long runs
- [ ] Visual design clearly indicates shard value and magnetic attraction state
- [ ] Audio feedback differentiates between different shard collection events
- [ ] HUD integration shows current run score and collected shard progress

## Technical Specifications

### Files to Create/Modify

**New Files:**

- `src/gameobjects/Shard.ts` - Individual shard object with magnetism, lifespan, and collection behavior
- `src/systems/ShardManager.ts` - Object pool management, spawning logic, and magnetic physics updates
- `src/systems/ScoreSystem.ts` - Score tracking, persistent shard accumulation, and HUD integration
- `src/utils/MagnetPhysics.ts` - Optimized magnetic attraction calculations and force application
- `tests/gameobjects/Shard.test.ts` - Unit tests for shard behavior, magnetism, and collection
- `tests/systems/ShardManager.test.ts` - Unit tests for spawning logic, scaling, and pool management

**Modified Files:**

- `src/systems/AsteroidManager.ts` - Add shard spawning integration when asteroids are destroyed
- `src/scenes/GameScene.ts` - Add ShardManager and ScoreSystem instantiation and update calls
- `src/config/balance.ts` - Add shard configuration (yields, lifespan, magnetic radius, scaling)
- `src/gameobjects/PlayerShip.ts` - Add shard collection collision detection and integration

### Class/Interface Definitions

```typescript
// Shard configuration interface
interface ShardConfig {
  baseYield: {
    large: number; // Base shards from large asteroids (5)
    medium: number; // Base shards from medium asteroids (3)
    small: number; // Base shards from small asteroids (1)
  };
  lifespanMs: number; // Shard lifespan in milliseconds (4000)
  magnetRadius: number; // Magnetic attraction radius in pixels (160)
  magnetForce: number; // Magnetic acceleration strength (300)
  scalingPerWave: number; // Yield increase per wave (+5% = 0.05)
  warningTimeMs: number; // Time before expiration to show warning (1000)
  collectionRadius: number; // Player collision radius for collection (24)
}

// Shard data interface
interface ShardData {
  id: number;
  value: number;
  position: { x: number; y: number };
  timeToLive: number;
  sourceAsteroidSize: AsteroidSize;
  waveNumber: number;
  isInMagneticRange: boolean;
}

// Main Shard class
class Shard extends Phaser.Physics.Arcade.Sprite {
  private value: number;
  private timeToLive: number;
  private initialLifetime: number;
  private sourceSize: AsteroidSize;
  private waveNumber: number;
  private magneticTarget: { x: number; y: number } | null;
  private isInMagneticRange: boolean;
  private warningStarted: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "shard-neon");
    // Initialize physics body, visual states, and magnetic properties
  }

  public spawn(
    x: number,
    y: number,
    sourceSize: AsteroidSize,
    waveNumber: number,
    config: ShardConfig
  ): void {
    // Calculate value with wave scaling, set position, start lifespan timer
  }

  public update(dt: number, playerPosition: { x: number; y: number }, config: ShardConfig): void {
    // Update lifespan, check magnetic range, apply magnetic force, handle expiration warning
  }

  public applyMagneticForce(targetX: number, targetY: number, force: number): void {
    // Calculate and apply physics force toward magnetic target
  }

  public getValue(): number {
    // Return shard value for score calculation
  }

  public collect(): number {
    // Mark as collected, trigger collection effects, return value
  }

  private calculateScaledValue(baseValue: number, waveNumber: number, scalingRate: number): number {
    // Apply wave-based scaling to shard value
  }

  private startExpirationWarning(): void {
    // Begin visual warning animation for imminent expiration
  }

  private isPlayerInMagneticRange(playerX: number, playerY: number, radius: number): boolean {
    // Optimized distance check for magnetic activation
  }
}

// Shard pool manager and spawning system
class ShardManager extends Phaser.Events.EventEmitter {
  private scene: Phaser.Scene;
  private shardPool: ObjectPool<Shard>;
  private activeShards: Set<Shard>;
  private maxActiveShards: number;
  private config: ShardConfig;
  private currentWave: number;

  constructor(scene: Phaser.Scene, config: ShardConfig, maxShards: number = 50) {
    // Initialize shard object pool and tracking systems
  }

  public spawnShardsFromAsteroid(asteroid: Asteroid, waveNumber: number): Shard[] {
    // Calculate yield, spawn appropriate number of shards at asteroid position
  }

  public update(dt: number, playerPosition: { x: number; y: number }): void {
    // Update all active shards, handle magnetism, check collections, manage expiration
  }

  public checkPlayerCollections(playerBounds: Phaser.Geom.Rectangle): number {
    // Detect shard-player collisions and return total value collected
  }

  public getActiveShard(): Shard | null {
    // Get shard from pool or return null if max reached
  }

  public returnShard(shard: Shard): void {
    // Return shard to pool and remove from active tracking
  }

  private calculateShardYield(asteroidSize: AsteroidSize, waveNumber: number): number {
    // Apply base yield and wave scaling to determine spawn count
  }

  private createShardSpread(
    centerX: number,
    centerY: number,
    count: number
  ): { x: number; y: number }[] {
    // Generate spread pattern for multiple shards from single asteroid
  }

  public getTotalActiveShards(): number {
    // Return current number of active shards
  }

  public getShardStats(): { active: number; collected: number; expired: number } {
    // Return statistics for debugging and optimization
  }
}

// Score tracking and persistent shard management
class ScoreSystem extends Phaser.Events.EventEmitter {
  private currentRunScore: number;
  private currentRunShards: number;
  private persistentShards: number;
  private scoreText: Phaser.GameObjects.Text;
  private shardText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, hudX: number, hudY: number) {
    // Initialize score tracking and HUD text objects
  }

  public addShardScore(value: number): void {
    // Increment run score and shard count, update HUD display
  }

  public getRunScore(): number {
    // Return current run total score
  }

  public getRunShards(): number {
    // Return current run shard count
  }

  public getPersistentShards(): number {
    // Return accumulated persistent shards for meta-progression
  }

  public commitRunShards(): void {
    // Transfer run shards to persistent total for meta-progression
  }

  public resetRunStats(): void {
    // Clear run totals for new game start
  }

  private updateHUD(): void {
    // Refresh score and shard display text
  }

  private animateScoreIncrease(value: number): void {
    // Brief animation for satisfying collection feedback
  }
}

// Optimized magnetic physics utility
class MagnetPhysics {
  public static calculateMagneticForce(
    shardX: number,
    shardY: number,
    targetX: number,
    targetY: number,
    maxForce: number,
    magnetRadius: number
  ): { x: number; y: number } | null {
    // Optimized magnetic force calculation with distance caching
  }

  public static isInMagneticRange(
    shardX: number,
    shardY: number,
    targetX: number,
    targetY: number,
    radius: number
  ): boolean {
    // Fast distance check using squared distance to avoid sqrt
  }

  private static normalizeForce(
    fx: number,
    fy: number,
    maxForce: number
  ): { x: number; y: number } {
    // Normalize force vector to maximum strength
  }
}
```

### Integration Points

**Scene Integration:**

- GameScene: Create ShardManager and ScoreSystem instances during scene initialization
- GameScene: Call shardManager.update() and scoreSystem.update() in main update loop
- GameScene: Handle shard collection events and score updates

**System Dependencies:**

- AsteroidManager: Triggers shard spawning when asteroids are destroyed
- PlayerShip: Provides position for magnetic calculations and collision detection
- WaveManager: Provides current wave number for yield scaling calculations
- HUD System: Displays current score and shard totals

**Event Communication:**

- Emits: `shard-spawned` when new shards are created from asteroid destruction
- Emits: `shard-collected` when player successfully collects a shard (for audio/VFX)
- Emits: `shard-expired` when shard lifespan ends without collection
- Listens: `asteroid-destroyed` from AsteroidManager to trigger shard spawning
- Listens: `wave-started` to update current wave number for scaling calculations
- Listens: `game-pause` to halt shard updates and magnetic physics

## Implementation Tasks

### Dev Agent Record

**Tasks:**

- [ ] Create ShardConfig interface and add to balance.ts with exact GDD values (yields, lifespan, magnetic radius)
- [ ] Implement MagnetPhysics utility with optimized distance calculations and force application
- [ ] Create Shard class extending Phaser.Physics.Arcade.Sprite with magnetism and lifespan
- [ ] Configure Arcade Physics body with proper collision bounds for shard collection
- [ ] Implement shard spawning logic with wave-based yield scaling (+5% per wave)
- [ ] Add shard lifespan management with 4-second timer and expiration warning animation
- [ ] Create ShardManager with object pooling for performance optimization during mass spawning
- [ ] Implement magnetic attraction system with 160-pixel radius and smooth physics force application
- [ ] Add shard collection detection with immediate feedback and score accumulation
- [ ] Create ScoreSystem with run score tracking and persistent shard accumulation
- [ ] Add HUD integration for real-time score and shard display in top corners
- [ ] Integrate shard spawning triggers into AsteroidManager.destroyAsteroid() method
- [ ] Add PlayerShip collision detection for shard collection with proper bounds
- [ ] Implement visual feedback system for collection (scale as it is 'pulled' into player ship)
- [ ] Add audio feedback for shard collection, magnetic attraction, and expiration warning
- [ ] Create shard spread pattern for multiple shards spawning from single asteroid destruction
- [ ] Write unit tests for ShardManager spawning logic, yield calculations, and wave scaling
- [ ] Write unit tests for Shard magnetic physics, lifespan management, and collection behavior
- [ ] Integration testing with asteroid destruction and player movement systems
- [ ] Performance testing with 20+ simultaneous shards maintaining 60 FPS and smooth magnetism

**Debug Log:**
| Task | File | Change | Reverted? |
|------|------|--------|-----------|
| | | | |

**Completion Notes:**

<!-- Only note deviations from requirements, keep under 50 words -->

**Change Log:**

<!-- Only requirement changes during implementation -->

## Game Design Context

**GDD Reference:** Section 2.3 (Neon Shards) and Section 2.5 (Asteroid Health & Rewards)

**Game Mechanic:** Risk/reward positioning system where players must approach destroyed asteroids to collect valuable shards before they expire

**Player Experience Goal:** Create immediate gratification for asteroid destruction while building anticipation for long-term progression. The magnetic collection should feel satisfying and encourage aggressive play near danger zones.

**Balance Parameters:**

- Base Yields: Large asteroids 5 shards, Medium 3 shards, Small 1 shard
- Wave Scaling: +5% yield increase per wave (exponential growth)
- Lifespan: 4 seconds (tension without punishment)
- Magnetic Radius: 160 pixels (tactical positioning decisions)
- Magnetic Force: 300 units/sec² (smooth but noticeable attraction)
- Warning Time: 1 second before expiration (clear feedback - flash shard)
- Collection Radius: 24 pixels (forgiving but requires proximity)

## Testing Requirements

### Unit Tests

**Test Files:**

- `tests/gameobjects/Shard.test.ts`
- `tests/systems/ShardManager.test.ts`
- `tests/systems/ScoreSystem.test.ts`
- `tests/utils/MagnetPhysics.test.ts`

**Test Scenarios:**

- ShardManager calculates correct yields with wave scaling (5 shards × 1.05² = 5.5125 → 6 shards at wave 3)
- Shard lifespan expires after exactly 4 seconds with proper cleanup
- Magnetic attraction activates at 160-pixel radius and applies correct force vectors
- ScoreSystem accumulates run score and persistent shards accurately
- Object pooling prevents memory leaks during rapid spawning/collection cycles
- Multiple simultaneous shard collections register correct total values
- Wave scaling applies exponentially (1.05^(wave-1)) for increasing yields

### Game Testing

**Manual Test Cases:**

1. **Shard Spawning and Scaling Test**
   - Expected: Destroy large asteroid on wave 1 = 5 shards, wave 3 = 6 shards, wave 5 = 6 shards
   - Performance: Shards spawn immediately at asteroid destruction point with spread pattern

2. **Magnetic Collection Test**
   - Expected: Player movement within 160 pixels smoothly attracts nearby shards
   - Edge Case: Multiple shards in magnetic range all attract simultaneously without conflicts

3. **Lifespan and Warning Test**
   - Expected: Shards disappear after 4 seconds with 1-second warning animation
   - Edge Case: Collecting shard during warning animation registers value correctly

4. **Score Accumulation Test**
   - Expected: HUD updates immediately on collection, persistent total grows between runs
   - Performance: Rapid collection of multiple shards updates score smoothly without lag

### Performance Tests

**Metrics to Verify:**

- Frame rate maintains 60 FPS with 20+ active shards and magnetic physics calculations
- Memory usage stays stable during continuous spawning/collection cycles (no leaks from pooling)
- Magnetic force calculations complete within 1ms per frame for all active shards
- Shard spawning completes within 10ms when large asteroid destroyed on high wave

## Dependencies

**Story Dependencies:**

- CGE-001: Player Ship Controls (completed) - Required for player position and collision detection
- CGE-002: Asteroid System (completed) - Required for destruction events and shard spawning triggers
- CGE-003: Weapon & Bullets System (completed) - Required for asteroid destruction flow

**Technical Dependencies:**

- Phaser 3.70+ with Arcade Physics for collision detection and force application
- ObjectPool utility from asteroid system for shard pooling performance
- Existing balance.ts configuration system for shard parameters
- GameScene update loop integration for manager systems

**Asset Dependencies:**

- Shard sprite: Distinctive neon crystal with glow effect indicating value
- Location: `assets/sprites/shard-neon.png`
- Collection sound: Satisfying pickup sound for successful collection
- Location: `assets/audio/shard-collect.ogg`

## Definition of Done

- [ ] All acceptance criteria met and verified through testing
- [ ] Code reviewed and follows TypeScript strict mode standards
- [ ] Unit tests written and passing (>90% coverage for shard logic)
- [ ] Integration tests passing with AsteroidManager and PlayerShip systems
- [ ] Performance targets met (60 FPS with 20+ shards, stable memory, smooth magnetism)
- [ ] No ESLint warnings or errors in shard system code
- [ ] Object pooling prevents memory leaks during extended gameplay
- [ ] Magnetic physics calculations optimized and perform within timing budgets
- [ ] Visual and audio feedback enhances collection satisfaction
- [ ] HUD integration displays accurate score and shard totals
- [ ] Wave scaling applies correctly with exponential yield increases
- [ ] Shard lifespan and warning system provides clear player feedback

## Notes

**Implementation Notes:**

- Use squared distance calculations to avoid expensive sqrt operations in magnetic range checks
- Cache player position per frame to avoid redundant property access in magnetic calculations
- Implement shard spread pattern using polar coordinates for natural distribution around asteroid center
- Consider using Phaser's built-in tween system for smooth collection animations and warning effects

**Design Decisions:**

- Magnetic radius: Balances risk/reward positioning without making collection trivial
- Lifespan duration: Creates urgency without punishing cautious play styles
- Wave scaling: Exponential growth maintains meaningful progression throughout long runs
- Object pooling: Essential for performance during asteroid destruction clusters

**Future Considerations:**

- Special shard types with bonus values or temporary effects (post-MVP enhancement)
- Shard trail effects and enhanced magnetic visualization (polish phase)
- Audio layering system for multiple simultaneous shard events (polish phase)
- Shard combo system for collecting multiple shards rapidly (future expansion)
