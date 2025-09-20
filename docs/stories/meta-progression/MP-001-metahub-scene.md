# Story: MetaHub Scene - Upgrade Tree Interface

**Epic:** Meta Progression
**Story ID:** MP-001
**Priority:** High
**Points:** 15
**Status:** New

## Description

Implement the MetaHub Scene that serves as the central progression system, allowing players to spend persistent shards on permanent upgrades that enhance future runs. This scene transforms the roguelite experience by providing meaningful meta-progression through a visually appealing tech-tree interface with branching upgrade paths.

The MetaHub features an interactive upgrade tree with offensive, defensive, and mobility categories, displays current shard balance and upgrade costs, provides detailed upgrade descriptions with stat previews, and maintains visual progress tracking. The interface should feel premium and exciting while being functionally clear for strategic upgrade decisions.

**GDD Reference:** Section 3 (Progression Systems) - "Upgrade Categories: Offense (fire rate, damage, multi-shot). Defense (shields, shard magnet). Mobility (thrust, turn speed, efficiency). Economy: Low-cost early upgrades (5–10 shards), exponential growth. Meta Tree: Neon hub screen, branching upgrade paths"

**Architecture Reference:** Section 5 (Scenes & Flow) - "MetaHubScene: upgrade purchase/apply; returns to Menu"

## Acceptance Criteria

### Functional Requirements

- [ ] Displays current persistent shard balance and updates in real-time
- [ ] Shows upgrade tree with three main categories: Offense, Defense, Mobility
- [ ] Each upgrade displays cost, current level, max level, and effect description
- [ ] Players can purchase upgrades if they have sufficient shards
- [ ] Upgrade effects are immediately applied and persist across game sessions
- [ ] Visual indicators show upgrade availability, purchase state, and maxed upgrades
- [ ] Branching upgrade paths with prerequisite dependencies between upgrades
- [ ] Detailed stat preview shows exact numerical changes before purchase
- [ ] Return to Menu option preserves all purchase decisions
- [ ] Handles insufficient funds gracefully with clear feedback

### Technical Requirements

- [ ] Code follows TypeScript strict mode standards with proper type safety
- [ ] Maintains 60 FPS with animated upgrade tree interface and visual effects
- [ ] No memory leaks during repeated MetaHub access across multiple sessions
- [ ] Upgrade data persistence using robust save system with validation
- [ ] Integrates with existing balance system for upgrade effect application
- [ ] Real-time shard balance updates reflect purchases immediately
- [ ] Prerequisite validation prevents invalid upgrade purchases
- [ ] Smooth animations for upgrade purchases and tree navigation

### Game Design Requirements

- [ ] Upgrade costs follow GDD economy: early upgrades 5-10 shards, exponential growth
- [ ] Visual design matches vaporwave aesthetic with tech-tree styling
- [ ] Upgrade descriptions are clear and emphasize gameplay impact
- [ ] Progression feels meaningful with noticeable gameplay improvements
- [ ] Interface is intuitive for players unfamiliar with upgrade trees
- [ ] Visual feedback makes upgrade purchases feel satisfying and impactful

## Technical Specifications

### Files to Create/Modify

**New Files:**

- `src/scenes/MetaHubScene.ts` - Main meta-progression scene with upgrade tree interface
- `src/ui/UpgradeTree.ts` - Interactive upgrade tree component with branching paths
- `src/ui/UpgradeNode.ts` - Individual upgrade node with purchase interface
- `src/systems/UpgradeSystem.ts` - Upgrade data management and effect application
- `src/data/UpgradeData.ts` - Upgrade definitions, costs, and effect formulas
- `tests/scenes/MetaHubScene.test.ts` - Unit tests for upgrade logic and persistence

**Modified Files:**

- `src/scenes/MenuScene.ts` - Add transition to MetaHub Scene
- `src/scenes/SummaryScene.ts` - Add transition to MetaHub Scene
- `src/config/balance.ts` - Integrate upgrade effects with gameplay systems
- `src/systems/SaveSystem.ts` - Extend save system for upgrade persistence

