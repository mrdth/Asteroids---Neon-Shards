# Story: Menu Scene - Main Menu & Game Entry Point

**Epic:** Scene Infrastructure
**Story ID:** SI-003
**Priority:** High
**Points:** 10
**Status:** New

## Description

Implement the Main Menu Scene that serves as the primary entry point for players, featuring a vaporwave-styled interface with game controls, settings access, and transitions to gameplay or meta-progression scenes. This scene establishes the game's visual identity and provides essential navigation for the complete roguelite experience.

The Menu Scene includes animated neon UI elements, background visuals that showcase the game's aesthetic, intuitive navigation between play/settings/upgrades, and responsive design for both desktop and mobile interactions. It should feel premium and exciting while being functionally clear for immediate game access.

**GDD Reference:** Section 6 (UI/UX Design) - "Start screen with neon background. Upgrade hub (tech-tree style). High contrast, colorblind-safe glows, HUD auto-scale for mobile"

**Architecture Reference:** Section 5 (Scenes & Flow) - "MenuScene: start, settings, link to MetaHub (upgrade tree)"

## Acceptance Criteria

### Functional Requirements

- [ ] Displays main menu with Play, Upgrades, Settings, and Credits options
- [ ] Play button starts new game session by transitioning to GameScene
- [ ] Upgrades button transitions to MetaHub Scene for meta-progression
- [ ] Settings button opens settings overlay with audio, graphics, and control options
- [ ] Credits option displays development credits and BMAD method acknowledgment
- [ ] Responsive design adapts to desktop and mobile screen sizes
- [ ] Keyboard navigation support for accessibility (tab, enter, escape)
- [ ] Gamepad navigation support for console-style play
- [ ] Background animation showcases vaporwave aesthetic without distraction

### Technical Requirements

- [ ] Code follows TypeScript strict mode standards with proper type safety
- [ ] Maintains 60 FPS with animated UI elements and background effects
- [ ] Scene transitions are smooth without visual artifacts or loading delays
- [ ] No memory leaks during repeated menu access throughout game sessions
- [ ] UI scaling works properly across different screen resolutions and aspect ratios
- [ ] Input handling supports keyboard, mouse, touch, and gamepad simultaneously
- [ ] Settings persistence using local storage with proper data validation

### Game Design Requirements

- [ ] Visual design matches vaporwave aesthetic with neon colors and retro-futuristic elements
- [ ] UI hierarchy guides players toward the Play button as primary action
- [ ] Menu feels exciting and builds anticipation for gameplay
- [ ] Navigation is intuitive for players unfamiliar with roguelite progression
- [ ] Settings options provide meaningful control over player experience
- [ ] Visual feedback for button interactions is immediate and satisfying

## Technical Specifications

### Files to Create/Modify

**New Files:**

- `src/scenes/MenuScene.ts` - Main menu scene with navigation and UI management
- `src/ui/MenuButton.ts` - Neon-styled interactive button component
- `src/ui/SettingsPanel.ts` - Settings overlay with audio/graphics/controls configuration
- `src/ui/MenuBackground.ts` - Animated vaporwave background component
- `src/systems/SettingsManager.ts` - Settings persistence and validation system
- `tests/scenes/MenuScene.test.ts` - Unit tests for menu navigation and settings

**Modified Files:**

- `src/scenes/PreloadScene.ts` - Add transition to MenuScene after loading
- `src/config/settings.ts` - Create settings schema and default values
- `src/core/SceneManager.ts` - Add MenuScene to scene flow management

### Class/Interface Definitions

