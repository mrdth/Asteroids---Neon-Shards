export interface PlayerConfig {
    thrust: number;      // acceleration force
    turnSpeed: number;   // angular velocity degrees/sec
    friction: number;    // velocity damping coefficient
    maxSpeed: number;    // velocity clamp
}

export const PLAYER_CONFIG: PlayerConfig = {
    thrust: 220,         // units/sec² - provides good acceleration without being overpowered
    turnSpeed: 210,      // degrees/sec - allows quick direction changes for asteroid dodging
    friction: 0.98,      // per frame - gradual momentum loss, maintains "space physics" feel
    maxSpeed: 600        // units/sec - prevents uncontrollable high-speed situations
};

export enum AsteroidSize {
    LARGE = 'large',
    MEDIUM = 'medium',
    SMALL = 'small'
}

export interface AsteroidConfig {
    health: number;
    speed: number;
    splitCount: [number, number]; // min/max splits
    scale: number;
    spinRange: [number, number]; // degrees/sec min/max
}

export const ASTEROID_CONFIGS: Record<AsteroidSize, AsteroidConfig> = {
    [AsteroidSize.LARGE]: {
        health: 100,
        speed: 60,
        splitCount: [2, 3],
        scale: 1.0,
        spinRange: [-60, 60]
    },
    [AsteroidSize.MEDIUM]: {
        health: 50,
        speed: 90,
        splitCount: [2, 3],
        scale: 0.65,
        spinRange: [-60, 60]
    },
    [AsteroidSize.SMALL]: {
        health: 20,
        speed: 130,
        splitCount: [0, 0], // small asteroids don't split
        scale: 0.35,
        spinRange: [-60, 60]
    }
};

export const ASTEROID_SYSTEM_CONFIG = {
    maxActiveCount: 20,
    safeSpawnRadius: 150,
    crackThresholds: [0.25, 0.5, 0.75] // damage percentages when cracks appear
};

export interface WeaponConfig {
    fireRateHz: number;        // shots per second (4.0)
    bulletSpeed: number;       // pixels per second (520)
    bulletDamage: number;      // damage per shot (20)
    bulletLifetimeMs: number;  // bullet lifetime in milliseconds (3000)
    maxActiveBullets: number;  // maximum concurrent bullets (15)
    muzzleOffset: number;      // distance from ship center to muzzle (16)
}

export const WEAPON_CONFIG: WeaponConfig = {
    fireRateHz: 4.0,           // 4 shots per second as per GDD
    bulletSpeed: 520,          // units/sec for precise targeting
    bulletDamage: 20,          // base damage per shot
    bulletLifetimeMs: 3000,    // 3 second lifetime
    maxActiveBullets: 15,      // performance optimization
    muzzleOffset: 16           // spawn bullets ahead of ship
};