### Class/Interface Definitions

```typescript
// Upgrade category enumeration
enum UpgradeCategory {
  OFFENSE = "offense",
  DEFENSE = "defense",
  MOBILITY = "mobility",
}

// Individual upgrade definition
interface UpgradeDefinition {
  id: string;
  category: UpgradeCategory;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number; // Exponential cost growth
  prerequisites: string[]; // Required upgrade IDs
  effects: UpgradeEffect[];
  position: { x: number; y: number }; // Tree layout position
}

// Upgrade effect on gameplay systems
interface UpgradeEffect {
  target: string; // e.g., "weapon.fireRate", "player.thrust", "shard.magnetRadius"
  type: 'additive' | 'multiplicative' | 'absolute';
  valuePerLevel: number;
  maxValue?: number; // Optional cap on effect
}

// Player's upgrade progress
interface UpgradeProgress {
  [upgradeId: string]: number; // Current level for each upgrade
}

// Upgrade purchase transaction
interface UpgradePurchase {
  upgradeId: string;
  fromLevel: number;
  toLevel: number;
  cost: number;
  effects: { [target: string]: number };
}

// Main MetaHub Scene class
class MetaHubScene extends Phaser.Scene {
  private upgradeSystem!: UpgradeSystem;
  private upgradeTree!: UpgradeTree;
  private currentShards: number = 0;
  private shardDisplay!: Phaser.GameObjects.Text;
  private categoryTabs: Map<UpgradeCategory, Phaser.GameObjects.Container>;
  private selectedCategory: UpgradeCategory = UpgradeCategory.OFFENSE;
  private backButton!: Phaser.GameObjects.Container;
  private upgradePreview!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: "MetaHubScene" });
  }

  public init(): void {
    // Initialize upgrade system and load progress
  }

  public create(): void {
    // Create MetaHub UI and upgrade tree interface
  }

  private createBackground(): void {
    // Vaporwave tech-hub background
  }

  private createShardDisplay(): void {
    // Current shard balance display
  }

  private createCategoryTabs(): void {
    // Tabbed interface for upgrade categories
  }

  private createUpgradeTree(): void {
    // Interactive upgrade tree with nodes and connections
  }

  private createUpgradePreview(): void {
    // Detailed upgrade information panel
  }

  private onCategorySelected(category: UpgradeCategory): void {
    // Switch between upgrade categories
  }

  private onUpgradeSelected(upgradeId: string): void {
    // Show detailed upgrade information
  }

  private onUpgradePurchase(upgradeId: string): void {
    // Handle upgrade purchase transaction
  }

  private updateShardDisplay(): void {
    // Refresh shard balance after purchases
  }

  private onReturnToMenu(): void {
    // Return to MenuScene with progress saved
  }

  private validateUpgradePurchase(upgradeId: string): boolean {
    // Check funds and prerequisites
  }

  private applyUpgradeEffects(purchase: UpgradePurchase): void {
    // Apply upgrade effects to game systems
  }
}

// Interactive upgrade tree component
class UpgradeTree extends Phaser.GameObjects.Container {
  private upgradeNodes: Map<string, UpgradeNode>;
  private connectionLines: Phaser.GameObjects.Graphics[];
  private upgradeDefinitions: UpgradeDefinition[];
  private upgradeProgress: UpgradeProgress;
  private currentCategory: UpgradeCategory;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    definitions: UpgradeDefinition[],
    progress: UpgradeProgress
  ) {
    super(scene, x, y);
    this.upgradeDefinitions = definitions;
    this.upgradeProgress = progress;
  }

  public setCategory(category: UpgradeCategory): void {
    // Filter and display upgrades for selected category
  }

  public updateProgress(newProgress: UpgradeProgress): void {
    // Refresh upgrade node states after purchases
  }

  public highlightUpgrade(upgradeId: string): void {
    // Highlight selected upgrade and show connections
  }

  public getAvailableUpgrades(): string[] {
    // Return list of purchasable upgrade IDs
  }

  private createUpgradeNodes(): void {
    // Create interactive nodes for each upgrade
  }

  private createConnectionLines(): void {
    // Draw dependency connections between upgrades
  }

  private layoutNodes(category: UpgradeCategory): void {
    // Position nodes in attractive tree layout
  }

  private updateNodeStates(): void {
    // Update visual states (available, purchased, locked)
  }
}

// Individual upgrade node component
class UpgradeNode extends Phaser.GameObjects.Container {
  private upgradeDefinition: UpgradeDefinition;
  private currentLevel: number;
  private nodeBackground: Phaser.GameObjects.Rectangle;
  private nodeIcon: Phaser.GameObjects.Sprite;
  private levelText: Phaser.GameObjects.Text;
  private costText: Phaser.GameObjects.Text;
  private state: 'available' | 'locked' | 'maxed';
  private glowEffect: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    definition: UpgradeDefinition,
    currentLevel: number
  ) {
    super(scene, x, y);
    this.upgradeDefinition = definition;
    this.currentLevel = currentLevel;
    this.createNodeElements();
  }

  public updateLevel(newLevel: number): void {
    // Update node display for new upgrade level
  }

  public setState(newState: 'available' | 'locked' | 'maxed'): void {
    // Update visual state and interactivity
  }

  public getUpgradeId(): string {
    return this.upgradeDefinition.id;
  }

  public getCost(): number {
    // Calculate cost for next upgrade level
  }

  public isMaxLevel(): boolean {
    return this.currentLevel >= this.upgradeDefinition.maxLevel;
  }

  private createNodeElements(): void {
    // Create node visual elements with neon styling
  }

  private updateVisualState(): void {
    // Update colors, glow, and interactivity based on state
  }

  private onPointerOver(): void {
    // Hover effects and preview display
  }

  private onPointerOut(): void {
    // Remove hover effects
  }

  private onPointerDown(): void {
    // Handle upgrade purchase attempt
  }

  private calculateCost(): number {
    // Calculate upgrade cost based on current level
    const definition = this.upgradeDefinition;
    return Math.floor(definition.baseCost * Math.pow(definition.costMultiplier, this.currentLevel));
  }
}

// Upgrade system management
class UpgradeSystem extends Phaser.Events.EventEmitter {
  private scene: Phaser.Scene;
  private upgradeDefinitions: Map<string, UpgradeDefinition>;
  private currentProgress: UpgradeProgress;
  private appliedEffects: Map<string, number>; // Current effect totals
  private saveSystem: SaveSystem;

  constructor(scene: Phaser.Scene, saveSystem: SaveSystem) {
    super();
    this.scene = scene;
    this.saveSystem = saveSystem;
    this.loadUpgradeDefinitions();
    this.loadProgress();
  }

  public purchaseUpgrade(upgradeId: string, shardBalance: number): UpgradePurchase | null {
    // Attempt to purchase upgrade and return transaction details
  }

  public getUpgradeDefinitions(): UpgradeDefinition[] {
    return Array.from(this.upgradeDefinitions.values());
  }

  public getProgress(): UpgradeProgress {
    return { ...this.currentProgress };
  }

  public getAppliedEffects(): Map<string, number> {
    return new Map(this.appliedEffects);
  }

  public isUpgradeAvailable(upgradeId: string): boolean {
    // Check if upgrade can be purchased (prerequisites met)
  }

  public calculateUpgradeCost(upgradeId: string): number {
    // Calculate current upgrade cost
  }

  public getEffectPreview(upgradeId: string): { [target: string]: number } {
    // Preview effects of purchasing upgrade
  }

  private loadUpgradeDefinitions(): void {
    // Load upgrade definitions from configuration
  }

  private loadProgress(): void {
    // Load player's upgrade progress from save system
  }

  private saveProgress(): void {
    // Persist upgrade progress to save system
  }

  private validatePrerequisites(upgradeId: string): boolean {
    // Check if all prerequisite upgrades are owned
  }

  private applyUpgradeEffects(upgradeId: string): void {
    // Calculate and apply upgrade effects to game systems
  }

  private calculateEffectTotal(target: string): number {
    // Sum all upgrade effects for a specific target
  }
}
```

