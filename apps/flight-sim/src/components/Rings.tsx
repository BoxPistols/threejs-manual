"use client";

import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AircraftState } from "./Aircraft";

/**
 * チェックポイントリング
 * 飛行機が近づくとスコアが加算され、新しい位置にリスポーンする
 */

interface RingsProps {
  stateRef: React.RefObject<AircraftState>;
  onScoreChange: (score: number) => void;
}

// リングの位置を生成（低高度・近距離に集中）
function generateRingPosition(): [number, number, number] {
  const x = (Math.random() - 0.5) * 400;
  const y = 20 + Math.random() * 120;
  const z = (Math.random() - 0.5) * 400;
  return [x, y, z];
}

const RING_COUNT = 12;
const COLLECTION_DISTANCE = 20; // 広めの通過判定

interface RingData {
  position: [number, number, number];
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
    meshRef.current.rotation.y += delta * 0.8;

    // 発光アニメーション
    glowRef.current += delta * 2;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.5 + Math.sin(glowRef.current) * 0.3;

    // 衝突判定
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
    >
      <torusGeometry args={[8, 0.6, 8, 32]} />
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
