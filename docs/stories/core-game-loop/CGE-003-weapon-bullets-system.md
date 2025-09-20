# Story: Weapon & Bullets System with Fire Rate Control

**Epic:** Core Game Loop
**Story ID:** CGE-003
**Priority:** High
**Points:** 10
**Status:** Draft

## Description

Implement the player's primary interaction system - a neon laser weapon with controlled fire rate, bullet physics, collision detection, and visual feedback. This system enables players to destroy asteroids through precise shooting mechanics while maintaining game balance through fire rate limitations.

The weapon system includes automatic fire rate capping (3-5 shots/sec), neon laser projectiles with consistent damage (20 per shot), bullet lifetime management, and collision detection with asteroids. The system uses object pooling for performance optimization and provides satisfying visual/audio feedback for each shot fired.

**GDD Reference:** Section 2.1 (Ship Controls) - "Shooting: 3–5 shots/sec, neon lasers, limited by fire rate cap" and Section 2.5 (Asteroid Health & Rewards) - "Base Weapon Damage: 20 per shot"

**Architecture Reference:** Section 6.3 (Weapon & Bullets) - "Fire-rate cap enforced; bullet pool with ring buffer. Bullets carry damage: 20 base; lifetime cull"

## Acceptance Criteria

### Functional Requirements
- [ ] Player can fire bullets using space bar/fire button with immediate response
- [ ] Fire rate is capped at 4 shots per second (250ms minimum interval between shots)
- [ ] Bullets spawn at ship's current position and move in ship's facing direction
- [ ] Each bullet deals exactly 20 damage to asteroids on collision
- [ ] Bullets have limited lifetime (3 seconds) and are automatically cleaned up
- [ ] Bullets wrap around screen boundaries seamlessly like other game objects
- [ ] Collision detection accurately detects bullet-asteroid impacts
- [ ] Multiple bullets can exist simultaneously (up to 15 active bullets)
- [ ] Rapid fire input is properly rate-limited without losing responsiveness

### Technical Requirements
- [ ] Code follows TypeScript strict mode standards
- [ ] Maintains 60 FPS with 15 active bullets and collision detection
- [ ] No memory leaks during continuous firing cycles
- [ ] Uses Phaser 3 Arcade Physics for bullet movement and collision
- [ ] Object pooling prevents garbage collection during rapid firing
- [ ] Bullet collision detection optimized for performance
- [ ] Fire rate timing uses high-precision timestamps for consistency

### Game Design Requirements
- [ ] Bullet speed matches GDD specification (520 units/sec)
- [ ] Damage output matches GDD specification (20 damage per bullet)
- [ ] Fire rate matches GDD specification (4 shots/sec baseline)
- [ ] Visual feedback provides clear indication of successful shots
- [ ] Audio feedback enhances shooting satisfaction
- [ ] Weapon feels responsive and precise for asteroid targeting

## Technical Specifications

### Files to Create/Modify

**New Files:**

- `src/gameobjects/Bullet.ts` - Bullet projectile class with physics and collision
- `src/systems/WeaponSystem.ts` - Manages firing mechanics, rate limiting, and bullet creation
- `src/systems/BulletManager.ts` - Object pool management and bullet lifecycle control
- `src/utils/Timer.ts` - High-precision timing utility for fire rate control
- `tests/gameobjects/Bullet.test.ts` - Unit tests for bullet behavior and lifetime
- `tests/systems/WeaponSystem.test.ts` - Unit tests for firing mechanics and rate limiting

**Modified Files:**

- `src/gameobjects/PlayerShip.ts` - Add weapon integration and firing input handling
- `src/scenes/GameScene.ts` - Add weapon system instantiation and collision detection
- `src/systems/InputSystem.ts` - Add fire button input detection and handling
- `src/config/balance.ts` - Add weapon configuration (damage, speed, fire rate, bullet lifetime)

### Class/Interface Definitions

