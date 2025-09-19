# Asteroids: Neon Shards – Technical Architecture (Phaser 3 + TypeScript)

> Target Engine: **Phaser 3.70+** • Language: **TypeScript 5+ (strict)** • Platform: **Web-first (desktop & mobile)**
> Performance Targets: **60 FPS**, **<3s initial load**, **<200MB peak memory**

---

## 1) Architecture Overview

**Goal:** Implement a modern, performant reimagining of *Asteroids* with roguelite meta-progression and a neo‑vaporwave identity. The architecture emphasizes **modular systems**, **data-driven tuning**, and **deterministic gameplay** where feasible for repeatability.

**Key Systems**
- Scene Pipeline: **Boot → Preload → Menu → Game → Summary → MetaHub (Upgrades)**
- **Game Loop Systems** (runtime in Game scene): Input, Physics, Asteroid Spawner, Asteroid AI, Weapons/Bullets, Collision & Damage, Shard Drops & Magnetism, Wave Manager, VFX/Audio, HUD.
- **Meta Systems** (outside runs): Persistence (LocalStorage), Upgrade Tree, Economy.

**Design Pillars Mapped to Tech**
- Player-First Fun → Low-latency input, clear feedback, readable VFX.
- Replayability Through Progression → Persisted shards + upgrade data model.
- Distinct Aesthetic → Lightweight shaders/postFX, neon palette via pipelines.
- Lean Scope, High Polish → Strict MVP feature gates; post-MVP toggles.
- Performance Excellence → Object pooling, atlas textures, capped entities.

---

## 2) Project Structure

```text
neon-asteroids/
├─ assets/                  # images/, audio/, atlases/, bitmap-fonts/, data/
├─ docs/                    # GDD, LDD, architecture, stories
├─ public/                  # index.html, icons, manifest
├─ src/
│  ├─ config/               # game config + balance JSON/TS
│  ├─ core/                 # Game, Boot, Preload, shared helpers
│  ├─ scenes/               # MenuScene, GameScene, SummaryScene, MetaHubScene
│  ├─ systems/              # modular runtime systems (see below)
│  ├─ gameobjects/          # PlayerShip, Asteroid, Bullet, Shard, UI widgets
│  ├─ fx/                   # VFX utilities (particles, postFX)
│  ├─ data/                 # types, DTOs, save-schema
│  ├─ utils/                # math, rng, object pool, screen-wrap helpers
│  └─ main.ts               # Phaser.Game config + scene registration
├─ tests/                   # vitest/jest for logic; Playwright (optional) for smoke
├─ vite/
|  ├─ config.dev.mjs        # Vite build (ES modules) dev
|  └─ config.prod.mjs       # Vite build (ES modules) prod
├─ package.json
└─ tsconfig.json
```

**Module Boundaries**
- `systems/*` contain stateless-ish managers operating on pools/collections.
- `gameobjects/*` are thin wrappers over sprites/containers, exposing a typed API for systems to manipulate.
- `config/*` drives balancing (HP, speeds, yields, scaling) and feature flags.

---

## 3) Technology Stack & Build

- **Phaser 3.70+** (Arcade Physics) with tree‑shakeable ES modules
- **TypeScript 5+** in `strict` mode
- **Vite** for dev server + production bundling; code‑split per scene
- **ESLint + Prettier**; Husky + lint-staged for pre-commit
- **Vitest/Jest** for unit tests; **Playwright** optional for E2E smoke
- **LocalStorage** for persistence; abstracted via SaveService

---

## 4) Game Configuration (Data‑Driven)

Centralized config objects allow tuning without code changes.

```ts
// src/config/balance.ts
export const BALANCE = {
  player: { thrust: 220, turnSpeed: 210, friction: 0.98, fireRateHz: 4, bulletSpeed: 520 },
  asteroid: {
    baseHP: { large: 100, medium: 50, small: 20 },
    splitMap: { large: 'medium', medium: 'small' },
    maxOnScreen: 20,
    baseSpeed: { large: 60, medium: 90, small: 130 },
    spinRange: [ -60, 60 ]
  },
  shards: { baseYield: { large: 5, medium: 3, small: 1 }, lifespanMs: 4000, magnetRadius: 160 },
  scaling: { perWave: { hp: 0.20, speed: 0.05, yield: 0.05 }, spawnPerWave: 1 },
};
```

