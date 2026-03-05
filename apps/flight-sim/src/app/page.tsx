"use client";

import { useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Game from "@/components/Game";
import HUD from "@/components/HUD";
import { useKeyboard } from "@/hooks/useKeyboard";
import type { AircraftState } from "@/components/Aircraft";

/**
 * メインページ
 * フルスクリーンの3D飛行シミュレーター
 */

export default function FlightSimPage() {
  const keys = useKeyboard();
  const [score, setScore] = useState(0);

  // 飛行機の状態を共有するref
  const stateRef = useRef<AircraftState>({
    position: new THREE.Vector3(0, 50, 0),
    rotation: new THREE.Euler(0, 0, 0),
    speed: 40,
    altitude: 50,
    thrust: 30,
    pitch: 0,
    roll: 0,
  });

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  return (
    <div className="w-screen h-screen relative bg-black">
      {/* 3Dキャンバス */}
      <Canvas
        className="w-full h-full"
        camera={{
          fov: 60,
          near: 0.5,
          far: 2000,
          position: [0, 55, 18],
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        <Game
          keys={keys}
          onScoreChange={handleScoreChange}
          stateRef={stateRef}
        />
      </Canvas>

      {/* HUDオーバーレイ */}
      <HUD stateRef={stateRef} score={score} />
    </div>
  );
}
