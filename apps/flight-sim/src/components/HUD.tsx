"use client";

import type { AircraftState } from "./Aircraft";

/**
 * ヘッドアップディスプレイ（HUD）
 * 飛行状態をDOM要素で表示するオーバーレイ
 */

interface HUDProps {
  stateRef: React.RefObject<AircraftState>;
  score: number;
}

// HUD表示のラッパーコンポーネント
// useFrameが使えないのでrequestAnimationFrameで更新
import { useEffect, useRef, useState } from "react";

export default function HUD({ stateRef, score }: HUDProps) {
  const [display, setDisplay] = useState({
    speed: 0,
    altitude: 0,
    thrust: 0,
    pitch: 0,
    roll: 0,
  });

  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      if (stateRef.current) {
        setDisplay({
          speed: Math.round(stateRef.current.speed),
          altitude: Math.round(stateRef.current.altitude),
          thrust: Math.round(stateRef.current.thrust),
          pitch: Math.round((stateRef.current.pitch * 180) / Math.PI),
          roll: Math.round((stateRef.current.roll * 180) / Math.PI),
        });
      }
      animFrameRef.current = requestAnimationFrame(update);
    };
    animFrameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [stateRef]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10">
      {/* 左上: 速度と高度 */}
      <div className="absolute top-6 left-6 flex flex-col gap-2">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            速度 (Speed)
          </div>
          <div className="text-2xl font-bold font-mono text-green-400">
            {display.speed}{" "}
            <span className="text-sm text-gray-400">m/s</span>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            高度 (Altitude)
          </div>
          <div className="text-2xl font-bold font-mono text-blue-400">
            {display.altitude}{" "}
            <span className="text-sm text-gray-400">m</span>
          </div>
        </div>
      </div>

      {/* 右上: スコア */}
      <div className="absolute top-6 right-6">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-5 py-3 border border-yellow-500/30">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            スコア (Score)
          </div>
          <div className="text-3xl font-bold font-mono text-yellow-400">
            {score}
          </div>
        </div>
      </div>

      {/* 左下: 推力 */}
      <div className="absolute bottom-6 left-6">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            推力 (Thrust)
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${display.thrust}%`,
                  backgroundColor:
                    display.thrust > 80
                      ? "#EF4444"
                      : display.thrust > 50
                      ? "#F59E0B"
                      : "#22C55E",
                }}
              />
            </div>
            <span className="text-lg font-mono font-bold text-white">
              {display.thrust}%
            </span>
          </div>
        </div>
      </div>

      {/* 右下: ピッチ/ロール */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            ピッチ (Pitch)
          </div>
          <div className="text-lg font-bold font-mono text-cyan-400">
            {display.pitch > 0 ? "+" : ""}
            {display.pitch}°
          </div>
        </div>
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            ロール (Roll)
          </div>
          <div className="text-lg font-bold font-mono text-purple-400">
            {display.roll > 0 ? "+" : ""}
            {display.roll}°
          </div>
        </div>
      </div>

      {/* 中央下: 操作説明 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/5 text-xs text-gray-500 flex gap-4">
          <span>W/S: ピッチ</span>
          <span>A/D: ロール</span>
          <span>Space: 加速</span>
          <span>Shift: 減速</span>
        </div>
      </div>

      {/* 中央: クロスヘア */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 border border-white/30 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-white/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}
