# Story: Wave Manager System - Progressive Scaling & Endless Mode

**Epic:** Core Systems
**Story ID:** CS-001
**Priority:** High
**Points:** 13
**Status:** New

## Description

Implement the Wave Manager System that controls progressive difficulty scaling, wave-based asteroid spawning, and transitions to endless mode for long-term replayability. This system drives the core progression loop by making each wave more challenging while maintaining balanced risk/reward through scaled shard yields.

The Wave Manager coordinates with existing asteroid and shard systems to apply scaling formulas, manages wave transitions with brief intermissions, and implements the endless mode that kicks in after wave 10. It provides clear feedback to players about wave progression and upcoming challenges while maintaining the fast-paced arcade feel.

**GDD Reference:** Section 5 (Level/Wave Design) - "Wave 1: 3–4 large slow asteroids (tutorial). Wave 2–4: More asteroids, faster movement. Wave 5+: Progressive scaling. Scaling Rules: +20% HP per wave, +5% speed per wave, +5% shard yield per wave"

**Architecture Reference:** Section 6.7 (Wave Manager) - "Tracks wave number; applies per-wave scaling (HP +20%, Speed +5%, Yield +5%). Spawns +1 asteroid per wave after Wave 2. Transitions to endless behavior past 10"

## Acceptance Criteria

### Functional Requirements

- [ ] Wave progression follows GDD specification: Wave 1 (3-4 large asteroids), Wave 2-4 (increasing count/speed), Wave 5+ (progressive scaling)
- [ ] Scaling formulas applied correctly: +20% HP per wave, +5% speed per wave, +5% shard yield per wave
- [ ] Asteroid count increases by +1 per wave starting from Wave 3 (Wave 1: 4, Wave 2: 4, Wave 3: 5, Wave 4: 6, etc.)
- [ ] Wave transitions include brief intermission (2-3 seconds) with wave number display
- [ ] Endless mode activates after Wave 10 with continued exponential scaling
- [ ] Wave completion detection works correctly (all asteroids destroyed)
- [ ] Player feedback shows current wave number, next wave preview, and scaling effects
- [ ] Wave restarts properly on player death without losing progression context

### Technical Requirements

- [ ] Code follows TypeScript strict mode standards with proper type safety
- [ ] Maintains 60 FPS during wave transitions and scaling calculations
- [ ] No memory leaks during extended endless mode sessions (20+ waves)
- [ ] Integrates seamlessly with existing AsteroidManager and ShardManager systems
- [ ] Wave data persistence for run summary and meta-progression tracking
- [ ] Scaling calculations use deterministic math for consistent difficulty curves
- [ ] Performance optimization for high wave numbers (100+ in endless mode)

### Game Design Requirements

- [ ] Wave 1 serves as natural tutorial with slow, manageable asteroid count
- [ ] Difficulty curve feels smooth and progressive without sudden spikes
- [ ] Endless mode maintains engagement through meaningful scaling progression
- [ ] Wave transitions provide brief rest periods without disrupting game flow
- [ ] Visual feedback clearly communicates wave progression and upcoming challenges
- [ ] Scaling maintains balance between challenge increase and reward improvement

## Technical Specifications

### Files to Create/Modify

**New Files:**

- `src/systems/WaveManager.ts` - Main wave management system with scaling and progression logic
- `src/ui/WaveDisplay.ts` - Wave number and progression UI component
- `src/config/waves.ts` - Wave configuration data and scaling formulas
- `src/utils/ScalingMath.ts` - Mathematical utilities for exponential scaling calculations
- `tests/systems/WaveManager.test.ts` - Unit tests for wave logic and scaling formulas

**Modified Files:**

- `src/scenes/GameScene.ts` - Integrate WaveManager with existing asteroid spawning flow
- `src/systems/AsteroidManager.ts` - Apply wave-based scaling to asteroid properties
- `src/systems/ShardManager.ts` - Apply wave-based scaling to shard yields
- `src/config/balance.ts` - Add wave progression and scaling configuration

### Class/Interface Definitions

