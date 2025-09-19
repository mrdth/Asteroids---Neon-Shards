# 📝 Level Design Document – *Asteroids: Neon Shards*

---

## 1. Introduction & Scope  
This document defines the **wave and level progression** for *Asteroids: Neon Shards*.  
It extends the **Game Brief** and **Game Design Document (GDD)** by:  
- Mapping out **MVP wave structure**.  
- Adding **post-MVP special asteroid types** (Glowing & Corrupted).  
- Detailing **difficulty curves, shard economy, and roguelite pacing**.  
- Outlining **performance, technical constraints, and balancing guidelines**.  

---

## 2. Level Philosophy  
| Principle                  | Application in Level Design |
|-----------------------------|-----------------------------|
| **Fast-Paced Arcade Flow** | Maintain Asteroids-style immediacy with short waves. |
| **Replayability Through Scaling** | Waves escalate difficulty infinitely. |
| **Vaporwave Identity** | Neon visuals & music enhance but never obscure gameplay. |
| **Roguelite Integration** | Waves provide shard pacing for long-term progression. |

---

## 3. Level Types (Waves as Levels)  
| Type              | Description |
|-------------------|-------------|
| **Tutorial Wave** | Safe onboarding with slow large asteroids. |
| **Core Waves (2–5)** | Establish rhythm, introduce shard urgency, small asteroid chaos. |
| **Scaling Waves (6–10)** | Intensity rises, shard economy accelerates. |
| **Endless Waves (10+)** | Procedural escalation, designed for eventual overwhelm. |
| **Special Waves (Post-MVP)** | Glowing (boost) & Corrupted (risk/reward) asteroids spawn. |

---

## 4. Difficulty Progression  

**Scaling Rules (applied per wave after Wave 2):**  
- +1 asteroid spawn per wave.  
- +20% asteroid HP.  
- +5% asteroid speed.  
- +5% shard yield.  

**Pacing Curve:**  
- Waves 1–2: Onboarding, safe engagement.  
- Waves 3–5: Chaotic intensity, shard flow noticeable.  
- Waves 6–10: Mid-game tension, upgrades expected.  
- Waves 10+: Exponential chaos, roguelite replay loop engaged.  

---

## 5. Wave Breakdown (MVP)  

| Wave | Asteroid Count | Asteroid Types | Speed | Shard Yield (avg) | Notes |
|------|----------------|----------------|-------|-------------------|-------|
| 1    | 3–4            | Large          | Slow  | ~10               | Tutorial, no specials |
| 2    | 4–5            | Large/Medium   | Slow+ | ~15               | Introduces shard urgency |
| 3    | 5–6            | Large/Med/Small| Medium| ~20–25            | Split chaos begins |
| 4    | 6–7            | Mixed          | Med+  | ~30               | Dodging challenge |
| 5    | 7–8            | Mixed (faster) | Fast  | ~40–45            | First spike |
| 6–10 | 8–12           | Mixed          | Scaling | ~60–80 per run   | Midgame chaos, upgrades expected |
| 10+  | 12+            | Mixed + Specials | Scaling+ | 100+ | Endless mode, scaling chaos |

---

## 6. Special Asteroid Types (Post-MVP)  

| Type       | Behavior | Effect | Spawn Rule |
|------------|----------|--------|-------------|
| **Glowing** | Neon aura, normal physics | Drops temporary boosts (fire rate, thrust, shield) | 10% chance per wave (Wave 4+) |
| **Corrupted** | Erratic motion, jagged neon corruption visuals | +200% shard yield, higher HP & unpredictable velocity | 5% chance per wave (Wave 6+) |

---

## 7. Roguelite Layer Integration  

**Shard Economy Curve (per run):**  
| Wave Range | Shards Earned | Expected Unlocks |
|------------|---------------|------------------|
| 1–2 | ~10–20 | No upgrades |
| 3–5 | ~20–45 | 1st upgrades after 2–3 runs |
| 6–10 | ~60–80 | Multiple upgrade paths opening |
| 10+ | 100+ | Sustains long-term progression |

**Upgrade Pacing:**  
- Early upgrades cost 5–10 shards.  
- Players unlock **first upgrade within 2–3 runs**.  
- Full tree requires ~20–30 runs.  

---

## 8. Performance & Technical Constraints  
| Constraint | Requirement |
|------------|-------------|
| **Entity Cap** | Max 20 asteroids on screen. |
| **Readability** | Ensure neon FX don’t obscure bullets/shards. |
| **Framerate** | 60 FPS across desktop & mobile. |
| **Memory** | <200MB peak usage. |
| **Load Time** | <3s initial load. |

---

## 9. Testing & Balancing Guidelines  
| Category | Validation |
|----------|------------|
| **Tutorial** | ≥80% completion rate. |
| **Engagement** | Avg. 3 runs per session. |
| **Shard Balance** | Adjust drop rate if upgrades unlock too fast/slow. |
| **Visual Clarity** | Test neon effects under high-density action. |
| **Replay Curve** | “One more run” loop holds over 20+ sessions. |

---

## 10. Visual Diagram – Progression Curve  

```
Wave Difficulty (Y) vs Wave Number (X)

Difficulty
   ^
   |
 H |                          /   /   /
 i |                 /   /   /   /   /
 g |         /   /   /   /   /
 h |   /   /   /
 t | /
   +-------------------------------------> Waves
     1   2   3   4   5   6   7   10  15+
```

---

✅ **Expanded Level Design Document Complete.**  
This version is now ready as a **development reference**, balancing guide, and QA baseline.

