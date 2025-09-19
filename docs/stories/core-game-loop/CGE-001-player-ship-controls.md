# Story: Player Ship Movement & Controls

**Epic:** Core Game Loop
**Story ID:** CGE-001
**Priority:** High
**Points:** 8
**Status:** Completed

## Description

Implement the foundational player ship movement system with momentum-based physics, rotation controls, and screen-wrapping behavior. This system provides the core player interaction mechanics that all other gameplay features will build upon.

The ship uses momentum-based thrust with friction dampening (not instant movement), rotation-based steering, and seamless screen-wrapping that maintains game flow. All controls must be responsive with <100ms input latency to ensure precise player control during fast-paced asteroid dodging.

**GDD Reference:** Section 2.1 (Ship Controls) - "Momentum-based thrust + rotation, friction-dampened. Screen-wrapping movement."

## Acceptance Criteria

### Functional Requirements
- [ ] Ship responds to thrust input with momentum-based acceleration
- [ ] Ship rotates left/right with smooth angular velocity
- [ ] Ship movement maintains momentum when thrust is released
- [ ] Friction dampening gradually reduces velocity over time
- [ ] Screen-wrapping teleports ship seamlessly across screen boundaries
- [ ] Ship sprite rotates to match movement direction
- [ ] All controls respond within 100ms of input
- [ ] Movement system works consistently at different frame rates

### Technical Requirements
- [ ] Code follows TypeScript strict mode standards
- [ ] Maintains 60 FPS on target devices
- [ ] No memory leaks or performance degradation
- [ ] Uses Phaser 3 Arcade Physics for movement calculations
- [ ] Implements proper vector math for thrust calculations
- [ ] Input system abstraction supports keyboard, gamepad, and touch
- [ ] Screen-wrap helper is reusable for other game objects

### Game Design Requirements
- [ ] Thrust power matches GDD specification (220 units/sec²)
- [ ] Turn speed matches GDD specification (210 degrees/sec)
- [ ] Friction coefficient matches GDD specification (0.98 per frame)
- [ ] Movement feels responsive and precise for asteroid dodging
- [ ] Ship behavior matches classic Asteroids physics expectations

## Technical Specifications

### Files to Create/Modify

**New Files:**

- `src/gameobjects/PlayerShip.ts` - Main player ship class with physics and input handling
- `src/systems/InputSystem.ts` - Input abstraction for multiple input methods
- `src/utils/ScreenWrap.ts` - Screen wrapping utility for game objects
- `src/utils/MathUtils.ts` - Vector math utilities for movement calculations
- `tests/gameobjects/PlayerShip.test.ts` - Unit tests for ship behavior
- `tests/utils/ScreenWrap.test.ts` - Unit tests for screen wrapping

**Modified Files:**

- `src/scenes/GameScene.ts` - Add player ship instantiation and input system integration
- `src/config/balance.ts` - Add player movement configuration values (thrust: 220, turnSpeed: 210, friction: 0.98)
- `src/main.ts` - Register input key bindings (WASD/Arrow keys, Space for fire)

### Class/Interface Definitions

```typescript
// Input intent interface
interface IntentInput {
    thrust: number;      // 0-1 intensity
    turn: number;        // -1 to 1 (left/right)
    fire: boolean;       // trigger state
}

// Player ship configuration
interface PlayerConfig {
    thrust: number;      // acceleration force
    turnSpeed: number;   // angular velocity degrees/sec
    friction: number;    // velocity damping coefficient
    maxSpeed: number;    // velocity clamp
}

// PlayerShip class
class PlayerShip extends Phaser.Physics.Arcade.Sprite {
    private config: PlayerConfig;
    private inputSystem: InputSystem;

    constructor(scene: Phaser.Scene, x: number, y: number, config: PlayerConfig) {
        super(scene, x, y, 'ship');
        // Setup physics body, input handling, sprite configuration
    }

    public update(dt: number): void {
        // Process input, apply physics, handle screen wrapping
    }

    private applyThrust(intensity: number, dt: number): void {
        // Calculate thrust vector based on rotation and apply to velocity
    }

    private applyRotation(turnInput: number, dt: number): void {
        // Apply angular velocity based on input
    }

    private applyFriction(dt: number): void {
        // Reduce velocity using friction coefficient
    }
}

// Input system interface
class InputSystem {
    private keyboard: Phaser.Input.Keyboard.KeyboardPlugin;
    private gamepad?: Phaser.Input.Gamepad.Gamepad;

    constructor(scene: Phaser.Scene) {
        // Initialize input sources
    }

    public getIntent(): IntentInput {
        // Combine input sources into normalized intent
    }
}

// Screen wrap utility
class ScreenWrap {
    public static wrap(object: Phaser.GameObjects.GameObject, bounds: Phaser.Geom.Rectangle): void {
        // Handle screen boundary wrapping for any game object
    }
}
```

### Integration Points

**Scene Integration:**

- GameScene: Create player ship instance, call update() in scene update loop
- GameScene: Handle ship destruction events and respawn logic

**System Dependencies:**

- InputSystem: Provides normalized input intents from multiple sources
- ScreenWrap: Utility for boundary wrapping (will be used by asteroids and bullets)
- BALANCE config: Movement parameters for tuning without code changes

**Event Communication:**

- Emits: `ship-destroyed` when player collides with asteroid
- Emits: `ship-thrust` when thrust is applied (for audio/VFX)
- Listens: `game-pause` to halt movement updates
- Listens: `upgrade-applied` to modify movement parameters