```typescript
// Menu navigation options
enum MenuOption {
  PLAY = "play",
  UPGRADES = "upgrades",
  SETTINGS = "settings",
  CREDITS = "credits",
}

// Settings configuration interface
interface GameSettings {
  audio: {
    masterVolume: number; // 0.0 to 1.0
    sfxVolume: number;
    musicVolume: number;
    muted: boolean;
  };
  graphics: {
    screenShake: boolean;
    particleEffects: boolean;
    glowIntensity: number; // 0.0 to 1.0
    backgroundAnimation: boolean;
  };
  controls: {
    keyboardLayout: 'wasd' | 'arrows';
    gamepadEnabled: boolean;
    touchControlsVisible: boolean;
    fireMode: 'hold' | 'toggle';
  };
  accessibility: {
    highContrast: boolean;
    colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    uiScale: number; // 0.8 to 1.5
  };
}

// Main Menu Scene class
class MenuScene extends Phaser.Scene {
  private menuButtons: Map<MenuOption, MenuButton>;
  private settingsPanel!: SettingsPanel;
  private menuBackground!: MenuBackground;
  private settingsManager!: SettingsManager;
  private selectedOption: MenuOption = MenuOption.PLAY;
  private titleText!: Phaser.GameObjects.Text;
  private subtitleText!: Phaser.GameObjects.Text;
  private navigationEnabled: boolean = true;

  constructor() {
    super({ key: "MenuScene" });
  }

  public init(): void {
    // Initialize settings manager and input handlers
  }

  public create(): void {
    // Create menu UI, background, and set up interactions
  }

  private createBackground(): void {
    // Set up animated vaporwave background
  }

  private createMenuTitle(): void {
    // Create game title with neon styling
  }

  private createMenuButtons(): void {
    // Create interactive menu options with navigation
  }

  private setupInputHandlers(): void {
    // Configure keyboard, gamepad, and touch input
  }

  private onMenuOptionSelected(option: MenuOption): void {
    // Handle menu selection with appropriate scene transition
  }

  private onPlaySelected(): void {
    // Start new game session
  }

  private onUpgradesSelected(): void {
    // Transition to MetaHub Scene
  }

  private onSettingsSelected(): void {
    // Show settings panel overlay
  }

  private onCreditsSelected(): void {
    // Display credits information
  }

  private navigateMenu(direction: 'up' | 'down'): void {
    // Keyboard/gamepad menu navigation
  }

  private updateMenuSelection(): void {
    // Update visual selection indicators
  }
}

// Neon-styled menu button component
class MenuButton extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;
  private glowEffect: Phaser.GameObjects.Rectangle;
  private isSelected: boolean = false;
  private isEnabled: boolean = true;
  private option: MenuOption;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    option: MenuOption
  ) {
    super(scene, x, y);
    this.option = option;
    this.createButtonElements(text);
  }

  public setSelected(selected: boolean): void {
    // Update visual state for selection
  }

  public setEnabled(enabled: boolean): void {
    // Enable/disable button interaction
  }

  public getOption(): MenuOption {
    return this.option;
  }

  private createButtonElements(text: string): void {
    // Create layered button with neon glow effect
  }

  private onPointerOver(): void {
    // Mouse hover effects
  }

  private onPointerOut(): void {
    // Mouse leave effects
  }

  private onPointerDown(): void {
    // Click/touch feedback
  }

  private animateGlow(): void {
    // Pulsing glow animation
  }
}

// Settings panel overlay
class SettingsPanel extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private settingsManager: SettingsManager;
  private audioControls: Map<string, Phaser.GameObjects.GameObject>;
  private graphicsControls: Map<string, Phaser.GameObjects.GameObject>;
  private controlsConfig: Map<string, Phaser.GameObjects.GameObject>;
  private isVisible: boolean = false;

  constructor(scene: Phaser.Scene, settingsManager: SettingsManager) {
    super(scene, 0, 0);
    this.settingsManager = settingsManager;
    this.createSettingsInterface();
  }

  public show(): void {
    // Animate settings panel appearance
  }

  public hide(): void {
    // Animate settings panel disappearance
  }

  public updateSettings(newSettings: Partial<GameSettings>): void {
    // Apply settings changes and update UI
  }

  private createSettingsInterface(): void {
    // Create categorized settings controls
  }

  private createAudioSettings(): void {
    // Volume sliders and audio options
  }

  private createGraphicsSettings(): void {
    // Visual effect toggles and quality options
  }

  private createControlSettings(): void {
    // Input configuration options
  }

  private createAccessibilitySettings(): void {
    // Accessibility and contrast options
  }

  private onSettingChanged(setting: string, value: any): void {
    // Handle individual setting changes
  }

  private resetToDefaults(): void {
    // Reset all settings to default values
  }
}

// Animated vaporwave background
class MenuBackground extends Phaser.GameObjects.Container {
  private gridLines: Phaser.GameObjects.Graphics[];
  private stars: Phaser.GameObjects.Sprite[];
  private gradientOverlay: Phaser.GameObjects.Rectangle;
  private animationSpeed: number = 1.0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.createBackgroundElements();
  }

  public update(delta: number): void {
    // Animate background elements
  }

  public setAnimationSpeed(speed: number): void {
    // Control animation intensity based on settings
  }

  private createBackgroundElements(): void {
    // Create layered vaporwave background
  }

  private createGrid(): void {
    // Animated perspective grid
  }

  private createStars(): void {
    // Twinkling star field
  }

  private createGradient(): void {
    // Color gradient overlay
  }

  private animateGrid(delta: number): void {
    // Grid movement animation
  }

  private animateStars(delta: number): void {
    // Star twinkling effects
  }
}

// Settings persistence and management
class SettingsManager extends Phaser.Events.EventEmitter {
  private currentSettings: GameSettings;
  private defaultSettings: GameSettings;
  private storageKey: string = 'asteroids-neon-shards-settings';

  constructor() {
    super();
    this.loadSettings();
  }

  public getSetting<K extends keyof GameSettings>(
    category: K,
    key: keyof GameSettings[K]
  ): GameSettings[K][keyof GameSettings[K]] {
    // Get specific setting value
  }

  public updateSetting<K extends keyof GameSettings>(
    category: K,
    key: keyof GameSettings[K],
    value: GameSettings[K][keyof GameSettings[K]]
  ): void {
    // Update and persist setting
  }

  public getSettings(): GameSettings {
    return this.currentSettings;
  }

  public resetToDefaults(): void {
    // Reset all settings to defaults
  }

  private loadSettings(): void {
    // Load settings from localStorage with validation
  }

  private saveSettings(): void {
    // Persist settings to localStorage
  }

  private validateSettings(settings: any): GameSettings {
    // Validate loaded settings and apply defaults for missing values
  }

  private applySettings(): void {
    // Apply current settings to game systems
  }
}
```