```typescript
// Weapon configuration interface
interface WeaponConfig {
    fireRateHz: number;        // shots per second (4.0)
    bulletSpeed: number;       // pixels per second (520)
    bulletDamage: number;      // damage per shot (20)
    bulletLifetimeMs: number;  // bullet lifetime in milliseconds (3000)
    maxActiveBullets: number;  // maximum concurrent bullets (15)
    muzzleOffset: number;      // distance from ship center to muzzle (16)
}

// Bullet data interface
interface BulletData {
    id: number;
    damage: number;
    velocity: { x: number; y: number };
    timeToLive: number;
    ownerId: string; // for future multiplayer or enemy bullets
}

// Main Bullet class
class Bullet extends Phaser.Physics.Arcade.Sprite {
    private damage: number;
    private timeToLive: number;
    private initialLifetime: number;
    private isActive: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'bullet-neon');
        // Initialize physics body, damage, lifetime
    }

    public fire(x: number, y: number, angle: number, config: WeaponConfig): void {
        // Set position, calculate velocity from angle, start lifetime countdown
    }

    public update(dt: number): void {
        // Update lifetime, handle screen wrapping, auto-destroy on expiration
    }

    public getDamage(): number {
        // Return bullet damage value for collision handling
    }

    public deactivate(): void {
        // Disable physics, hide sprite, mark as inactive for pooling
    }

    private calculateVelocity(angle: number, speed: number): { x: number; y: number } {
        // Convert angle and speed to velocity vector
    }
}

// Weapon system class
class WeaponSystem {
    private scene: Phaser.Scene;
    private bulletManager: BulletManager;
    private config: WeaponConfig;
    private lastFireTime: number;
    private fireInterval: number;
    private inputSystem: InputSystem;

    constructor(scene: Phaser.Scene, bulletManager: BulletManager, config: WeaponConfig) {
        // Initialize weapon system with rate limiting
    }

    public update(dt: number, shipPosition: { x: number; y: number }, shipRotation: number): void {
        // Check fire input, enforce rate limiting, create bullets
    }

    public canFire(): boolean {
        // Check if enough time has passed since last shot
    }

    public fire(x: number, y: number, angle: number): Bullet | null {
        // Create and fire bullet if rate limit allows
    }

    private calculateMuzzlePosition(shipX: number, shipY: number, shipAngle: number): { x: number; y: number } {
        // Calculate bullet spawn position at ship's muzzle
    }

    private enforceFireRate(): boolean {
        // Check if current time allows firing based on fire rate cap
    }
}

// Bullet pool manager
class BulletManager {
    private bulletPool: ObjectPool<Bullet>;
    private activeBullets: Set<Bullet>;
    private maxActiveBullets: number;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, maxBullets: number = 15) {
        // Initialize bullet object pool and tracking
    }

    public getBullet(): Bullet | null {
        // Get bullet from pool or return null if max reached
    }

    public returnBullet(bullet: Bullet): void {
        // Return bullet to pool and remove from active tracking
    }

    public update(dt: number): void {
        // Update all active bullets, handle lifetime expiration
    }

    public getActiveBulletCount(): number {
        // Return current number of active bullets
    }

    public checkCollisions(asteroids: Asteroid[]): void {
        // Handle bullet-asteroid collision detection and responses
    }
}

// High-precision timer utility
class Timer {
    private static getHighResTimestamp(): number {
        // Return high-resolution timestamp for precise timing
    }

    public static hasElapsed(lastTime: number, intervalMs: number): boolean {
        // Check if specified interval has elapsed since last time
    }

    public static getElapsedMs(startTime: number): number {
        // Calculate elapsed milliseconds since start time
    }
}
```

### Integration Points

**Scene Integration:**

- GameScene: Create WeaponSystem and BulletManager instances
- GameScene: Call bulletManager.update() and weaponSystem.update() in scene update loop
- GameScene: Handle bullet-asteroid collision detection and damage application

**System Dependencies:**

- InputSystem: Provides fire button input state for weapon triggering
- PlayerShip: Integration point for weapon firing and muzzle position
- AsteroidManager: Target system for bullet collision detection
- ScreenWrap: Utility for bullet boundary wrapping behavior

**Event Communication:**

- Emits: `bullet-fired` when weapon fires (for audio/VFX)
- Emits: `bullet-hit` when bullet collides with asteroid
- Emits: `bullet-expired` when bullet lifetime expires
- Listens: `game-pause` to halt weapon updates and bullet movement
- Listens: `upgrade-applied` to modify weapon parameters (post-MVP)

## Implementation Tasks

### Dev Agent Record

**Tasks:**

- [ ] Create WeaponConfig interface and add to balance.ts with exact GDD values
- [ ] Implement Timer utility class with high-precision timestamp functionality
- [ ] Create Bullet class extending Phaser.Physics.Arcade.Sprite
- [ ] Configure Arcade Physics body with proper collision bounds for bullets
- [ ] Implement bullet firing logic with velocity calculation from ship angle
- [ ] Add bullet lifetime management with automatic cleanup after 3 seconds
- [ ] Create BulletManager with object pooling for performance optimization
- [ ] Implement WeaponSystem with precise fire rate control (250ms intervals)
- [ ] Add muzzle position calculation relative to ship position and rotation
- [ ] Integrate fire button input handling in InputSystem
- [ ] Add weapon system integration to PlayerShip class
- [ ] Create GameScene integration with collision detection between bullets and asteroids
- [ ] Implement screen wrapping for bullets using existing ScreenWrap utility
- [ ] Add visual feedback system for bullet firing (muzzle flash, neon trail)
- [ ] Write unit tests for WeaponSystem fire rate limiting and timing precision
- [ ] Write unit tests for Bullet physics, lifetime, and collision detection
- [ ] Integration testing with asteroid damage system and destruction
- [ ] Performance testing with 15 simultaneous bullets maintaining 60 FPS

**Debug Log:**
| Task | File | Change | Reverted? |
|------|------|--------|-----------|
| | | | |

**Completion Notes:**

<!-- Only note deviations from requirements, keep under 50 words -->

**Change Log:**

<!-- Only requirement changes during implementation -->

## Game Design Context

**GDD Reference:** Section 2.1 (Ship Controls) and Section 2.5 (Asteroid Health & Rewards)