## Implementation Tasks

### Dev Agent Record

**Tasks:**

- [x] Create PlayerConfig interface and add to balance.ts configuration with exact GDD values
- [x] Implement InputSystem class with keyboard (WASD/Arrow), gamepad, and touch support
- [x] Create ScreenWrap utility class with boundary detection and seamless wrapping
- [x] Implement PlayerShip class extending Phaser.Physics.Arcade.Sprite
- [x] Configure Arcade Physics body with proper bounds and collision detection
- [x] Add thrust calculation using `Math.cos/sin(rotation)` for direction-based movement
- [x] Implement rotation system with smooth angular velocity in radians
- [x] Add friction dampening using velocity multiplication by friction coefficient
- [x] Integrate screen wrapping into player update loop with proper bounds checking
- [x] Create GameScene integration with player instantiation at screen center
- [x] Add physics body setup and collision world registration
- [x] Write unit tests for PlayerShip movement calculations and edge cases
- [x] Write unit tests for ScreenWrap boundary detection and corner cases
- [x] Integration testing with GameScene update loop and physics world
- [x] Performance testing for 60 FPS maintenance during continuous movement

**Debug Log:**
| Task | File | Change | Reverted? |
|------|------|--------|-----------|
| | | | |

**Completion Notes:**

Ship sprite generated procedurally as white triangle. Added comprehensive Vitest test suite (44 tests passing). All GDD physics parameters implemented exactly as specified. Development server running at localhost:8080.

**Change Log:**

<!-- Only requirement changes during implementation -->

## Game Design Context

**GDD Reference:** Section 2.1 (Ship Controls)

**Game Mechanic:** Momentum-based movement with friction dampening

**Player Experience Goal:** Provide precise, responsive ship control that feels authentic to classic Asteroids while maintaining modern smoothness and responsiveness.

**Balance Parameters:**

- Thrust: 220 units/sec² (provides good acceleration without being overpowered)
- Turn Speed: 210 degrees/sec (allows quick direction changes for asteroid dodging)
- Friction: 0.98 per frame (gradual momentum loss, maintains "space physics" feel)
- Max Speed: 600 units/sec (prevents uncontrollable high-speed situations)

## Testing Requirements

### Unit Tests

**Test Files:**

- `tests/gameobjects/PlayerShip.test.ts`
- `tests/systems/InputSystem.test.ts`
- `tests/utils/ScreenWrap.test.ts`

**Test Scenarios:**

- Ship accelerates correctly when thrust applied with various rotation angles
- Ship rotation responds to turn input with correct angular velocity
- Friction reduces velocity over time without external input
- Screen wrapping teleports ship to opposite edge when crossing boundaries
- Input system correctly normalizes keyboard, gamepad, and touch inputs
- Movement calculations remain consistent at different delta times

### Game Testing

**Manual Test Cases:**

1. **Basic Movement Test**
   - Expected: Ship accelerates smoothly when thrust held, maintains momentum when released
   - Performance: 60 FPS maintained during continuous movement

2. **Rotation and Direction Test**
   - Expected: Ship rotates smoothly, thrust direction matches ship orientation
   - Edge Case: Rapid rotation changes maintain smooth movement

3. **Screen Wrapping Test**
   - Expected: Ship seamlessly wraps from one edge to opposite edge
   - Edge Case: Ship wrapping works correctly at screen corners

4. **Input Responsiveness Test**
   - Expected: All inputs register within 100ms latency
   - Performance: No input lag during high-intensity movement

### Performance Tests

**Metrics to Verify:**

- Frame rate maintains 60 FPS during continuous player movement
- Memory usage stays under 50MB for player ship system
- Input latency remains below 100ms for all input types
- Physics calculations complete within 2ms per frame

## Dependencies

**Story Dependencies:**

- None (foundational story)

**Technical Dependencies:**

- Phaser 3.70+ with Arcade Physics enabled
- TypeScript 5+ project configuration
- Asset pipeline for ship sprite texture

**Asset Dependencies:**

- Ship sprite: 32x32 pixel sprite with clear directional orientation
- Location: `assets/sprites/ship.png`
- Thrust VFX sprite: Engine flame animation frames
- Location: `assets/sprites/thrust-fx.png`

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Code reviewed and approved
- [ ] Unit tests written and passing (>90% coverage)
- [ ] Integration tests passing with GameScene
- [ ] Performance targets met (60 FPS, <100ms input latency)
- [ ] No TypeScript strict mode errors
- [ ] No ESLint warnings or errors
- [ ] Input system supports keyboard, gamepad, and touch
- [ ] Screen wrapping works seamlessly on all screen edges
- [ ] Movement physics match GDD specifications exactly

## Notes

**Implementation Notes:**

- Use `this.body.setVelocity()` for physics-based movement rather than direct position manipulation
- Implement fixed-timestep physics accumulator for frame-rate independent movement
- Cache trigonometric calculations for thrust vector to optimize performance
- Ensure input polling happens before physics updates to minimize latency

**Design Decisions:**

- Momentum-based movement: Chosen to match classic Asteroids feel while providing modern responsiveness
- Input abstraction: Enables easy addition of touch controls for mobile deployment
- Screen wrapping utility: Made reusable for asteroids and bullets to follow DRY principles

**Future Considerations:**

- Shield system integration point in PlayerShip class (post-MVP)
- Upgrade system hooks for modifying movement parameters (post-MVP)
- Particle trail effects for thrust visualization (polish phase)
- Haptic feedback integration for gamepad thrust (polish phase)