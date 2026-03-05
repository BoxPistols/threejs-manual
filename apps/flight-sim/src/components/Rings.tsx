"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AircraftState } from "./Aircraft";

/**
 * チェックポイントリング
 * 飛行機が通過するとスコアが加算され、新しい位置にリスポーンする
 */

interface RingsProps {
  stateRef: React.RefObject<AircraftState>;
  onScoreChange: (score: number) => void;
}

// リングの位置を生成
function generateRingPosition(): [number, number, number] {
  const x = (Math.random() - 0.5) * 600;
  const y = 30 + Math.random() * 200;
  const z = (Math.random() - 0.5) * 600;
  return [x, y, z];
}

// リングのランダム回転を生成
function generateRingRotation(): [number, number, number] {
  return [
    (Math.random() - 0.5) * 0.5,
    Math.random() * Math.PI * 2,
    (Math.random() - 0.5) * 0.5,
  ];
}

const RING_COUNT = 10;
const COLLECTION_DISTANCE = 12; // 通過判定の距離

interface RingData {
  position: [number, number, number];
  rotation: [number, number, number];
  id: number;
}

// 個々のリングコンポーネント
function CheckpointRing({
  ring,
  onCollect,
  stateRef,
}: {
  ring: RingData;
  onCollect: (id: number) => void;
  stateRef: React.RefObject<AircraftState>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const collected = useRef(false);
  const glowRef = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current || !stateRef.current || collected.current) return;

    // リングの回転アニメーション
    meshRef.current.rotation.z += delta * 0.5;

    // 発光アニメーション
    glowRef.current += delta * 2;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.5 + Math.sin(glowRef.current) * 0.3;

    // 衝突判定（飛行機とリングの距離）
    const aircraftPos = stateRef.current.position;
    const ringPos = new THREE.Vector3(...ring.position);
    const distance = aircraftPos.distanceTo(ringPos);

    if (distance < COLLECTION_DISTANCE) {
      collected.current = true;
      onCollect(ring.id);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={ring.position}
      rotation={ring.rotation}
    >
      <torusGeometry args={[6, 0.5, 8, 32]} />
      <meshStandardMaterial
        color="#F59E0B"
        emissive="#F59E0B"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

export default function Rings({ stateRef, onScoreChange }: RingsProps) {
  const scoreRef = useRef(0);
  const [rings, setRings] = useState<RingData[]>(() =>
    Array.from({ length: RING_COUNT }).map((_, i) => ({
      position: generateRingPosition(),
      rotation: generateRingRotation(),
      id: i,
    }))
  );

  const nextIdRef = useRef(RING_COUNT);

  const handleCollect = useCallback(
    (id: number) => {
      scoreRef.current += 1;
      onScoreChange(scoreRef.current);

      // 収集されたリングを新しい位置にリスポーン
      setRings((prev) =>
        prev.map((ring) => {
          if (ring.id === id) {
            const newId = nextIdRef.current++;
            return {
              position: generateRingPosition(),
              rotation: generateRingRotation(),
              id: newId,
            };
          }
          return ring;
        })
      );
    },
    [onScoreChange]
  );

  return (
    <group>
      {rings.map((ring) => (
        <CheckpointRing
          key={ring.id}
          ring={ring}
          onCollect={handleCollect}
          stateRef={stateRef}
        />
      ))}
    </group>
  );
}
