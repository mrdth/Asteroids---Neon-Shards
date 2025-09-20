# Story: Boot Scene - Phaser Initialization & Pipeline Setup

**Epic:** Scene Infrastructure
**Story ID:** SI-001
**Priority:** High
**Points:** 5
**Status:** New

## Description

Implement the foundational Boot Scene that initializes Phaser systems, sets up render pipelines, configures physics, and establishes the scene flow architecture. This scene runs once at application startup and transitions immediately to the Preload Scene, providing the technical foundation for all subsequent scenes.

The Boot Scene handles low-level Phaser configuration including display scaling, physics world setup, shader pipeline registration for neon effects, and scene management initialization. It ensures consistent rendering across different devices and establishes the technical infrastructure needed for the vaporwave aesthetic.

**GDD Reference:** Section 7 (Technical Constraints) - "Engine: Phaser 3.70+, TypeScript strict mode. Performance Targets: 60 FPS, <3s load, <200MB memory"

**Architecture Reference:** Section 5 (Scenes & Flow) - "BootScene: set scale, physics, pipeline registration → PreloadScene"

## Acceptance Criteria

### Functional Requirements

- [ ] Boot Scene initializes and immediately transitions to Preload Scene without user interaction
- [ ] Phaser 3 display scaling configured for responsive design (desktop and mobile)
- [ ] Arcade Physics world initialized with proper bounds and performance settings
- [ ] Shader pipelines registered for neon glow effects and post-processing
- [ ] Scene management system initialized with proper transition handling
- [ ] Global game configuration applied (physics settings, render settings, input settings)
- [ ] Error handling established for initialization failures
- [ ] Debug mode detection and configuration setup

### Technical Requirements

- [ ] Code follows TypeScript strict mode standards with proper type safety
- [ ] Boot sequence completes within 100ms on target devices
- [ ] No memory leaks during initialization process
- [ ] Proper cleanup of temporary initialization resources
- [ ] Scene transitions use consistent state management patterns
- [ ] Graphics pipeline optimizations applied for 60 FPS target
- [ ] Input system initialization supports keyboard, gamepad, and touch

### Game Design Requirements

- [ ] Boot process is invisible to players (no loading screen needed)
- [ ] Responsive scaling maintains 16:9 aspect ratio preference
- [ ] Physics world bounds match intended gameplay area
- [ ] Neon effect pipelines support intended vaporwave aesthetic
- [ ] Scene flow architecture supports full MVP scene pipeline

## Technical Specifications

### Files to Create/Modify

**New Files:**

- `src/scenes/BootScene.ts` - Main boot scene with Phaser initialization logic
- `src/core/SceneManager.ts` - Scene transition and state management utility
- `src/fx/NeonPipeline.ts` - Custom shader pipeline for neon glow effects
- `src/config/display.ts` - Display and scaling configuration constants
- `tests/scenes/BootScene.test.ts` - Unit tests for boot initialization logic

**Modified Files:**

- `src/main.ts` - Update scene registration to include BootScene as entry point
- `src/config/balance.ts` - Add physics world and display configuration
- `vite/config.dev.mjs` - Ensure shader assets are properly loaded

### Class/Interface Definitions

