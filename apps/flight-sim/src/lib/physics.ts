/**
 * 飛行物理エンジン
 * 推力・揚力・重力・抗力の計算を行う純粋関数群
 */

// 物理定数
export const GRAVITY = 9.8; // 重力加速度 (m/s²)
export const AIR_DENSITY = 1.225; // 空気密度 (kg/m³)
export const WING_AREA = 20; // 翼面積 (m²)
export const LIFT_COEFFICIENT = 0.8; // 揚力係数
export const DRAG_COEFFICIENT = 0.04; // 抗力係数
export const MASS = 1000; // 機体質量 (kg)
export const MAX_THRUST = 50000; // 最大推力 (N)
export const MIN_SPEED = 0; // 最小速度
export const MAX_SPEED = 300; // 最大速度 (m/s)

// 操縦感度
export const PITCH_RATE = 1.5; // ピッチ回転速度 (rad/s)
export const ROLL_RATE = 2.0; // ロール回転速度 (rad/s)

/**
 * 推力を計算する
 * @param thrustPercent - 推力パーセント (0-100)
 * @returns 推力 (N)
 */
export function calculateThrust(thrustPercent: number): number {
  return (thrustPercent / 100) * MAX_THRUST;
}

/**
 * 揚力を計算する（速度に比例）
 * @param speed - 現在の速度 (m/s)
 * @returns 揚力 (N)
 */
export function calculateLift(speed: number): number {
  // 揚力 = 0.5 * ρ * v² * S * Cl
  return 0.5 * AIR_DENSITY * speed * speed * WING_AREA * LIFT_COEFFICIENT;
}

/**
 * 抗力を計算する（速度²に比例）
 * @param speed - 現在の速度 (m/s)
 * @returns 抗力 (N)
 */
export function calculateDrag(speed: number): number {
  // 抗力 = 0.5 * ρ * v² * S * Cd
  return 0.5 * AIR_DENSITY * speed * speed * WING_AREA * DRAG_COEFFICIENT;
}

/**
 * 重力を計算する
 * @returns 重力 (N)
 */
export function calculateGravity(): number {
  return MASS * GRAVITY;
}

/**
 * 速度の変化量を計算する
 * @param thrust - 推力 (N)
 * @param drag - 抗力 (N)
 * @param delta - フレーム間時間 (s)
 * @returns 速度変化量 (m/s)
 */
export function calculateSpeedDelta(
  thrust: number,
  drag: number,
  delta: number
): number {
  const netForce = thrust - drag;
  const acceleration = netForce / MASS;
  return acceleration * delta;
}

/**
 * 高度の変化量を計算する
 * @param lift - 揚力 (N)
 * @param gravity - 重力 (N)
 * @param pitch - ピッチ角 (rad)
 * @param speed - 速度 (m/s)
 * @param delta - フレーム間時間 (s)
 * @returns 高度変化量 (m)
 */
export function calculateAltitudeDelta(
  lift: number,
  gravity: number,
  pitch: number,
  speed: number,
  delta: number
): number {
  // ピッチによる上昇/下降成分
  const verticalComponent = Math.sin(pitch) * speed * delta;
  // 揚力と重力の差による上昇/下降
  const liftEffect = ((lift - gravity) / MASS) * delta;
  return verticalComponent + liftEffect * 0.3;
}

/**
 * 速度を制限する
 * @param speed - 速度
 * @returns 制限された速度
 */
export function clampSpeed(speed: number): number {
  return Math.max(MIN_SPEED, Math.min(MAX_SPEED, speed));
}
