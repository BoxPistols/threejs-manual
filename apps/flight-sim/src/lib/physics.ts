/**
 * シンプルな飛行物理
 * アーケード風の簡単な操作向け
 */

// 基本パラメータ
export const BASE_SPEED = 40; // 通常速度 (m/s)
export const BOOST_SPEED = 80; // ブースト速度 (m/s)
export const PITCH_RATE = 1.2; // ピッチ回転速度 (rad/s)
export const TURN_RATE = 1.5; // 旋回速度 (rad/s)
export const AUTO_LEVEL_RATE = 2.0; // 自動水平復帰速度
export const MIN_ALTITUDE = 5; // 最低高度
export const MAX_ALTITUDE = 400; // 最高高度