### Integration Points

**Scene Flow Integration:**

- PreloadScene: Transitions to MenuScene after asset loading
- MenuScene: Transitions to GameScene, MetaHub, or returns to self
- Settings: Persists across all scenes and game sessions

**System Dependencies:**

- SettingsManager: Provides configuration for all game systems
- Audio system: Volume and mute controls from settings
- Input system: Control scheme configuration
- Graphics: Effect intensity and quality settings

**UI System Integration:**

- Responsive scaling: Adapts to different screen sizes
- Input abstraction: Supports multiple input methods
- Accessibility: High contrast and colorblind support

## Implementation Tasks

### Dev Agent Record

**Tasks:**

- [ ] Create GameSettings interface and SettingsManager class with localStorage persistence
- [ ] Implement MenuButton component with neon styling and interaction states
- [ ] Build MenuScene with responsive layout and navigation flow
- [ ] Create SettingsPanel overlay with categorized controls (audio, graphics, input, accessibility)
- [ ] Add MenuBackground component with animated vaporwave elements (grid, stars, gradients)
- [ ] Implement keyboard navigation (tab, arrow keys, enter, escape) for accessibility
- [ ] Add gamepad navigation support for console-style menu control
- [ ] Create smooth scene transitions to GameScene and MetaHub
- [ ] Add touch-friendly button sizing and interaction for mobile devices
- [ ] Implement settings validation and default value fallbacks
- [ ] Create credits display with BMAD method acknowledgment and development info
- [ ] Add visual feedback for all interactions (hover, select, click)
- [ ] Integrate with existing SceneManager for consistent transition handling
- [ ] Write unit tests for SettingsManager persistence and validation logic
- [ ] Test responsive design across desktop and mobile screen sizes
- [ ] Verify accessibility features work correctly with keyboard and screen readers

**Debug Log:**
| Task | File | Change | Reverted? |
|------|------|--------|-----------|
| | | | |

**Completion Notes:**

<!-- Only note deviations from requirements, keep under 50 words -->

**Change Log:**

<!-- Only requirement changes during implementation -->

## Game Design Context

**GDD Reference:** Section 6 (UI/UX Design)

**Game Mechanic:** Navigation hub that provides access to all game modes and configuration

**Player Experience Goal:** Create an exciting, premium menu experience that builds anticipation for gameplay while providing easy access to settings and progression. The menu should feel like part of the game experience rather than just functional navigation.

