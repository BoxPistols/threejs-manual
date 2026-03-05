"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { KeyState } from "@/hooks/useKeyboard";
import {
  BASE_SPEED,
  BOOST_SPEED,
  PITCH_RATE,
  TURN_RATE,
  AUTO_LEVEL_RATE,
  MIN_ALTITUDE,
  MAX_ALTITUDE,
} from "@/lib/physics";

/**
 * 飛行機の状態
 */
export interface AircraftState {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  speed: number;
  altitude: number;
  boosting: boolean;
}

interface AircraftProps {
  keys: React.RefObject<KeyState>;
  stateRef: React.RefObject<AircraftState>;
}

// 初期スポーン位置
const SPAWN_POSITION = new THREE.Vector3(0, 50, 0);

export default function Aircraft({ keys, stateRef }: AircraftProps) {
  const groupRef = useRef<THREE.Group>(null);

  // 内部状態
  const yawAngle = useRef(0); // Y軸回転角
  const pitchAngle = useRef(0); // ピッチ角
  const rollAngle = useRef(0); // 見た目のロール角
  const speedRef = useRef(BASE_SPEED);

  useFrame((_, delta) => {
    if (!groupRef.current || !keys.current) return;

    const dt = Math.min(delta, 0.05);
    const k = keys.current;

    // --- 入力処理 ---

    // ブースト（Space）
    const boosting = !!k["Space"];
    const targetSpeed = boosting ? BOOST_SPEED : BASE_SPEED;
    speedRef.current += (targetSpeed - speedRef.current) * 3 * dt;

    // ピッチ操作（上下キー）
    if (k["ArrowUp"]) {
      pitchAngle.current += PITCH_RATE * dt;
    }
    if (k["ArrowDown"]) {
      pitchAngle.current -= PITCH_RATE * dt;
    }
    // ピッチ自動復帰
    if (!k["ArrowUp"] && !k["ArrowDown"]) {
      pitchAngle.current *= 1 - AUTO_LEVEL_RATE * dt;
    }
    // ピッチ制限
    pitchAngle.current = Math.max(
      -Math.PI / 4,
      Math.min(Math.PI / 4, pitchAngle.current)
    );

    // 旋回操作（左右キー）
    let turnInput = 0;
    if (k["ArrowLeft"]) {
      turnInput = 1;
    }
    if (k["ArrowRight"]) {
      turnInput = -1;
    }
    yawAngle.current += turnInput * TURN_RATE * dt;

    // ロール（旋回時に自動で傾く、見た目のみ）
    const targetRoll = turnInput * 0.5; // 最大30度程度
    rollAngle.current += (targetRoll - rollAngle.current) * 4 * dt;

    // --- 位置・回転の更新 ---

    // 前方向ベクトル（yawとpitchから計算）
    const forward = new THREE.Vector3(
      -Math.sin(yawAngle.current) * Math.cos(pitchAngle.current),
      Math.sin(pitchAngle.current),
      -Math.cos(yawAngle.current) * Math.cos(pitchAngle.current)
    );

    // 位置更新
    groupRef.current.position.addScaledVector(
      forward,
      speedRef.current * dt
    );

    // 高度制限
    if (groupRef.current.position.y < MIN_ALTITUDE) {
      groupRef.current.position.y = MIN_ALTITUDE;
      if (pitchAngle.current < 0) pitchAngle.current = 0;
    }
    if (groupRef.current.position.y > MAX_ALTITUDE) {
      groupRef.current.position.y = MAX_ALTITUDE;
      if (pitchAngle.current > 0) pitchAngle.current = 0;
    }

    // 回転を適用（Euler: Y=ヨー, X=ピッチ, Z=ロール）
    groupRef.current.rotation.set(
      pitchAngle.current,
      yawAngle.current,
      rollAngle.current,
      "YXZ"
    );

    // --- 外部への状態共有 ---
    if (stateRef.current) {
      stateRef.current.position = groupRef.current.position.clone();
      stateRef.current.rotation = groupRef.current.rotation.clone();
      stateRef.current.speed = speedRef.current;
      stateRef.current.altitude = groupRef.current.position.y;
      stateRef.current.boosting = boosting;
    }
  });

  return (
    <group ref={groupRef} position={[SPAWN_POSITION.x, SPAWN_POSITION.y, SPAWN_POSITION.z]}>
      {/* 胴体 (Fuselage) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 4, 8]} />
        <meshStandardMaterial color="#4F46E5" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ノーズコーン */}
      <mesh position={[0, 0, -2.3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.4, 1.2, 8]} />
        <meshStandardMaterial color="#6366F1" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* 主翼 */}
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
