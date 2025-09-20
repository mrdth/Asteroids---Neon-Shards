# Story: Preload Scene - Asset Loading & Progress Display

**Epic:** Scene Infrastructure
**Story ID:** SI-002
**Priority:** High
**Points:** 8
**Status:** New

## Description

Implement the Preload Scene that handles all game asset loading with a visually appealing progress display, object pool warming, and smooth transition to the Menu Scene. This scene provides essential user feedback during the loading process while establishing the vaporwave aesthetic through loading screen design.

The Preload Scene manages the complete asset pipeline including sprites, audio, shader assets, and data files. It features a neon-styled progress bar with percentage display, handles loading errors gracefully, and warms object pools to prevent gameplay hitches. The loading experience should feel premium and match the game's vaporwave identity.

**GDD Reference:** Section 7 (Technical Constraints) - "Performance Targets: 60 FPS, <3s load, <200MB memory" and Section 6 (UI/UX Design) - "Neon background, tech-tree style menus"

**Architecture Reference:** Section 5 (Scenes & Flow) - "PreloadScene: load atlases, audio, bitmap fonts; show progress bar; warm pools"

## Acceptance Criteria

### Functional Requirements

- [ ] Loads all game assets (sprites, audio, fonts, data) with proper error handling
- [ ] Displays neon-styled progress bar with percentage and current asset information
- [ ] Warms object pools for asteroids, bullets, and shards to prevent runtime allocation
- [ ] Handles asset loading failures gracefully with retry options
- [ ] Transitions smoothly to Menu Scene when loading completes
- [ ] Shows estimated time remaining during loading process
- [ ] Provides visual feedback for different asset types (sprites, audio, data)
- [ ] Maintains 60 FPS during loading process without blocking

### Technical Requirements

- [ ] Code follows TypeScript strict mode standards with proper type safety
- [ ] Total loading time stays under 3 seconds on target devices
- [ ] Memory usage stays under 200MB after all assets loaded
- [ ] Implements proper asset caching and compression utilization
- [ ] Uses Phaser 3 LoaderPlugin with custom progress handling
- [ ] No memory leaks during asset loading and pool warming
- [ ] Error recovery system for failed asset loads
- [ ] Proper cleanup of loading resources after scene transition

### Game Design Requirements

- [ ] Loading screen matches vaporwave aesthetic with neon colors and retro styling
- [ ] Progress feedback feels responsive and informative (not just a spinning loader)
- [ ] Loading time feels appropriately brief for the game's pick-up-and-play nature
- [ ] Visual design builds anticipation for gameplay without being overly elaborate
- [ ] Error messages are clear and actionable for players
- [ ] Loading animation is smooth and visually appealing

## Technical Specifications

### Files to Create/Modify

**New Files:**

- `src/scenes/PreloadScene.ts` - Main preload scene with asset loading and progress display
- `src/systems/AssetLoader.ts` - Centralized asset loading system with error handling
- `src/ui/LoadingBar.ts` - Neon-styled progress bar component
- `src/utils/PoolWarmer.ts` - Object pool initialization utility
- `tests/scenes/PreloadScene.test.ts` - Unit tests for loading logic and error handling

**Modified Files:**

- `src/scenes/BootScene.ts` - Add transition to PreloadScene
- `src/config/assets.ts` - Create centralized asset manifest with paths and loading priorities
- `assets/manifest.json` - Asset metadata for loading system

### Class/Interface Definitions