Feature flags for MVP vs Post‑MVP:
```ts
export const FEATURES = {
  shields: false, // post-MVP
  specials: { glowing: false, corrupted: false },
  gamepad: true,
  touch: true,
};
```

---

## 5) Scenes & Flow

**BootScene**: set scale, physics, pipeline registration → `PreloadScene`

**PreloadScene**: load atlases, audio, bitmap fonts; show progress bar; warm pools.

**MenuScene**: start, settings, link to MetaHub (upgrade tree).

**GameScene**: orchestrates runtime systems; HUD overlay.

**SummaryScene**: display run stats, convert shards to persistent currency.

**MetaHubScene**: upgrade purchase/apply; returns to Menu.

State transitions are handled via a small FSM helper and centralized `SceneRouter`.

---

## 6) Runtime Systems (GameScene)

Each system is updated from `GameScene.update()` in a fixed order to reduce race conditions and maintain determinism:

```ts
// Pseudocode order
input.update()
weapon.update(dt)
physics.preStep(dt)
asteroidSpawner.update(dt)
asteroidAI.update(dt)
bullets.update(dt)
collisions.update()
shards.update(dt)
waveManager.update(dt)
hud.update()
vfx.update(dt)
audio.update(dt)
```

### 6.1 Input System
- Abstraction for **keyboard, gamepad, touch**.
- Exposes intents: `thrust`, `turnLeft`, `turnRight`, `fire`.
- Applies deadzones; mobile: on-screen joystick + fire button.

### 6.2 Player Ship
- Body with linear damping for **friction-dampened momentum**.
- **Screen-wrap** helper resets position across edges.
- Weapon node child for muzzle flashes.

### 6.3 Weapon & Bullets
- **Fire-rate cap** enforced; bullet pool with ring buffer.
- Bullets carry `damage: 20` base; lifetime cull.

### 6.4 Asteroid Spawner & AI
- Wave-driven counts; random spawn at safe distance from player.
- Large → Medium → Small split logic; inherit portion of velocity + random spin.
- Cap **max asteroids on screen = 20**.

### 6.5 Collision & Damage
- Arcade Physics overlap checks: bullets↔asteroids, player↔asteroids, player↔shards.
- Damage pipeline triggers:
  - HP decrement → crack stage → destroy → split/spawn shards → VFX/Audio.
- Post-destroy: enqueue splits; avoid mid-iteration mutation hazards.

### 6.6 Shards & Magnetism
- Spawn from destroyed asteroids; short lifespan; **magnetic pull** to player within radius.
- Collect increments **run score** and **post-run persistent shards** via Summary.

### 6.7 Wave Manager
- Tracks wave number; applies **per-wave scaling** (HP +20%, Speed +5%, Yield +5%).
- Spawns +1 asteroid per wave after Wave 2.
- Transitions to **endless** behavior past 10 (procedural escalation).

### 6.8 HUD System
- Score (TL), Shards (TR), Wave indicator, future Shields.
- Auto-scale for mobile; Bitmap font or SDF text.

### 6.9 VFX/Audio
- **Particle-based explosions**, crack sprites, neon glows.
- Optional postFX: bloom/glow shader with intensity clamps for readability.
- Audio: laser, explosion, shard pop, death slow-mo sting.

---

## 7) Data Model & Persistence

```ts
// src/data/save.ts
export interface UpgradeNode { id: string; tier: number; cost: number; maxTier: number; effects: Record<string, number>; }
export interface SaveData {
  version: 1;
  shards: number; // persistent currency
  upgrades: Record<string, UpgradeNode['tier']>;
  settings: { sfx: number; music: number; vibration: boolean };
}
```

- **SaveService** wraps LocalStorage with schema versioning & migration hooks.
- SummaryScene commits `runShards` to `save.shards`, then applies purchases in MetaHub.
- Effects applied through **UpgradeService** that decorates `BALANCE` at runtime.

---

## 8) Object Pooling & Performance Strategy

- Pools: **bullets**, **asteroids (per size)**, **shards**, **explosion particles**.
- Use **texture atlases**; sprite sheets for crack states.
- Limit allocations per frame; reuse vectors; avoid closures in hot paths.
- **Fixed update step** emulation (accumulator) for consistent physics at varying FPS.
- **Culling** for off-screen VFX.
- Mobile rendering scale option (75–90%) if FPS dips.

