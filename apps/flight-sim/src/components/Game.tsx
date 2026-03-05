"use client";

import { useRef, useCallback, useState } from "react";
import * as THREE from "three";
import Aircraft, { type AircraftState } from "./Aircraft";
import Terrain from "./Terrain";
import Environment from "./Environment";
import Rings from "./Rings";
import FollowCamera from "./FollowCamera";
import type { KeyState } from "@/hooks/useKeyboard";

/**
 * メインゲームコンポーネント
 * Canvas内の全3D要素を管理する
 */

interface GameProps {
  keys: React.RefObject<KeyState>;
  onScoreChange: (score: number) => void;
  stateRef: React.RefObject<AircraftState>;
}

export default function Game({ keys, onScoreChange, stateRef }: GameProps) {
  return (
    <>
      {/* 環境（空・雲・ライティング・霧） */}
      <Environment />

      {/* 地形 */}
      <Terrain />

      {/* 飛行機 */}
      <Aircraft keys={keys} stateRef={stateRef} />

      {/* チェックポイントリング */}
      <Rings stateRef={stateRef} onScoreChange={onScoreChange} />

      {/* 追従カメラ */}
      <FollowCamera stateRef={stateRef} />
    </>
  );
}