```typescript
// Asset manifest interface
interface AssetManifest {
  sprites: AssetEntry[];
  audio: AssetEntry[];
  fonts: AssetEntry[];
  data: AssetEntry[];
  shaders: AssetEntry[];
}

// Individual asset entry
interface AssetEntry {
  key: string;
  path: string;
  type: string;
  size?: number; // Estimated file size for progress calculation
  priority: 'critical' | 'high' | 'normal' | 'low';
  optional?: boolean; // Asset can fail without blocking game
}

// Loading progress data
interface LoadingProgress {
  totalAssets: number;
  loadedAssets: number;
  totalBytes: number;
  loadedBytes: number;
  currentAsset: string;
  estimatedTimeRemaining: number;
  percentage: number;
}

// Main Preload Scene class
class PreloadScene extends Phaser.Scene {
  private assetLoader!: AssetLoader;
  private loadingBar!: LoadingBar;
  private poolWarmer!: PoolWarmer;
  private loadingProgress: LoadingProgress;
  private startTime: number;
  private progressText!: Phaser.GameObjects.Text;
  private assetText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "PreloadScene" });
  }

  public init(): void {
    // Initialize loading systems and progress tracking
  }

  public preload(): void {
    // Load critical boot assets and start main loading process
  }

  public create(): void {
    // Set up loading UI, start asset loading, warm pools
  }

  private setupLoadingUI(): void {
    // Create neon-styled loading interface
  }

  private startAssetLoading(): void {
    // Begin comprehensive asset loading process
  }

  private onLoadProgress(progress: LoadingProgress): void {
    // Update progress bar and text displays
  }

  private onLoadComplete(): void {
    // Warm pools and transition to Menu Scene
  }

  private onLoadError(asset: AssetEntry, error: Error): void {
    // Handle loading failures with retry options
  }

  private calculateEstimatedTime(
    loadedBytes: number,
    totalBytes: number,
    elapsedTime: number
  ): number {
    // Calculate remaining load time based on current progress
  }

  private transitionToMenu(): void {
    // Smooth transition to Menu Scene with cleanup
  }
}

// Centralized asset loading system
class AssetLoader extends Phaser.Events.EventEmitter {
  private scene: Phaser.Scene;
  private manifest: AssetManifest;
  private loadingQueue: AssetEntry[];
  private failedAssets: AssetEntry[];
  private retryAttempts: Map<string, number>;

  constructor(scene: Phaser.Scene, manifest: AssetManifest) {
    super();
    this.scene = scene;
    this.manifest = manifest;
  }

  public async loadAll(): Promise<void> {
    // Load all assets with priority ordering and error handling
  }

  public async loadAssetCategory(category: keyof AssetManifest): Promise<void> {
    // Load specific category of assets (sprites, audio, etc.)
  }

  public getLoadingProgress(): LoadingProgress {
    // Return current loading progress data
  }

  private async loadAsset(asset: AssetEntry): Promise<void> {
    // Load individual asset with error handling and retry logic
  }

  private handleAssetError(asset: AssetEntry, error: Error): void {
    // Implement retry logic and error recovery
  }

  private validateAsset(asset: AssetEntry): boolean {
    // Verify loaded asset integrity
  }
}

// Neon-styled loading bar component
class LoadingBar extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private fillBar: Phaser.GameObjects.Rectangle;
  private glowEffect: Phaser.GameObjects.Rectangle;
  private borderGlow: Phaser.GameObjects.Rectangle;
  private currentProgress: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y);
    this.createLoadingBarElements(width, height);
  }

  public updateProgress(percentage: number): void {
    // Smooth progress animation with neon glow effects
  }

  public setGlowIntensity(intensity: number): void {
    // Adjust neon glow effect based on loading activity
  }

  private createLoadingBarElements(width: number, height: number): void {
    // Create layered loading bar with neon aesthetic
  }

  private animateGlow(): void {
    // Pulsing glow animation for visual appeal
  }
}

// Object pool warming utility
class PoolWarmer {
  private scene: Phaser.Scene;
  private warmupTargets: Map<string, number>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.warmupTargets = new Map();
  }

  public setWarmupTarget(poolName: string, count: number): void {
    // Set number of objects to pre-create for each pool
  }

  public async warmAllPools(): Promise<void> {
    // Pre-create objects for all registered pools
  }

  private async warmPool(poolName: string, count: number): Promise<void> {
    // Pre-create objects for specific pool
  }

  public getWarmupProgress(): { completed: number; total: number } {
    // Return pool warming progress for display
  }
}
```

### Integration Points

**Scene Flow Integration:**

- BootScene: Transitions to PreloadScene after initialization
- PreloadScene: Transitions to MenuScene after loading completion
- Error handling: Fallback options for failed loads

**System Dependencies:**

- Phaser LoaderPlugin: Core asset loading functionality
- Object pools: Asteroid, bullet, and shard pool pre-warming
- Audio system: Sound effect and music asset loading

**Asset Pipeline Integration:**

- Vite build system: Asset optimization and compression
- Texture atlases: Sprite sheet loading and frame configuration
- Audio compression: OGG format with fallbacks

## Implementation Tasks

### Dev Agent Record

**Tasks:**

- [ ] Create AssetManifest interface and populate assets.ts with complete game asset list
- [ ] Implement AssetLoader class with priority-based loading and comprehensive error handling
- [ ] Create LoadingBar component with neon glow effects and smooth progress animation
- [ ] Build PreloadScene with full loading UI (progress bar, percentage, current asset display)
- [ ] Add PoolWarmer utility for pre-creating asteroid, bullet, and shard object pools
- [ ] Implement loading progress calculation with estimated time remaining
- [ ] Add error recovery system with retry logic for failed asset loads
- [ ] Create neon-styled loading screen background matching vaporwave aesthetic
- [ ] Integrate audio loading with proper format detection and fallbacks
- [ ] Add texture atlas loading for optimized sprite management
- [ ] Implement shader asset loading for neon effect pipelines
- [ ] Create smooth scene transition from PreloadScene to MenuScene
- [ ] Add loading performance monitoring and optimization
- [ ] Write unit tests for AssetLoader error handling and retry logic
- [ ] Test loading performance across different network conditions
- [ ] Verify memory usage stays under 200MB target after all assets loaded