**Game Mechanic:** Rate-limited neon laser weapon with consistent damage output

**Player Experience Goal:** Provide responsive, satisfying shooting mechanics that feel precise and powerful while maintaining game balance through fire rate limitations. Visual and audio feedback should enhance the satisfaction of successful asteroid destruction.

**Balance Parameters:**

- Fire Rate: 4 shots/sec (250ms minimum interval between shots)
- Bullet Speed: 520 units/sec (fast enough for precise targeting)
- Bullet Damage: 20 per shot (consistent with asteroid health scaling)
- Bullet Lifetime: 3 seconds (prevents screen clutter, encourages accuracy)
- Max Active Bullets: 15 (performance optimization while allowing rapid engagement)
- Muzzle Offset: 16 pixels from ship center (visual accuracy for firing direction)

## Testing Requirements

### Unit Tests

**Test Files:**

- `tests/gameobjects/Bullet.test.ts`
- `tests/systems/WeaponSystem.test.ts`
- `tests/systems/BulletManager.test.ts`
- `tests/utils/Timer.test.ts`

**Test Scenarios:**

- WeaponSystem enforces fire rate cap with precise timing (250ms intervals)
- Bullet velocity calculation matches ship facing direction accurately
- Bullet lifetime expires after exactly 3 seconds with proper cleanup
- BulletManager object pool prevents memory leaks during rapid firing
- Collision detection accurately registers bullet-asteroid impacts
- Screen wrapping teleports bullets seamlessly across boundaries
- Fire rate limiting prevents exceeding maximum shots per second

### Game Testing

**Manual Test Cases:**

1. **Weapon Responsiveness Test**
   - Expected: Immediate visual/audio feedback when fire button pressed
   - Performance: No input lag, fire rate cap maintains consistent timing

2. **Bullet Physics and Collision Test**
   - Expected: Bullets move in straight lines, collide accurately with asteroids
   - Edge Case: Multiple bullets can hit the same asteroid simultaneously

3. **Fire Rate Limiting Test**
   - Expected: Rapid fire input produces exactly 4 shots per second maximum
   - Edge Case: Held fire button maintains consistent rate without acceleration

4. **Bullet Lifetime and Cleanup Test**
   - Expected: Bullets disappear after 3 seconds, no visual artifacts remain
   - Performance: No memory buildup during extended firing sessions

### Performance Tests

**Metrics to Verify:**

- Frame rate maintains 60 FPS with 15 active bullets and collision detection
- Memory usage stays stable during continuous firing (no leaks from pooling)
- Fire rate timing precision within ±5ms of target 250ms intervals
- Collision detection completes within 2ms per frame for all bullets

## Dependencies

**Story Dependencies:**

- CGE-001: Player Ship Controls (completed) - Required for ship position and rotation
- CGE-002: Asteroid System (in development) - Required for collision targets

**Technical Dependencies:**

- Phaser 3.70+ with Arcade Physics collision detection enabled
- InputSystem from player ship story for fire button input
- ScreenWrap utility for bullet boundary behavior
- ObjectPool utility from asteroid system for bullet pooling

**Asset Dependencies:**

- Bullet sprite: Neon laser projectile with distinctive visual style
- Location: `assets/sprites/bullet-neon.png`
- Muzzle flash effect: Brief animation for weapon firing feedback
- Location: `assets/sprites/muzzle-flash.png`
- Laser sound effect: Short, satisfying audio for each shot
- Location: `assets/audio/laser-shot.ogg`

## Definition of Done

- [ ] All acceptance criteria met and verified through testing
- [ ] Code reviewed and follows TypeScript strict mode standards
- [ ] Unit tests written and passing (>90% coverage for weapon logic)
- [ ] Integration tests passing with PlayerShip and Asteroid systems
- [ ] Performance targets met (60 FPS with 15 bullets, stable memory)
- [ ] No ESLint warnings or errors in weapon system code
- [ ] Fire rate limiting works precisely with high-resolution timing
- [ ] Object pooling prevents memory leaks during extended gameplay
- [ ] Collision detection accurately registers bullet-asteroid impacts
- [ ] Visual and audio feedback enhances shooting satisfaction

## Notes

**Implementation Notes:**

- Use `performance.now()` for high-precision fire rate timing instead of frame-based counters
- Implement bullet physics using `setVelocity()` rather than position manipulation
- Cache trigonometric calculations for muzzle position to optimize performance
- Ensure collision detection occurs before bullet lifetime updates to prevent missed hits

**Design Decisions:**

- Fire rate cap: Prevents weapon from becoming overpowered while maintaining responsiveness
- Object pooling: Essential for performance during rapid firing sequences
- Screen wrapping: Maintains consistency with other game objects and enables trick shots
- Lifetime limitation: Prevents visual clutter and encourages accurate shooting

**Future Considerations:**

- Weapon upgrade system hooks for fire rate, damage, and multi-shot (post-MVP)
- Bullet trail effects and enhanced visual feedback (polish phase)
- Sound variation system for rapid fire sequences (polish phase)
- Bullet penetration and special ammunition types (future expansion)