### Integration Points

**Scene Flow Integration:**

- MenuScene: "Upgrades" button transitions to MetaHub Scene
- SummaryScene: "View Upgrades" button transitions to MetaHub Scene
- MetaHub: "Back" button returns to previous scene (Menu or Summary)

**System Dependencies:**

- SaveSystem: Persistent storage for upgrade progress and effect application
- Balance Config: Upgrade effects modify gameplay parameters
- Shard System: Current persistent shard balance for purchase validation

**Effect Application:**

- PlayerShip: Mobility upgrades (thrust, turn speed, efficiency)
- WeaponSystem: Offensive upgrades (fire rate, damage, multi-shot)
- ShardManager: Defensive upgrades (shard magnet radius, collection bonus)

## Implementation Tasks

### Dev Agent Record

**Tasks:**

- [ ] Create UpgradeDefinition interface and populate upgrade data with GDD categories (Offense, Defense, Mobility)
- [ ] Implement UpgradeSystem class with purchase logic, prerequisite validation, and effect calculation
- [ ] Build MetaHubScene with tabbed category interface and shard balance display
- [ ] Create UpgradeTree component with interactive node layout and dependency connections
- [ ] Add UpgradeNode component with purchase interface, cost display, and visual states
- [ ] Implement upgrade cost formulas with exponential growth (5-10 base cost, 1.5-2.0 multiplier)
- [ ] Create upgrade effect application system that modifies balance configuration
- [ ] Add prerequisite dependency system for branching upgrade paths
- [ ] Build upgrade preview system with detailed stat changes and gameplay impact
- [ ] Integrate with SaveSystem for persistent upgrade progress and effect storage
- [ ] Create smooth scene transitions from Menu and Summary scenes
- [ ] Add visual feedback for purchase success, insufficient funds, and maxed upgrades
- [ ] Design tech-tree layout with attractive node positioning and connection visualization
- [ ] Implement real-time shard balance updates and purchase validation
- [ ] Write unit tests for upgrade calculations, prerequisites, and effect application
- [ ] Integration testing with gameplay systems for upgrade effect verification
- [ ] Performance testing for smooth UI interactions and scene transitions