**Debug Log:**
| Task | File | Change | Reverted? |
|------|------|--------|-----------|
| | | | |

**Completion Notes:**

<!-- Only note deviations from requirements, keep under 50 words -->

**Change Log:**

<!-- Only requirement changes during implementation -->

## Game Design Context

**GDD Reference:** Section 7 (Technical Constraints) and Section 6 (UI/UX Design)

**Game Mechanic:** Loading experience that builds anticipation while providing technical foundation

**Player Experience Goal:** Create a premium loading experience that feels fast, informative, and visually appealing. Players should feel confident that a polished game is loading rather than experiencing generic loading screens.

**Technical Parameters:**

- Loading Time Target: <3 seconds total load time
- Memory Budget: <200MB after all assets loaded
- Progress Feedback: Real-time percentage, asset names, time estimates
- Error Tolerance: Graceful handling of network issues and missing assets
- Visual Quality: Neon aesthetic matching game's vaporwave identity

## Testing Requirements

### Unit Tests

**Test Files:**

- `tests/scenes/PreloadScene.test.ts`
- `tests/systems/AssetLoader.test.ts`
- `tests/ui/LoadingBar.test.ts`
- `tests/utils/PoolWarmer.test.ts`

**Test Scenarios:**

- AssetLoader handles network failures and implements retry logic correctly
- LoadingBar progress animation is smooth and responsive to updates
- PoolWarmer pre-creates correct number of objects for each pool type
- PreloadScene transitions to MenuScene only after successful loading
- Error recovery presents clear options for players when assets fail
- Progress calculation accurately reflects loading state and time estimates
- Memory usage monitoring detects and prevents excessive allocation

### Integration Tests

**Manual Test Cases:**

1. **Fast Network Loading Test**
   - Expected: <2 seconds total load time, smooth progress animation
   - Performance: 60 FPS maintained during loading, no visual hitches

2. **Slow Network Loading Test**
   - Expected: Accurate time estimates, responsive progress feedback
   - Edge Case: Loading doesn't timeout prematurely on slow connections

3. **Asset Failure Recovery Test**
   - Expected: Clear error messages, retry options, graceful degradation
   - Edge Case: Game remains playable even with some failed optional assets

4. **Pool Warming Verification Test**
   - Expected: No allocation hitches during initial asteroid/bullet spawning
   - Performance: Smooth 60 FPS maintained during first wave

### Performance Tests

**Metrics to Verify:**

- Total loading time under 3 seconds on target network speeds
- Memory usage under 200MB after all assets and pools initialized
- Progress update frequency maintains 60 FPS without blocking
- Pool warming completes within 500ms of asset loading completion

## Dependencies

**Story Dependencies:**

- SI-001: Boot Scene (completed) - Required for scene flow initialization

**Technical Dependencies:**

- Phaser 3.70+ LoaderPlugin for asset management
- Vite build system for asset optimization and compression
- WebGL support for neon shader effects

**Asset Dependencies:**

- Complete sprite atlas: All game sprites in optimized format
- Location: `assets/images/atlas.png`, `atlas.json`
- Audio assets: All game sounds in OGG format with MP3 fallbacks
- Location: `assets/audio/*.ogg`, `assets/audio/fallback/*.mp3`
- Font assets: Bitmap fonts for UI text
- Location: `assets/fonts/neon-font.png`, `neon-font.xml`

## Definition of Done

- [ ] All acceptance criteria met and verified through testing
- [ ] Code reviewed and follows TypeScript strict mode standards
- [ ] Unit tests written and passing (>90% coverage for loading logic)
- [ ] Integration tests passing with BootScene and MenuScene transitions
- [ ] Performance targets met (<3s load time, <200MB memory, 60 FPS)
- [ ] No ESLint warnings or errors in preload system code
- [ ] Asset loading handles errors gracefully with clear user feedback
- [ ] Object pools are properly warmed to prevent runtime allocation hitches
- [ ] Loading UI matches vaporwave aesthetic and provides clear progress feedback
- [ ] Scene transitions are smooth without visual artifacts or memory leaks

## Notes

**Implementation Notes:**

- Use `this.load.on('progress')` for real-time progress updates
- Implement loading queue with priority ordering (critical assets first)
- Cache estimated file sizes for accurate progress calculation
- Use `this.tweens` for smooth loading bar animations
- Implement proper cleanup to prevent memory leaks

**Design Decisions:**

- Priority-based loading: Critical gameplay assets loaded first
- Error tolerance: Optional assets can fail without blocking game launch
- Pool warming: Prevents frame drops during initial gameplay
- Neon aesthetic: Loading screen establishes visual identity early

**Future Considerations:**

- Progressive loading: Start gameplay with basic assets, load enhanced assets during play
- Dynamic quality: Adjust asset quality based on device performance
- Caching strategy: Local storage for faster subsequent loads
- Background loading: Continue loading non-critical assets during gameplay