# 🎮 Game Design Document – _Asteroids: Neon Shards_

---

## 1. Game Overview & Pillars

**Title (Working):** _Asteroids: Neon Shards_  
**Genre:** Arcade Roguelite (Asteroids Reimagining)  
**Platform:** Web-first (desktop & mobile browser), with optimization for touch and gamepad.  
**Engine:** Phaser 3.70+ with TypeScript 5.0+

**Core Description:**  
A vaporwave-inspired roguelite reimagining of Asteroids. Players blast neon asteroids in a fast-paced arcade loop while collecting “Neon Shards,” a persistent meta-currency for upgrades across runs.

**Game Loop:** Enter asteroid field → Destroy asteroids & dodge collisions → Collect shards → Survive waves → Death → Spend shards on upgrades → Restart stronger.

**Design Pillars:**

1. Player-First Fun
2. Replayability Through Progression
3. Distinct Aesthetic Identity
4. Lean Scope, High Polish
5. Performance Excellence

---

## 2. Core Mechanics

### 2.1 Ship Controls

- Momentum-based thrust + rotation, friction-dampened.
- Shooting: 3–5 shots/sec, neon lasers, limited by fire rate cap.
- Screen-wrapping movement.

### 2.2 Asteroid Behavior

- Large → Medium → Small splitting.
- Random velocity + spin, screen-wrapping.
- Collision = death (MVP), shields possible post-MVP.

### 2.3 Neon Shards

- Dropped on asteroid destruction (size-based).
- Brief lifespan + magnetic pull toward player.
- Used for score (in-run) and upgrades (meta).

### 2.4 Core Loop Flow

1. Spawn → 2. Dodge & Shoot → 3. Collect Shards → 4. Survive Waves → 5. Die → 6. Summary & Shard Persistence → 7. Retry.

### 2.5 Asteroid Health & Rewards

- Base Weapon Damage: 20 per shot.
- Base Asteroid Health (Wave 1): Large 100 (5 hits), Medium 50 (3 hits), Small 20 (1 hit).
- Health scales +20% per wave.
- Shard yield: Large 5, Medium 3, Small 1 (+5% per wave).
- Visual crack states + audio cues for readability (no health bars).

---

## 3. Progression Systems

- **Shard Persistence:** Stored after each run → upgrade pool.
- **Upgrade Categories:**
  - Offense (fire rate, damage, multi-shot).
  - Defense (shields, shard magnet).
  - Mobility (thrust, turn speed, efficiency).
- **Economy:** Low-cost early upgrades (5–10 shards), exponential growth.
- **Meta Tree:** Neon hub screen, branching upgrade paths.

---

## 4. Game Flow & Player Experience

- **Moment-to-Moment:** Dodge → Shoot → Collect → Reset.
- **Session Loop:** “Just one more run” cycle with shard persistence.
- **Emotional Journey:**
  - Early: onboarding & empowerment.
  - Mid: escalating chaos & tension.
  - Late: survival thrill + rewarding failure.
- **Replayability Curve:** Short sessions (5–15 mins) fueled by mastery + progression.

---

## 5. Level / Wave Design

- **Wave 1:** 3–4 large slow asteroids (tutorial).
- **Wave 2–4:** More asteroids, faster movement.
- **Wave 5+:** Progressive scaling (count + speed).
- **Scaling Rules:** +20% HP per wave, +5% speed per wave, randomized spawn angles.
- **Special Types (Post-MVP):** Glowing (boosts), Corrupted (erratic, high reward).

---

## 6. UI/UX Design

- **HUD:** Score (top-left), Shards (top-right), Wave Indicator, Shields (post-MVP).
- **Menus:**
  - Start screen with neon background.
  - Upgrade hub (tech-tree style).
  - Run summary with shard animations.
- **Feedback:** Cracking asteroids, neon explosions, shard pops, death slow-motion.
- **Accessibility:** High contrast, colorblind-safe glows, HUD auto-scale for mobile.

---

## 7. Technical Constraints

- **Engine:** Phaser 3.70+, TypeScript strict mode.
- **Performance Targets:** 60 FPS, <3s load, <200MB memory.
- **Platform Support:** Desktop browsers (primary), mobile browsers (secondary).
- **Assets:** Lightweight sprites, shader effects, compressed audio.
- **Development:** 1–2 week MVP sprint, post-MVP progression layer.

---

## 8. Performance & Success Metrics

- **Technical:** 60 FPS, <3s load, <100ms input latency.
- **Player Experience:** 3+ runs per session, avg. 5–15 mins/run, 80% tutorial completion.
- **Progression:** 5–15 shards/run early game, first upgrade in 2–3 runs, full tree ~20–30 runs.
- **Validation:** MVP + roguelite progression delivered, BMAD workflow proven.

---

✅ **Final Note:**  
This GDD now provides a **complete design blueprint** for _Asteroids: Neon Shards_ — rooted in classic arcade mechanics, extended by roguelite progression, and scoped tightly for Phaser 3 + TypeScript delivery.