```typescript
// Display configuration interface
interface DisplayConfig {
  width: number; // Target display width (1920)
  height: number; // Target display height (1080)
  minWidth: number; // Minimum supported width (800)
  minHeight: number; // Minimum supported height (600)
  scaleMode: Phaser.Scale.ScaleModes; // Scaling behavior
  autoCenter: Phaser.Scale.Center; // Centering mode
}

// Physics configuration interface
interface PhysicsConfig {
  gravity: { x: number; y: number }; // Zero gravity for space setting
  bounds: { x: number; y: number; width: number; height: number };
  debug: boolean; // Show physics debug in dev mode
  maxVelocity: number; // Velocity clamp for performance
}

// Boot Scene class
class BootScene extends Phaser.Scene {
  private displayConfig: DisplayConfig;
  private physicsConfig: PhysicsConfig;

  constructor() {
    super({ key: "BootScene" });
  }

  public init(): void {
    // Load configuration, detect device capabilities
  }

  public preload(): void {
    // Load critical assets needed for initialization
  }

  public create(): void {
    // Initialize systems and transition to PreloadScene
  }

  private setupDisplay(): void {
    // Configure responsive scaling and aspect ratio handling
  }

  private setupPhysics(): void {
    // Initialize Arcade Physics with space-appropriate settings
  }

  private setupRenderPipelines(): void {
    // Register neon glow and post-processing shaders
  }

  private setupSceneManager(): void {
    // Initialize scene transition system
  }

  private detectDeviceCapabilities(): void {
    // Check for mobile, gamepad support, WebGL features
  }

  private transitionToPreload(): void {
    // Clean transition to PreloadScene
  }
}

// Scene management utility
class SceneManager {
  private game: Phaser.Game;
  private transitionData: Map<string, any>;

  constructor(game: Phaser.Game) {
    this.game = game;
    this.transitionData = new Map();
  }

  public transition(fromScene: string, toScene: string, data?: any): void {
    // Handle scene transitions with data passing
  }

  public setTransitionData(sceneKey: string, data: any): void {
    // Store data for scene transitions
  }

  public getTransitionData(sceneKey: string): any {
    // Retrieve data from previous scene
  }

  public cleanupTransitionData(sceneKey: string): void {
    // Clean up transition data to prevent memory leaks
  }
}

// Neon glow pipeline for vaporwave effects
class NeonPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game: Phaser.Game) {
    super({
      game: game,
      renderTarget: true,
      fragShader: `
        precision mediump float;
        uniform sampler2D uMainSampler;
        uniform float uGlowIntensity;
        uniform vec3 uNeonColor;
        varying vec2 outTexCoord;

        void main() {
          vec4 color = texture2D(uMainSampler, outTexCoord);
          vec3 glow = uNeonColor * uGlowIntensity;
          gl_FragColor = vec4(color.rgb + glow * color.a, color.a);
        }
      `
    });
  }

  public onPreRender(): void {
    // Set shader uniforms for neon effect
  }
}
```

### Integration Points

**Scene Flow Integration:**

- Main.ts: Register BootScene as the initial scene
- SceneManager: Handle transitions between Boot → Preload → Menu → Game flow
- Error handling: Graceful degradation if initialization fails

**System Dependencies:**

- Phaser 3.70+ core systems for scene management and rendering
- WebGL support detection for shader pipelines
- Device capability detection for responsive scaling

**Configuration Dependencies:**

- Display config: Screen dimensions and scaling behavior
- Physics config: Zero-gravity space physics setup
- Asset pipeline: Shader loading and compilation

## Implementation Tasks

### Dev Agent Record

**Tasks:**

- [ ] Create DisplayConfig and PhysicsConfig interfaces in balance.ts with GDD-compliant values
- [ ] Implement BootScene class with proper Phaser scene lifecycle (init, preload, create)
- [ ] Add responsive display scaling setup with 16:9 aspect ratio preference
- [ ] Configure Arcade Physics world with zero gravity and appropriate bounds
- [ ] Create NeonPipeline class for vaporwave glow effects using WebGL shaders
- [ ] Implement SceneManager utility for consistent scene transitions and data passing
- [ ] Add device capability detection (mobile, gamepad, WebGL support)
- [ ] Set up error handling for initialization failures with fallback options
- [ ] Create scene transition from BootScene to PreloadScene with proper cleanup
- [ ] Update main.ts to register BootScene as entry point instead of GameScene
- [ ] Add debug mode detection for development features (physics debug, performance overlay)
- [ ] Implement proper TypeScript interfaces for all configuration objects
- [ ] Write unit tests for BootScene initialization logic and error handling
- [ ] Test responsive scaling across different screen sizes and aspect ratios
- [ ] Verify shader pipeline registration and neon effect functionality

**Debug Log:**
| Task | File | Change | Reverted? |
|------|------|--------|-----------|
| | | | |

**Completion Notes:**

<!-- Only note deviations from requirements, keep under 50 words -->

**Change Log:**

