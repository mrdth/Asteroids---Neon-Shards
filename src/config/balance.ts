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