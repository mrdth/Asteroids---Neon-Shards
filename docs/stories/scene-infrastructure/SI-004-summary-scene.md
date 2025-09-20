# Story: Summary Scene - Run Results & Shard Persistence

**Epic:** Scene Infrastructure
**Story ID:** SI-004
**Priority:** High
**Points:** 12
**Status:** New

## Description

Implement the Summary Scene that displays end-of-run statistics, converts collected shards to persistent meta-currency, and provides satisfying closure to each gameplay session. This scene is crucial for the roguelite progression loop as it bridges individual runs with long-term meta-progression through shard persistence and performance feedback.

The Summary Scene showcases player achievements with animated statistics, converts run shards to persistent currency for upgrades, provides detailed breakdowns of performance metrics, and offers smooth transitions to either restart gameplay or access the upgrade system. The presentation should feel rewarding even after unsuccessful runs.

**GDD Reference:** Section 2.4 (Core Loop Flow) - "Die → Summary & Shard Persistence → Retry" and Section 3 (Progression Systems) - "Shard Persistence: Stored after each run → upgrade pool"

**Architecture Reference:** Section 5 (Scenes & Flow) - "SummaryScene: display run stats, convert shards to persistent currency"

## Acceptance Criteria

### Functional Requirements

- [ ] Displays comprehensive run statistics (waves reached, asteroids destroyed, time survived, accuracy)
- [ ] Shows collected shards for current run with conversion animation to persistent total
- [ ] Converts run shards to persistent meta-currency with 1:1 ratio (no loss)
- [ ] Provides options to Play Again, View Upgrades, or Return to Menu
- [ ] Calculates and displays performance metrics (shards per minute, accuracy percentage, survival time)
- [ ] Shows highest wave reached and compares to personal best
- [ ] Animated number counters create satisfying progression display
- [ ] Persists all statistics and currency to local storage
- [ ] Handles both death scenarios and manual quit scenarios appropriately

### Technical Requirements

- [ ] Code follows TypeScript strict mode standards with proper type safety
- [ ] Scene loads and displays within 500ms of game ending
- [ ] No memory leaks during repeated summary access across multiple runs
- [ ] Persistence operations complete reliably without data corruption
- [ ] Integrates with existing save system for consistent data management
- [ ] Statistics calculations handle edge cases (zero values, long survival times)
- [ ] Smooth animations maintain 60 FPS during all display sequences

### Game Design Requirements

- [ ] Summary feels rewarding and motivating rather than punitive after death
- [ ] Statistics presentation highlights positive achievements and improvements
- [ ] Shard conversion animation emphasizes progression value of each run
- [ ] Visual design matches vaporwave aesthetic with satisfying completion feeling
- [ ] Clear call-to-action for continuing progression (upgrades) or playing again
- [ ] Performance metrics help players understand their improvement areas

## Technical Specifications

### Files to Create/Modify

**New Files:**

- `src/scenes/SummaryScene.ts` - Main summary scene with statistics display and persistence
- `src/ui/StatisticsDisplay.ts` - Animated statistics presentation component
- `src/ui/ShardConverter.ts` - Shard-to-currency conversion animation component
- `src/systems/ProgressionTracker.ts` - Performance metrics calculation and personal best tracking
- `src/data/RunStats.ts` - Run statistics data structures and calculation utilities
- `tests/scenes/SummaryScene.test.ts` - Unit tests for summary logic and persistence

**Modified Files:**

- `src/scenes/GameScene.ts` - Add transition to SummaryScene on game over
- `src/systems/SaveSystem.ts` - Extend save system for run statistics and personal bests
- `src/config/progression.ts` - Add progression configuration and achievement thresholds

### Class/Interface Definitions