<!-- Only requirement changes during implementation -->

## Game Design Context

**GDD Reference:** Section 7 (Technical Constraints)

**Game Mechanic:** Technical foundation for consistent game experience across devices

**Player Experience Goal:** Invisible, instant initialization that provides consistent performance and visual quality regardless of device. Players should never see or interact with the boot process.

**Technical Parameters:**

- Display: 1920x1080 target, 800x600 minimum, responsive scaling
- Physics: Zero gravity, world bounds matching display size
- Performance: <100ms boot time, 60 FPS target maintained
- Compatibility: Desktop browsers (primary), mobile browsers (secondary)
- Rendering: WebGL with fallback, neon shader effects ready

## Testing Requirements

### Unit Tests

**Test Files:**

- `tests/scenes/BootScene.test.ts`
- `tests/core/SceneManager.test.ts`
- `tests/fx/NeonPipeline.test.ts`

**Test Scenarios:**

- BootScene completes initialization within 100ms timing budget
- Display scaling responds correctly to different screen sizes and orientations
- Physics world initializes with correct bounds and zero-gravity settings
- Shader pipelines register successfully with proper fallback for unsupported devices
- Scene transitions work correctly with data passing between scenes
- Error handling gracefully manages initialization failures
- Memory usage stays within bounds during initialization process

### Integration Tests

**Manual Test Cases:**

1. **Desktop Browser Test**
   - Expected: Instant boot, responsive scaling, neon effects functional
   - Performance: 60 FPS maintained, <3s total load time

2. **Mobile Browser Test**
   - Expected: Touch controls detected, appropriate scaling applied
   - Performance: Stable framerate on mid-range devices

3. **Error Handling Test**
   - Expected: Graceful fallback when WebGL unavailable
   - Edge Case: Clear error messaging for unsupported browsers

4. **Scene Transition Test**
   - Expected: Smooth transition to PreloadScene without visual artifacts
   - Performance: No memory leaks during scene switches

### Performance Tests

**Metrics to Verify:**

- Boot sequence completes within 100ms on target devices
- Memory usage under 50MB after initialization
- Shader compilation time under 200ms for neon pipeline
- Scene transition time under 16ms (single frame at 60 FPS)

## Dependencies

**Story Dependencies:**

- None (foundational story)

**Technical Dependencies:**

- Phaser 3.70+ with WebGL support
- TypeScript 5+ project with strict mode
- Vite build system for shader asset loading

**Asset Dependencies:**

- Neon effect shaders: Fragment and vertex shader files
- Location: `assets/shaders/neon-glow.frag`, `neon-glow.vert`

## Definition of Done

- [ ] All acceptance criteria met and verified through testing
- [ ] Code reviewed and follows TypeScript strict mode standards
- [ ] Unit tests written and passing (>85% coverage for initialization logic)
- [ ] Integration tests passing with scene transition system
- [ ] Performance targets met (<100ms boot, 60 FPS maintained)
- [ ] No ESLint warnings or errors in boot system code
- [ ] Responsive scaling works across desktop and mobile browsers
- [ ] Shader pipelines function correctly with proper fallback handling
- [ ] Scene flow transitions smoothly from Boot to Preload Scene
- [ ] Error handling provides clear feedback for initialization failures

## Notes

**Implementation Notes:**

- Use `this.scene.start()` for immediate scene transitions without fade effects
- Cache device capabilities during boot to avoid repeated detection calls
- Implement shader fallbacks using feature detection rather than try/catch
- Ensure physics bounds exactly match the scaled display dimensions

**Design Decisions:**

- Zero-gravity physics: Matches space setting and classic Asteroids behavior
- Immediate PreloadScene transition: Boot process should be invisible to players
- WebGL-first approach: Required for neon aesthetic, fallback maintains functionality
- Responsive scaling: Ensures consistent experience across device types

**Future Considerations:**

- Additional shader effects for enhanced vaporwave aesthetic (post-MVP)
- Progressive web app (PWA) initialization hooks (future deployment)
- Advanced device detection for graphics quality scaling (optimization)
- Analytics initialization for telemetry collection (post-launch)