```typescript
// Wave configuration interface
interface WaveConfig {
  baseAsteroidCount: number; // Starting asteroid count (4)
  maxAsteroidCount: number; // Cap for performance (20)
  scalingRates: {
    healthPerWave: number; // HP increase per wave (0.20 = +20%)
    speedPerWave: number; // Speed increase per wave (0.05 = +5%)
    yieldPerWave: number; // Shard yield increase per wave (0.05 = +5%)
  };
  intermissionDuration: number; // Time between waves in milliseconds (2500)
  endlessStartWave: number; // Wave when endless mode begins (11)
  tutorialWaves: number; // Number of tutorial waves with fixed scaling (2)
}

// Wave state information
interface WaveState {
  currentWave: number;
  asteroidsRemaining: number;
  asteroidsDestroyed: number;
  waveStartTime: number;
  waveEndTime?: number;
  isIntermission: boolean;
  isEndless: boolean;
  scalingMultipliers: {
    health: number;
    speed: number;
    yield: number;
  };
}

// Wave statistics for tracking
interface WaveStats {
  waveNumber: number;
  duration: number; // milliseconds
  asteroidsDestroyed: number;
  shardsCollected: number;
  playerDeaths: number;
  finalScore: number;
}

// Main Wave Manager System
class WaveManager extends Phaser.Events.EventEmitter {
  private scene: Phaser.Scene;
  private config: WaveConfig;
  private currentState: WaveState;
  private waveStats: WaveStats[];
  private asteroidManager: AsteroidManager;
  private shardManager: ShardManager;
  private waveDisplay: WaveDisplay;
  private intermissionTimer?: Phaser.Time.TimerEvent;

  constructor(
    scene: Phaser.Scene,
    config: WaveConfig,
    asteroidManager: AsteroidManager,
    shardManager: ShardManager
  ) {
    super();
    this.scene = scene;
    this.config = config;
    this.asteroidManager = asteroidManager;
    this.shardManager = shardManager;
    this.initializeWaveState();
  }

  public startWave(waveNumber?: number): void {
    // Begin specified wave or continue progression
  }

  public onAsteroidDestroyed(): void {
    // Track asteroid destruction and check for wave completion
  }

  public onPlayerDeath(): void {
    // Handle player death and wave restart logic
  }

  public getCurrentWave(): number {
    return this.currentState.currentWave;
  }

  public getWaveState(): WaveState {
    return { ...this.currentState };
  }

  public getScalingMultipliers(): WaveState['scalingMultipliers'] {
    return { ...this.currentState.scalingMultipliers };
  }

  public getWaveStats(): WaveStats[] {
    return [...this.waveStats];
  }

  private initializeWaveState(): void {
    // Set up initial wave state
  }

  private calculateScalingMultipliers(waveNumber: number): WaveState['scalingMultipliers'] {
    // Apply exponential scaling formulas
  }

  private calculateAsteroidCount(waveNumber: number): number {
    // Determine asteroid spawn count for wave
  }

  private spawnWaveAsteroids(): void {
    // Coordinate with AsteroidSpawner to create scaled asteroids
  }

  private checkWaveCompletion(): void {
    // Detect when all asteroids destroyed
  }

  private completeWave(): void {
    // Handle wave completion and start intermission
  }

  private startIntermission(): void {
    // Brief pause with wave transition display
  }

  private endIntermission(): void {
    // End intermission and start next wave
  }

  private recordWaveStats(): void {
    // Store wave performance data
  }

  private transitionToEndless(): void {
    // Activate endless mode mechanics
  }
}

// Wave display UI component
class WaveDisplay extends Phaser.GameObjects.Container {
  private waveText: Phaser.GameObjects.Text;
  private progressBar: Phaser.GameObjects.Rectangle;
  private progressFill: Phaser.GameObjects.Rectangle;
  private nextWaveText: Phaser.GameObjects.Text;
  private scalingDisplay: Phaser.GameObjects.Text;
  private isVisible: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.createDisplayElements();
  }

  public showWaveStart(waveNumber: number, scalingInfo: WaveState['scalingMultipliers']): void {
    // Display wave start information with scaling preview
  }

  public updateProgress(asteroidsRemaining: number, totalAsteroids: number): void {
    // Update progress bar based on remaining asteroids
  }

  public showIntermission(nextWave: number, duration: number): void {
    // Display intermission countdown and next wave preview
  }

  public showEndlessMode(): void {
    // Special display for endless mode activation
  }

  public hide(): void {
    // Hide wave display elements
  }

  private createDisplayElements(): void {
    // Create wave display UI elements with neon styling
  }

  private animateWaveStart(): void {
    // Dramatic wave start animation
  }

  private animateProgressUpdate(): void {
    // Smooth progress bar animation
  }
}

// Scaling mathematics utility
class ScalingMath {
  public static calculateExponentialScaling(
    baseValue: number,
    wave: number,
    scalingRate: number,
    startWave: number = 1
  ): number {
    // Calculate exponential scaling: base * (1 + rate)^(wave - startWave)
    if (wave < startWave) return baseValue;
    return baseValue * Math.pow(1 + scalingRate, wave - startWave);
  }

  public static calculateLinearScaling(
    baseValue: number,
    wave: number,
    scalingRate: number,
    startWave: number = 1
  ): number {
    // Calculate linear scaling: base + (rate * (wave - startWave))
    if (wave < startWave) return baseValue;
    return baseValue + (scalingRate * (wave - startWave));
  }

  public static clampScaling(
    value: number,
    min: number,
    max: number
  ): number {
    // Clamp scaled values to reasonable bounds
    return Math.max(min, Math.min(max, value));
  }

  public static roundToNearestInteger(value: number): number {
    // Round scaling results to nearest integer for discrete values
    return Math.round(value);
  }

  public static formatScalingDisplay(multiplier: number): string {
    // Format scaling multiplier for UI display (e.g., "1.44x" for 44% increase)
    return `${multiplier.toFixed(2)}x`;
  }
}
```