**Performance Budgets**
- Draw calls: < 200 typical
- Active bodies: ≤ 60 (asteroids ≤20 + fragments + bullets)
- SFX voices: ≤ 8 concurrent

---

## 9) Asset Pipeline

- **Atlas generation** via TexturePacker or Free-Texture-Packer → `assets/atlases/neon.json/png`.
- **Audio**: OGG + fallback; compressed, short loops.
- **Fonts**: Bitmap/SDF for crisp HUD.
- **Color/FX**: Neon palette tokens defined in `src/fx/palette.ts`.

---

## 10) Testing Strategy

- Unit test **pure logic**: scaling math, wave generation, save/load.
- Simulated step tests for **WaveManager** and **Spawner**.
- Smoke tests: launch GameScene headless, simulate 5 seconds, assert no throws and entity caps.

```ts
// wave-scaling.spec.ts
it('applies per-wave scaling', () => {
  const w3 = applyScaling({ base: 100, wave: 3, inc: 0.20 });
  expect(w3).toBeCloseTo(144); // 100 * (1.2)^(3-1)
});
```

---

## 11) Tuning & Balancing Hooks

- All numeric knobs exposed in `BALANCE`.
- Dev overlay (`?debug`) shows FPS, body counts, current wave, average shards/min.
- Live-reload balance JSON in dev; hotkeys to bump tiers for test.

---

## 12) UI/UX & Accessibility

- High-contrast neon with clamp to avoid glare; colorblind-safe combinations.
- Screen shake intensity cap; toggle in settings.
- Dynamic HUD scaling for different DPR/resolutions.

---

## 13) Post‑MVP Extensions (Feature‑flagged)

- **Shields**: one-hit protection; visual ring; cooldown UI.
- **Special Asteroids**
  - *Glowing*: normal physics; on destroy drop temporary boost (fire rate / thrust / shield); 10% wave chance from Wave 4+.
  - *Corrupted*: erratic motion, higher HP, +200% shards; 5% wave chance from Wave 6+.
- **Meta**: branching tree UI with tooltips, refund rules.

---

## 14) Error Handling & Telemetry

- Global error bus; fail-soft for asset load errors (display retry).
- Optional privacy-friendly telemetry: session length, runs per session, tutorial completion.

---

## 15) Build & Deployment

- `vite build` produces hashed assets; `public/` hosts index/manifest.
- CI: Node LTS, install, lint, test, build, upload artifacts.
- Static hosting (Netlify/Vercel/GH Pages). Ensure proper cache headers for `assets/`.

---

## 16) Coding Standards (Summary)

- TS `strict`; no `any`; narrow types; prefer readonly where possible.
- Systems are **small, focused, composable**; avoid god objects.
- Prefer **composition over inheritance** for GameObjects.
- Document side-effects; keep update order explicit.

---

## 17) Open Questions / Risks

- Shader/postFX budgets on low-end mobile—may need device class detection.
- Input UX for touch layouts—iterate based on playtests.
- Save tampering—acceptable for web arcade; consider checksum if needed.

---

## 18) Acceptance Criteria (MVP)

- 60 FPS on target devices; entity caps respected.
- Waves 1–10 implement scaling; death → summary → meta loop works.
- Shards persist; first upgrade purchasable within 2–3 runs.
- UI: HUD + Menu + Summary complete; MetaHub minimal but functional.
- All core units covered by tests; zero ESLint errors; <3s initial load.

---

## 19) Appendix – Key Interfaces

```ts
export interface IntentInput { thrust: number; turn: number; fire: boolean; }
export interface SpawnParams { wave: number; safeRadius: number; }
export interface AsteroidData { id: number; size: 'large'|'medium'|'small'; hp: number; vx: number; vy: number; spin: number; }
export interface ShardData { id: number; value: number; ttl: number; }
```

```ts
// System contracts
export interface System { init(scene: Phaser.Scene): void; update(dt: number): void; shutdown(): void }
```

---

### Ready for Story Breakdown

This architecture is implementation-ready. Next step: create development stories for **Wave Manager**, **Asteroid Splitter**, **Shard Magnetism**, **HUD**, **Summary & Persistence**, and **MetaHub Upgrade Application**.