**Debug Log:**
| Task | File | Change | Reverted? |
|------|------|--------|-----------|
| | | | |

**Completion Notes:**

<!-- Only note deviations from requirements, keep under 50 words -->

**Change Log:**

<!-- Only requirement changes during implementation -->

## Game Design Context

**GDD Reference:** Section 3 (Progression Systems)

**Game Mechanic:** Meta-progression system that provides permanent advancement and replayability motivation

**Player Experience Goal:** Create meaningful, strategic upgrade decisions that noticeably improve gameplay performance. Each upgrade purchase should feel impactful and create anticipation for testing improvements in the next run.

**Economy Design:**

- **Early Game**: 5-10 shard upgrades provide immediate noticeable improvements
- **Mid Game**: 25-50 shard upgrades offer significant power increases
- **Late Game**: 100+ shard upgrades provide incremental but meaningful optimization
- **Exponential Growth**: Ensures early upgrades remain accessible while late upgrades require dedication

**Upgrade Categories:**

- **Offense**: Fire rate (+0.5/level), damage (+2/level), multi-shot (unlock tiers)
- **Defense**: Shield health (+25/level), shard magnet radius (+10 pixels/level)
- **Mobility**: Thrust (+15/level), turn speed (+10 degrees/level), efficiency (+5%/level)

## Testing Requirements