```typescript
// Complete run statistics interface
interface RunStatistics {
  // Basic run info
  runId: string;
  startTime: number;
  endTime: number;
  duration: number; // milliseconds

  // Progression metrics
  wavesReached: number;
  highestWave: number;
  asteroidsDestroyed: number;
  shardsCollected: number;
  finalScore: number;

  // Performance metrics
  accuracy: number; // shots hit / shots fired
  shotsFired: number;
  shotsHit: number;
  deathCount: number;
  damageDealt: number;

  // Derived metrics
  shardsPerMinute: number;
  averageWaveDuration: number;
  survivalTime: number;

  // Meta info
  gameVersion: string;
  isPersonalBest: boolean;
}

// Personal best records
interface PersonalBests {
  highestWave: number;
  longestSurvival: number; // milliseconds
  mostShardsCollected: number;
  highestScore: number;
  bestAccuracy: number;
  mostAsteroidsDestroyed: number;
  fastestWaveCompletion: number; // milliseconds for single wave
}

// Summary scene data from game session
interface SummaryData {
  runStats: RunStatistics;
  previousBests: PersonalBests;
  newBests: (keyof PersonalBests)[];
  totalPersistentShards: number; // before this run
  earnedShards: number; // from this run
}

// Main Summary Scene class
class SummaryScene extends Phaser.Scene {
  private summaryData!: SummaryData;
  private statisticsDisplay!: StatisticsDisplay;
  private shardConverter!: ShardConverter;
  private progressionTracker!: ProgressionTracker;
  private continueButton!: Phaser.GameObjects.Container;
  private upgradesButton!: Phaser.GameObjects.Container;
  private menuButton!: Phaser.GameObjects.Container;
  private personalBestIndicators: Phaser.GameObjects.Text[] = [];

  constructor() {
    super({ key: "SummaryScene" });
  }

  public init(data: SummaryData): void {
    // Initialize scene with run data
  }

  public create(): void {
    // Create summary UI and start presentation sequence
  }

  private createBackground(): void {
    // Vaporwave-styled background for summary
  }

  private createStatisticsDisplay(): void {
    // Animated statistics presentation
  }

  private createShardConversion(): void {
    // Shard-to-currency conversion animation
  }

  private createActionButtons(): void {
    // Navigation options (play again, upgrades, menu)
  }

  private startPresentationSequence(): void {
    // Orchestrated animation sequence for statistics reveal
  }

  private onPlayAgain(): void {
    // Return to GameScene for new run
  }

  private onViewUpgrades(): void {
    // Transition to MetaHub Scene
  }

  private onReturnToMenu(): void {
    // Return to MenuScene
  }

  private persistRunData(): void {
    // Save run statistics and updated persistent totals
  }

  private calculatePerformanceMetrics(): void {
    // Derive performance metrics from raw statistics
  }

  private checkForPersonalBests(): void {
    // Compare current run against personal bests
  }
}

// Animated statistics display component
class StatisticsDisplay extends Phaser.GameObjects.Container {
  private runStats: RunStatistics;
  private statLines: Map<string, Phaser.GameObjects.Text>;
  private animationSequence: Phaser.Tweens.Timeline;
  private personalBestTags: Map<string, Phaser.GameObjects.Sprite>;

  constructor(scene: Phaser.Scene, x: number, y: number, stats: RunStatistics) {
    super(scene, x, y);
    this.runStats = stats;
    this.createStatisticsElements();
  }

  public animateStatistics(newBests: (keyof PersonalBests)[]): Promise<void> {
    // Animated reveal of statistics with personal best highlighting
  }

  public updateStatistic(key: string, value: number): void {
    // Update individual statistic with animation
  }

  private createStatisticsElements(): void {
    // Create text elements for each statistic
  }

  private animateCountUp(
    textObject: Phaser.GameObjects.Text,
    targetValue: number,
    duration: number
  ): Promise<void> {
    // Animated count-up effect for numbers
  }

  private highlightPersonalBest(statKey: string): void {
    // Special highlighting for new personal bests
  }

  private formatStatisticValue(key: string, value: number): string {
    // Format different types of statistics appropriately
  }
}

// Shard conversion animation component
class ShardConverter extends Phaser.GameObjects.Container {
  private runShards: number;
  private persistentShards: number;
  private runShardText: Phaser.GameObjects.Text;
  private persistentShardText: Phaser.GameObjects.Text;
  private conversionArrow: Phaser.GameObjects.Graphics;
  private conversionParticles: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    runShards: number,
    persistentShards: number
  ) {
    super(scene, x, y);
    this.runShards = runShards;
    this.persistentShards = persistentShards;
    this.createConversionElements();
  }

  public animateConversion(): Promise<void> {
    // Animated conversion of run shards to persistent total
  }

  private createConversionElements(): void {
    // Create UI elements for shard conversion display
  }

  private animateShardTransfer(): Promise<void> {
    // Visual transfer animation from run total to persistent total
  }

  private createTransferParticles(): void {
    // Particle effects for shard conversion
  }

  private updatePersistentTotal(): void {
    // Update persistent shard display with new total
  }
}

// Progression tracking and personal best management
class ProgressionTracker {
  private personalBests: PersonalBests;
  private allRunStats: RunStatistics[];
  private saveSystem: SaveSystem;

  constructor(saveSystem: SaveSystem) {
    this.saveSystem = saveSystem;
    this.loadProgressionData();
  }

  public recordRun(runStats: RunStatistics): (keyof PersonalBests)[] {
    // Record new run and check for personal bests
  }

  public getPersonalBests(): PersonalBests {
    return { ...this.personalBests };
  }

  public getRunHistory(limit: number = 10): RunStatistics[] {
    // Get recent run history for analysis
  }

  public calculateImprovementMetrics(currentRun: RunStatistics): {
    improvementAreas: string[];
    strengths: string[];
    recommendations: string[];
  } {
    // Analyze performance and provide improvement suggestions
  }

  private loadProgressionData(): void {
    // Load personal bests and run history from save system
  }

  private saveProgressionData(): void {
    // Persist updated progression data
  }

  private checkPersonalBest(
    statKey: keyof PersonalBests,
    value: number
  ): boolean {
    // Check if current value exceeds personal best
  }

  private updatePersonalBest(
    statKey: keyof PersonalBests,
    value: number
  ): void {
    // Update personal best record
  }

  private derivePerformanceMetrics(runStats: RunStatistics): void {
    // Calculate derived metrics from raw statistics
  }
}
```