**Design Parameters:**

- Visual Identity: Vaporwave aesthetic with neon colors and retro-futuristic elements
- Navigation Priority: Play button most prominent, Upgrades secondary, Settings tertiary
- Accessibility: Keyboard navigation, colorblind support, scaling options
- Responsiveness: Works well on desktop (mouse/keyboard) and mobile (touch)
- Settings Scope: Audio, graphics, controls, and accessibility options

## Testing Requirements

### Unit Tests

**Test Files:**

- `tests/scenes/MenuScene.test.ts`
- `tests/ui/MenuButton.test.ts`
- `tests/ui/SettingsPanel.test.ts`
- `tests/systems/SettingsManager.test.ts`

**Test Scenarios:**

- MenuScene navigation works correctly with keyboard, mouse, and gamepad input
- SettingsManager persists settings to localStorage and validates loaded data
- MenuButton components respond to interaction with proper visual feedback
- SettingsPanel applies setting changes and updates UI controls correctly
- Scene transitions work properly to GameScene and MetaHub
- Responsive layout adapts correctly to different screen sizes
- Accessibility features function properly with keyboard navigation

### Integration Tests

**Manual Test Cases:**

1. **Navigation Flow Test**
   - Expected: All menu options navigate to correct scenes/overlays
   - Performance: Smooth transitions without visual artifacts or delays

2. **Settings Persistence Test**
   - Expected: Settings save and load correctly across browser sessions
   - Edge Case: Invalid localStorage data falls back to defaults gracefully

3. **Responsive Design Test**
   - Expected: Menu adapts to desktop, tablet, and mobile screen sizes
   - Edge Case: Extreme aspect ratios maintain usable layout

4. **Accessibility Test**
   - Expected: Full keyboard navigation, high contrast mode, proper focus indicators
   - Performance: Smooth navigation without input lag

### Performance Tests

**Metrics to Verify:**

- Menu maintains 60 FPS with background animations and UI effects
- Scene transitions complete within 16ms (single frame)
- Settings loading/saving completes within 50ms
- UI scaling calculations complete within 10ms for responsive updates

## Dependencies

**Story Dependencies:**

- SI-002: Preload Scene (completed) - Required for scene flow from loading
- Future: MetaHub Scene story - Required for upgrades navigation

**Technical Dependencies:**

- Phaser 3.70+ UI and scene management systems
- LocalStorage support for settings persistence
- CSS-safe color palette for accessibility compliance

**Asset Dependencies:**

- Menu background elements: Grid, star, and gradient textures
- Location: `assets/ui/menu-bg.png`, `grid-pattern.png`, `stars.png`
- Button assets: Neon button states and glow effects
- Location: `assets/ui/button-normal.png`, `button-hover.png`, `button-pressed.png`
- Menu music: Vaporwave background track for menu atmosphere
- Location: `assets/audio/menu-theme.ogg`

## Definition of Done

- [ ] All acceptance criteria met and verified through testing
- [ ] Code reviewed and follows TypeScript strict mode standards
- [ ] Unit tests written and passing (>85% coverage for UI logic)
- [ ] Integration tests passing with scene transitions and settings persistence
- [ ] Performance targets met (60 FPS, <16ms transitions)
- [ ] No ESLint warnings or errors in menu system code
- [ ] Responsive design works across desktop and mobile browsers
- [ ] Accessibility features function correctly with keyboard navigation
- [ ] Settings persist properly across browser sessions
- [ ] Visual design matches vaporwave aesthetic and maintains high contrast
- [ ] All navigation options work correctly with smooth scene transitions

## Notes

**Implementation Notes:**

- Use `this.input.keyboard.createCursorKeys()` for arrow key navigation
- Implement proper focus management for accessibility compliance
- Use Phaser's built-in scaling manager for responsive design
- Cache settings in memory to avoid localStorage calls during gameplay

**Design Decisions:**

- Play button prominence: Primary call-to-action for immediate game access
- Settings overlay: Non-modal to allow quick adjustments without losing context
- Vaporwave aesthetic: Establishes visual identity before gameplay begins
- Responsive layout: Ensures good experience across all supported devices

**Future Considerations:**

- Online leaderboard integration for competitive elements
- Achievement system display in menu
- Social sharing features for high scores
- Dynamic background that reflects player progression level