### Integration Points

**Scene Integration:**

- GameScene: WaveManager orchestrates asteroid spawning and wave transitions
- GameScene: Wave completion triggers scene-wide events for UI updates
- GameScene: Player death resets wave state appropriately

**System Dependencies:**

- AsteroidManager: Receives scaled properties (HP, speed) for asteroid creation
- ShardManager: Receives scaled yield multipliers for shard spawning
- AsteroidSpawner: Gets asteroid count and positioning requirements from WaveManager

**Event Communication:**

- Emits: `wave-started` when new wave begins
- Emits: `wave-completed` when all asteroids destroyed
- Emits: `intermission-started` during wave transition
- Emits: `endless-mode-activated` when transitioning to endless scaling
- Listens: `asteroid-destroyed` from AsteroidManager
- Listens: `player-death` from GameScene

## Implementation Tasks

### Dev Agent Record

**Tasks:**

- [ ] Create WaveConfig interface and add to balance.ts with exact GDD scaling values (+20% HP, +5% speed, +5% yield)
- [ ] Implement ScalingMath utility class with exponential scaling formulas and performance optimization
- [ ] Create WaveManager class with wave progression logic and state management
- [ ] Add wave completion detection based on AsteroidManager.getActiveCount() reaching zero
- [ ] Implement intermission system with 2.5-second timer and wave transition display
- [ ] Create scaling multiplier calculation: health=1.2^(wave-1), speed=1.05^(wave-1), yield=1.05^(wave-1)
- [ ] Add asteroid count progression: Wave 1-2 = 4 asteroids, Wave 3+ = 4 + (wave-2) asteroids, max 20
- [ ] Integrate WaveManager with AsteroidManager for scaled asteroid properties
- [ ] Integrate WaveManager with ShardManager for scaled shard yields
- [ ] Create WaveDisplay UI component with neon styling and progress tracking
- [ ] Add endless mode transition at Wave 11 with continued exponential scaling
- [ ] Implement wave statistics tracking for run summary and meta-progression
- [ ] Add player death handling with appropriate wave restart logic
- [ ] Create wave start animations and intermission countdown display
- [ ] Write unit tests for scaling math formulas and wave progression logic
- [ ] Integration testing with existing asteroid and shard systems
- [ ] Performance testing for high wave numbers (50+ waves) in endless mode

**Debug Log:**
| Task | File | Change | Reverted? |
|------|------|--------|-----------|
| | | | |

**Completion Notes:**

<!-- Only note deviations from requirements, keep under 50 words -->

**Change Log:**

<!-- Only requirement changes during implementation -->

## Game Design Context

**GDD Reference:** Section 5 (Level/Wave Design)

**Game Mechanic:** Progressive difficulty system that maintains engagement through balanced challenge/reward scaling

**Player Experience Goal:** Create a smooth difficulty curve that feels challenging but fair, with clear progression markers and meaningful endless mode for long-term engagement. Players should feel their skills improving as they reach higher waves.

