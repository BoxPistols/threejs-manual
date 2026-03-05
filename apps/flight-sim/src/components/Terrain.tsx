"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * プロシージャル地形
 * PlaneGeometryの頂点を変位させて丘陵を生成する
 */

// 簡易ノイズ関数（シンプルなsin合成）
function pseudoNoise(x: number, z: number): number {
  return (
    Math.sin(x * 0.02) * Math.cos(z * 0.02) * 15 +
    Math.sin(x * 0.05 + 1.3) * Math.cos(z * 0.03 + 2.1) * 8 +
    Math.sin(x * 0.01) * Math.cos(z * 0.01) * 25 +
    Math.sin(x * 0.08 + 0.5) * Math.sin(z * 0.06 + 1.7) * 4
  );
}

export default function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  // 地形ジオメトリを生成
  const geometry = useMemo(() => {
    const size = 2000;
    const segments = 200;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      // 中心付近は滑走路用に平坦にする
      const distFromCenter = Math.sqrt(x * x + z * z);
      const flatFactor = Math.min(1, distFromCenter / 100);

      const height = pseudoNoise(x, z) * flatFactor;
      positions.setY(i, Math.max(0, height));
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      {/* メイン地形 */}
      <mesh ref={meshRef} geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color="#2D5A27"
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* 滑走路 */}
      <mesh
        position={[0, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 200]} />
        <meshStandardMaterial color="#333333" roughness={0.95} />
      </mesh>

      {/* 滑走路のセンターライン */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[0, 0.15, -95 + i * 10]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.3, 4]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>
      ))}

      {/* 滑走路の端マーキング */}
      <mesh
        position={[0, 0.15, -98]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[8, 1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
      </mesh>
      <mesh
        position={[0, 0.15, 98]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[8, 1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
      </mesh>

      {/* グリッド（参照用） */}
      <gridHelper
        args={[2000, 100, "#1a3a1a", "#1a3a1a"]}
        position={[0, 0.05, 0]}
      />
    </group>
  );
}