### Unit Tests

**Test Files:**

- `tests/scenes/MetaHubScene.test.ts`
- `tests/ui/UpgradeTree.test.ts`
- `tests/ui/UpgradeNode.test.ts`
- `tests/systems/UpgradeSystem.test.ts`

**Test Scenarios:**

- UpgradeSystem correctly calculates costs with exponential growth
- Prerequisite validation prevents invalid purchases
- Upgrade effects are properly applied to gameplay systems
- Shard balance updates correctly after purchases
- Save system persists upgrade progress reliably
- UI state updates correctly for available/locked/maxed upgrades
- Scene transitions preserve upgrade progress

### Integration Tests

**Manual Test Cases:**

1. **Purchase Flow Test**
   - Expected: Purchase depletes shards, applies effects, updates UI states
   - Performance: Purchase transaction completes within 100ms

2. **Prerequisite System Test**
   - Expected: Locked upgrades become available when prerequisites met
   - Edge Case: Complex prerequisite chains work correctly

3. **Effect Application Test**
   - Expected: Purchased upgrades noticeably improve gameplay performance
   - Performance: Effect application doesn't impact frame rate

4. **Persistence Test**
   - Expected: Upgrades persist across browser sessions and game restarts
   - Edge Case: Save corruption falls back gracefully

### Performance Tests

**Metrics to Verify:**

- MetaHub Scene loads within 300ms from transition
- Upgrade tree interactions maintain 60 FPS with smooth animations
- Purchase transactions complete within 100ms including save operations
- Effect calculations complete within 50ms for complex upgrade combinations

## Dependencies

**Story Dependencies:**

- SI-004: Summary Scene (pending) - Required for SummaryScene → MetaHub transition
- All Core Game Loop stories - Required for upgrade effect application

**Technical Dependencies:**

- Existing SaveSystem for upgrade persistence
- Balance configuration system for effect integration
- Phaser 3 UI components for interactive tree interface

**Asset Dependencies:**

- Upgrade icons: Distinct icons for each upgrade category and type
- Location: `assets/ui/upgrades/offense/`, `defense/`, `mobility/`
- MetaHub background: Tech-tree styled vaporwave background
- Location: `assets/ui/metahub-bg.png`
- Purchase effects: Visual feedback for successful upgrade purchases
- Location: `assets/fx/upgrade-purchased.png`

## Definition of Done

- [ ] All acceptance criteria met and verified through testing
- [ ] Code reviewed and follows TypeScript strict mode standards
- [ ] Unit tests written and passing (>90% coverage for upgrade logic)
- [ ] Integration tests passing with gameplay systems and save persistence
- [ ] Performance targets met (300ms load, 60 FPS interactions, 100ms purchases)
- [ ] No ESLint warnings or errors in MetaHub system code
- [ ] Upgrade costs follow GDD economy with appropriate exponential growth
- [ ] Prerequisite system works correctly with branching upgrade paths
- [ ] Visual design matches vaporwave aesthetic with clear tech-tree styling
- [ ] Upgrade effects create noticeable gameplay improvements
- [ ] Scene transitions work smoothly from Menu and Summary scenes

## Notes

**Implementation Notes:**

- Use Phaser's built-in interaction system for upgrade node clicking
- Implement upgrade effects as modifiers to balance config rather than direct system changes
- Cache effect calculations to avoid repeated computation during gameplay
- Use object pooling for upgrade node creation to improve performance

**Design Decisions:**

- Exponential cost growth: Maintains early accessibility while creating long-term goals
- Prerequisite system: Creates strategic depth and progression structure
- Effect categories: Clear organization helps players understand upgrade impact
- Visual feedback: Immediate confirmation makes purchases feel satisfying

**Future Considerations:**

- Upgrade refund system for experimentation (post-MVP)
- Advanced upgrade types (set bonuses, conditional effects)
- Upgrade recommendation system for new players
- Achievement integration with upgrade milestones