### Integration Points

**Scene Flow Integration:**

- GameScene: Transitions to SummaryScene on player death or manual quit
- SummaryScene: Transitions to GameScene (play again), MetaHub (upgrades), or MenuScene
- Data persistence: Coordinates with save system for statistics and currency

**System Dependencies:**

- SaveSystem: Persistent storage for run statistics and personal bests
- ShardManager: Provides run shard totals and collection statistics
- WaveManager: Provides wave progression and completion data
- WeaponSystem: Provides accuracy and combat statistics

**Event Communication:**

- Emits: `run-completed` when summary presentation finishes
- Emits: `shards-converted` when currency conversion completes
- Emits: `personal-best-achieved` for new records
- Listens: `game-ended` from GameScene to initialize summary

## Implementation Tasks

### Dev Agent Record

**Tasks:**

- [ ] Create RunStatistics and PersonalBests interfaces with comprehensive metrics tracking
- [ ] Implement SummaryScene with animated statistics presentation and navigation options
- [ ] Create StatisticsDisplay component with count-up animations and personal best highlighting
- [ ] Build ShardConverter component with satisfying conversion animation and particle effects
- [ ] Add ProgressionTracker class for personal best management and improvement analysis
- [ ] Integrate with existing SaveSystem for persistent statistics and currency storage
- [ ] Create smooth scene transitions from GameScene to SummaryScene on death/quit
- [ ] Add navigation buttons for Play Again, View Upgrades, and Return to Menu
- [ ] Implement performance metrics calculation (accuracy, shards per minute, survival time)
- [ ] Create personal best detection and celebration animations
- [ ] Add comprehensive error handling for save system failures
- [ ] Design vaporwave-styled summary UI matching game aesthetic
- [ ] Write unit tests for statistics calculation and personal best logic
- [ ] Integration testing with GameScene data collection and MetaHub transitions
- [ ] Performance testing for smooth animations and quick scene loading
- [ ] Test data persistence across browser sessions and edge cases

**Debug Log:**
| Task | File | Change | Reverted? |
|------|------|--------|-----------|
| | | | |

**Completion Notes:**

<!-- Only note deviations from requirements, keep under 50 words -->

**Change Log:**

<!-- Only requirement changes during implementation -->

## Game Design Context

**GDD Reference:** Section 2.4 (Core Loop Flow) and Section 3 (Progression Systems)

**Game Mechanic:** Run conclusion system that provides closure and motivation for continued play

**Player Experience Goal:** Create a satisfying conclusion to each run that highlights achievements, provides clear progression feedback, and motivates continued play through visible improvement and upgrade opportunities.

**Design Parameters:**

