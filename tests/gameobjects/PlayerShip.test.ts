import { describe, it, expect, beforeEach, vi } from "vitest";
import { PLAYER_CONFIG } from "../../src/config/balance";

// Test just the configuration and constants without full Phaser integration
// Full integration tests should be done in a real browser environment

describe("PlayerShip Configuration", () => {
  describe("Physics Constants", () => {
    it("should use correct GDD values from config", () => {
      expect(PLAYER_CONFIG.thrust).toBe(220);
      expect(PLAYER_CONFIG.turnSpeed).toBe(210);
      expect(PLAYER_CONFIG.friction).toBe(0.98);
      expect(PLAYER_CONFIG.maxSpeed).toBe(600);
    });

    it("should have balance values within expected ranges", () => {
      expect(PLAYER_CONFIG.thrust).toBeGreaterThan(0);
      expect(PLAYER_CONFIG.turnSpeed).toBeGreaterThan(0);
      expect(PLAYER_CONFIG.friction).toBeGreaterThan(0);
      expect(PLAYER_CONFIG.friction).toBeLessThanOrEqual(1);
      expect(PLAYER_CONFIG.maxSpeed).toBeGreaterThan(PLAYER_CONFIG.thrust);
    });
  });
});
