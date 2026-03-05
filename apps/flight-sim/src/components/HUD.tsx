"use client";

import { useEffect, useRef, useState } from "react";
import type { AircraftState } from "./Aircraft";

/**
 * ヘッドアップディスプレイ（HUD）
 * シンプルな飛行情報を表示するオーバーレイ
 */

interface HUDProps {
  stateRef: React.RefObject<AircraftState>;
  score: number;
}

export default function HUD({ stateRef, score }: HUDProps) {
  const [display, setDisplay] = useState({
    speed: 0,
    altitude: 0,
    boosting: false,
  });

  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      if (stateRef.current) {
        setDisplay({
          speed: Math.round(stateRef.current.speed),
          altitude: Math.round(stateRef.current.altitude),
          boosting: stateRef.current.boosting,
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
            速度
          </div>
          <div className="text-2xl font-bold font-mono text-green-400">
            {display.speed}{" "}
            <span className="text-sm text-gray-400">m/s</span>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            高度
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
            スコア
          </div>
          <div className="text-3xl font-bold font-mono text-yellow-400">
            {score}
          </div>
        </div>
      </div>

      {/* ブースト表示 */}
      {display.boosting && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12">
          <div className="text-orange-400 font-bold text-lg animate-pulse">
            BOOST!
          </div>
        </div>
      )}

      {/* 中央: クロスヘア */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 border border-white/30 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-white/50 rounded-full" />
        </div>
      </div>

      {/* 中央下: 操作説明 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/5 text-xs text-gray-500 flex gap-4">
          <span>↑↓: 上昇/下降</span>
          <span>←→: 旋回</span>
          <span>Space: ブースト</span>
        </div>
      </div>
    </div>
  );
}