- Positive Framing: Emphasize achievements and improvements rather than failures
- Clear Progression: Show meaningful progress toward upgrades and personal bests
- Quick Access: Easy navigation to continue playing or access upgrades
- Comprehensive Feedback: Detailed statistics help players understand their performance
- Persistent Value: Every run contributes to long-term progression through shard conversion

## Testing Requirements

### Unit Tests

**Test Files:**

- `tests/scenes/SummaryScene.test.ts`
- `tests/ui/StatisticsDisplay.test.ts`
- `tests/ui/ShardConverter.test.ts`
- `tests/systems/ProgressionTracker.test.ts`

**Test Scenarios:**

- SummaryScene correctly processes and displays run statistics
- StatisticsDisplay animations complete without errors and maintain proper timing
- ShardConverter performs 1:1 conversion from run shards to persistent currency
- ProgressionTracker accurately detects and records personal bests
- Save system integration preserves data integrity across browser sessions
- Scene transitions work correctly to all target scenes (Game, MetaHub, Menu)
- Performance metrics calculations handle edge cases (zero values, extremely long runs)

### Integration Tests

**Manual Test Cases:**

1. **Complete Run Summary Test**
   - Expected: All statistics accurate, animations smooth, personal bests highlighted
   - Performance: Summary loads within 500ms, maintains 60 FPS during animations

2. **Shard Conversion Test**
   - Expected: 1:1 conversion from run shards to persistent total with satisfying animation
   - Edge Case: Large shard amounts (1000+) convert correctly and efficiently

3. **Personal Best Detection Test**
   - Expected: New records properly detected and celebrated with special animations
   - Edge Case: Multiple simultaneous personal bests handled correctly

4. **Navigation Flow Test**
   - Expected: All navigation options work correctly with appropriate scene transitions
   - Performance: Scene transitions complete smoothly without visual artifacts

### Performance Tests

**Metrics to Verify:**

- Summary scene loads within 500ms from GameScene transition
- Statistics animations maintain 60 FPS throughout presentation sequence
- Save operations complete within 200ms for data persistence
- Memory usage stays stable during repeated summary access

## Dependencies

**Story Dependencies:**

- All Core Game Loop stories (CGE-001 through CGE-004) - Required for run data collection
- CS-001: Wave Manager System (pending) - Required for wave progression statistics
- Future: MetaHub Scene story - Required for upgrades navigation

**Technical Dependencies:**

- Existing SaveSystem for data persistence
- Phaser 3 animation system for smooth UI transitions
- LocalStorage support for persistent statistics

**Asset Dependencies:**

- Summary UI elements: Background, buttons, and decorative elements
- Location: `assets/ui/summary-bg.png`, `action-buttons.png`
- Celebration effects: Particle and animation assets for personal bests
- Location: `assets/fx/celebration.png`, `personal-best.png`
- Summary music: Atmospheric track for run conclusion
- Location: `assets/audio/summary-theme.ogg`

## Definition of Done

- [ ] All acceptance criteria met and verified through testing
- [ ] Code reviewed and follows TypeScript strict mode standards
- [ ] Unit tests written and passing (>90% coverage for summary logic)
- [ ] Integration tests passing with GameScene data collection and save system
- [ ] Performance targets met (500ms load, 60 FPS animations, 200ms saves)
- [ ] No ESLint warnings or errors in summary system code
- [ ] Statistics calculations are accurate and handle all edge cases
- [ ] Shard conversion maintains 1:1 ratio without loss or corruption
- [ ] Personal best detection works correctly with proper celebration
- [ ] Scene transitions work smoothly to all target destinations
- [ ] Visual design matches vaporwave aesthetic and feels rewarding

## Notes

**Implementation Notes:**

- Use Phaser Timeline for orchestrated animation sequences
- Implement proper error handling for save system failures with user feedback
- Cache calculated statistics to avoid repeated computation during animations
- Use object pooling for particle effects to maintain performance

**Design Decisions:**

- 1:1 shard conversion: Maintains player trust and simplifies progression calculation
- Positive framing: Focus on achievements rather than failures to encourage continued play
- Comprehensive statistics: Detailed feedback helps players understand and improve performance
- Quick navigation: Immediate access to next action reduces friction in progression loop

**Future Considerations:**

- Achievement system integration with unlock notifications
- Social sharing features for personal bests and exceptional runs
- Run replay system for analyzing successful strategies
- Comparative statistics against global player averages