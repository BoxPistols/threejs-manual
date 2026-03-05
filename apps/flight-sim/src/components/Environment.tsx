"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * 環境要素：空・雲・霧・ライティング
 */

// 雲の位置をランダム生成
function generateCloudPositions(count: number): [number, number, number][] {
  const positions: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 1500;
    const y = 80 + Math.random() * 250;
    const z = (Math.random() - 0.5) * 1500;
    positions.push([x, y, z]);
  }
  return positions;
}

// 個々の雲コンポーネント
function Cloud({ position }: { position: [number, number, number] }) {
  // 複数の球体で雲を構成
  const offsets = useMemo(() => {
    const count = 3 + Math.floor(Math.random() * 4);
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 3,
      z: (Math.random() - 0.5) * 8,
      scale: 3 + Math.random() * 6,
    }));
  }, []);

  return (
    <group position={position}>
      {offsets.map((offset, i) => (
        <mesh key={i} position={[offset.x, offset.y, offset.z]}>
          <sphereGeometry args={[offset.scale, 8, 6]} />
          <meshStandardMaterial
            color="#FFFFFF"
            transparent
            opacity={0.6}
            roughness={1}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Environment() {
  const cloudPositions = useMemo(() => generateCloudPositions(60), []);

  return (
    <>
      {/* 環境光 */}
      <ambientLight intensity={0.5} />

      {/* 太陽光（ディレクショナルライト） */}
      <directionalLight
        position={[200, 300, 100]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* 補助光 */}
      <hemisphereLight
        args={["#87CEEB", "#2D5A27", 0.4]}
      />

      {/* 空の球体 */}
      <mesh>
        <sphereGeometry args={[900, 32, 16]} />
        <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
      </mesh>

      {/* 霧 */}
      <fog attach="fog" args={["#B0C4DE", 100, 800]} />

      {/* 雲 */}
      {cloudPositions.map((pos, i) => (
        <Cloud key={i} position={pos} />
      ))}
    </>
  );
}