**Balance Parameters:**

- Tutorial Phase: Waves 1-2 with gentle introduction (4 large, slow asteroids)
- Progression Phase: Waves 3-10 with steady scaling and asteroid count increases
- Endless Phase: Wave 11+ with continued exponential scaling and performance caps
- Scaling Rates: Health +20%, Speed +5%, Yield +5% per wave (exponential)
- Performance Caps: Max 20 asteroids, reasonable speed/HP limits for high waves

## Testing Requirements

### Unit Tests

**Test Files:**

- `tests/systems/WaveManager.test.ts`
- `tests/utils/ScalingMath.test.ts`
- `tests/ui/WaveDisplay.test.ts`

**Test Scenarios:**

- ScalingMath calculates correct exponential values for health, speed, and yield
- WaveManager progresses waves correctly with proper asteroid count increases
- Wave completion detection triggers correctly when all asteroids destroyed
- Endless mode activates at Wave 11 with continued scaling
- Intermission timing works correctly with smooth transitions
- Wave statistics tracking accumulates data accurately
- Performance remains stable during high wave numbers (50+ waves)

### Integration Tests

**Manual Test Cases:**

1. **Wave Progression Test**
   - Expected: Smooth difficulty increase from Wave 1-10, then endless mode
   - Performance: 60 FPS maintained throughout wave transitions

2. **Scaling Formula Test**
   - Expected: Wave 5 asteroid has 2.07x health, 1.22x speed, 1.22x shard yield
   - Edge Case: High wave numbers (30+) maintain reasonable performance

3. **Wave Completion Test**
   - Expected: Wave ends immediately when last asteroid destroyed
   - Performance: Intermission and next wave start within 3 seconds

4. **Endless Mode Test**
   - Expected: Continuous scaling past Wave 10 without performance degradation
   - Performance: Stable memory usage during extended sessions (20+ waves)

### Performance Tests

**Metrics to Verify:**

- Wave transitions complete within 100ms including scaling calculations
- Memory usage stays stable during endless mode (no leaks from wave objects)
- Scaling calculations for Wave 50+ complete within 10ms
- 60 FPS maintained during high wave numbers with maximum asteroid counts

## Dependencies

**Story Dependencies:**

- CGE-002: Asteroid System (completed) - Required for asteroid scaling integration
- CGE-004: Neon Shards Collection (completed) - Required for shard yield scaling

**Technical Dependencies:**

- Existing AsteroidManager and ShardManager systems
- GameScene update loop for wave progression timing
- UI system for wave display and progress feedback

**Asset Dependencies:**

- Wave transition UI: Neon-styled wave number and progress displays
- Location: `assets/ui/wave-display.png`, `progress-bar.png`
- Wave completion sound: Audio feedback for wave completion
- Location: `assets/audio/wave-complete.ogg`

## Definition of Done

- [ ] All acceptance criteria met and verified through testing
- [ ] Code reviewed and follows TypeScript strict mode standards
- [ ] Unit tests written and passing (>90% coverage for wave logic)
- [ ] Integration tests passing with asteroid and shard systems
- [ ] Performance targets met (60 FPS, stable memory, fast transitions)
- [ ] No ESLint warnings or errors in wave management code
- [ ] Scaling formulas match GDD specifications exactly (+20% HP, +5% speed/yield)
- [ ] Wave progression follows design specification (tutorial → progression → endless)
- [ ] UI feedback provides clear wave information and progress tracking
- [ ] Endless mode maintains engagement without performance degradation

## Notes

**Implementation Notes:**

- Use `Math.pow()` for exponential scaling but cache results for repeated calculations
- Implement wave state as immutable objects to prevent accidental mutations
- Use Phaser's Timer Events for intermission timing rather than manual delta tracking
- Round scaled values appropriately (health to integers, speed to 2 decimals)

**Design Decisions:**

- Exponential scaling: Creates meaningful long-term progression in endless mode
- Asteroid count cap: Prevents performance issues at very high waves
- Tutorial waves: Fixed scaling for first 2 waves ensures predictable learning experience
- Intermission duration: Brief enough to maintain pace, long enough for strategic planning

**Future Considerations:**

- Special wave types with unique mechanics (boss waves, survival waves)
- Wave-based unlock system for new upgrade options
- Daily/weekly wave challenges with leaderboards
- Dynamic scaling based on player performance metrics