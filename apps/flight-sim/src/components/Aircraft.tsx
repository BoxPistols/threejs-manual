"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { KeyState } from "@/hooks/useKeyboard";
import {
  calculateThrust,
  calculateLift,
  calculateDrag,
  calculateGravity,
  calculateSpeedDelta,
  clampSpeed,
  PITCH_RATE,
  ROLL_RATE,
  MAX_SPEED,
} from "@/lib/physics";

/**
 * 飛行機の状態
 */
export interface AircraftState {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  speed: number;
  altitude: number;
  thrust: number;
  pitch: number;
  roll: number;
}

interface AircraftProps {
  keys: React.RefObject<KeyState>;
  stateRef: React.RefObject<AircraftState>;
}

// 初期スポーン位置
const SPAWN_POSITION = new THREE.Vector3(0, 50, 0);
const INITIAL_THRUST = 30;
const INITIAL_SPEED = 40;

export default function Aircraft({ keys, stateRef }: AircraftProps) {
  const groupRef = useRef<THREE.Group>(null);

  // 内部物理状態
  const velocity = useRef(new THREE.Vector3(0, 0, -INITIAL_SPEED));
  const speedRef = useRef(INITIAL_SPEED);
  const thrustRef = useRef(INITIAL_THRUST);
  const pitchRef = useRef(0);
  const rollRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current || !keys.current) return;

    // デルタ時間を制限（タブ切替時の大ジャンプ防止）
    const dt = Math.min(delta, 0.05);
    const k = keys.current;

    // --- 入力処理 ---

    // 推力の増減（Space/Shift）
    if (k["Space"]) {
      thrustRef.current = Math.min(100, thrustRef.current + 30 * dt);
    }
    if (k["ShiftLeft"] || k["ShiftRight"]) {
      thrustRef.current = Math.max(0, thrustRef.current - 30 * dt);
    }

    // ピッチ操作（W/S）
    if (k["KeyW"]) {
      pitchRef.current += PITCH_RATE * dt;
    }
    if (k["KeyS"]) {
      pitchRef.current -= PITCH_RATE * dt;
    }
    // ピッチ自動復帰（操作なし時にゆっくり戻る）
    if (!k["KeyW"] && !k["KeyS"]) {
      pitchRef.current *= 1 - 1.0 * dt;
    }
    // ピッチ制限
    pitchRef.current = Math.max(
      -Math.PI / 3,
      Math.min(Math.PI / 3, pitchRef.current)
    );

    // ロール操作（A/D）
    if (k["KeyA"]) {
      rollRef.current += ROLL_RATE * dt;
    }
    if (k["KeyD"]) {
      rollRef.current -= ROLL_RATE * dt;
    }
    // ロール自動復帰
    if (!k["KeyA"] && !k["KeyD"]) {
      rollRef.current *= 1 - 1.5 * dt;
    }
    // ロール制限
    rollRef.current = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, rollRef.current)
    );

    // --- 物理計算 ---
    const speed = speedRef.current;
    const thrust = calculateThrust(thrustRef.current);
    const drag = calculateDrag(speed);
    const lift = calculateLift(speed);
    const gravity = calculateGravity();

    // 速度更新
    const speedDelta = calculateSpeedDelta(thrust, drag, dt);
    speedRef.current = clampSpeed(speed + speedDelta);

    // 機体のクォータニオンから前方向ベクトルを取得
    const quaternion = groupRef.current.quaternion;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion);

    // 速度ベクトルを計算（機体の向いている方向に飛ぶ）
    velocity.current.copy(forward).multiplyScalar(speedRef.current);

    // 揚力と重力の効果
    const liftForce = (lift - gravity) / 1000;
    // 速度が十分な場合のみ揚力が効く
    const liftFactor = Math.min(1, speed / 30);
    velocity.current.y += liftForce * liftFactor * dt * 5;

    // ロールによる旋回（ロール角に応じてヨー方向に曲がる）
    const yawRate = -rollRef.current * 0.8 * (speed / MAX_SPEED);
    const yawQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      yawRate * dt
    );

    // ピッチ回転（機体のローカルX軸周り）
    const pitchQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion).normalize(),
      pitchRef.current * dt
    );

    // ロール回転（機体のローカルZ軸周り）
    const rollQuat = new THREE.Quaternion().setFromAxisAngle(
      forward.clone().normalize(),
      rollRef.current * dt * 0.5
    );

    // 回転を適用
    groupRef.current.quaternion.premultiply(yawQuat);
    groupRef.current.quaternion.premultiply(pitchQuat);

    // ロールを視覚的に反映（機体の傾き）
    const euler = new THREE.Euler().setFromQuaternion(
      groupRef.current.quaternion,
      "YXZ"
    );
    euler.z = rollRef.current;
    groupRef.current.quaternion.setFromEuler(euler);

    // 位置更新
    groupRef.current.position.add(
      velocity.current.clone().multiplyScalar(dt)
    );

    // 地面衝突判定（高度0以下でリスポーン）
    if (groupRef.current.position.y < 1) {
      groupRef.current.position.copy(SPAWN_POSITION);
      groupRef.current.quaternion.identity();
      speedRef.current = INITIAL_SPEED;
      thrustRef.current = INITIAL_THRUST;
      pitchRef.current = 0;
      rollRef.current = 0;
      velocity.current.set(0, 0, -INITIAL_SPEED);
    }

    // 高度上限
    if (groupRef.current.position.y > 500) {
      groupRef.current.position.y = 500;
    }

    // --- 外部への状態共有 ---
    if (stateRef.current) {
      stateRef.current.position = groupRef.current.position.clone();
      stateRef.current.rotation = euler.clone();
      stateRef.current.speed = speedRef.current;
      stateRef.current.altitude = groupRef.current.position.y;
      stateRef.current.thrust = thrustRef.current;
      stateRef.current.pitch = pitchRef.current;
      stateRef.current.roll = rollRef.current;
    }
  });

  return (
    <group ref={groupRef} position={[SPAWN_POSITION.x, SPAWN_POSITION.y, SPAWN_POSITION.z]}>
      {/* 胴体 (Fuselage) - シリンダー */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 4, 8]} />
        <meshStandardMaterial color="#4F46E5" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ノーズコーン */}
      <mesh position={[0, 0, -2.3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.4, 1.2, 8]} />
        <meshStandardMaterial color="#6366F1" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* 主翼 (Main Wings) */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[7, 0.08, 1.2]} />
        <meshStandardMaterial color="#4F46E5" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 水平尾翼 */}
      <mesh position={[0, 0.1, 1.8]}>
        <boxGeometry args={[3, 0.06, 0.6]} />
        <meshStandardMaterial color="#4F46E5" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 垂直尾翼 */}
      <mesh position={[0, 0.7, 1.6]}>
        <boxGeometry args={[0.06, 1.2, 0.8]} />
        <meshStandardMaterial color="#4F46E5" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* エンジンナセル（左） */}
      <mesh position={[-1.5, -0.2, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.8, 6]} />
        <meshStandardMaterial color="#3730A3" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* エンジンナセル（右） */}
      <mesh position={[1.5, -0.2, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.8, 6]} />
        <meshStandardMaterial color="#3730A3" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* コックピット窓 */}
      <mesh position={[0, 0.35, -1.2]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.5, 0.15, 0.6]} />
        <meshStandardMaterial
          color="#93C5FD"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}
