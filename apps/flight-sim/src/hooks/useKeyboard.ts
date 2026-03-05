"use client";

import { useEffect, useRef } from "react";

/**
 * キーボード入力を追跡するカスタムフック
 * keydown/keyupイベントでキー状態をリアルタイム管理する
 */

export interface KeyState {
  [key: string]: boolean;
}

export function useKeyboard() {
  const keys = useRef<KeyState>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ブラウザのデフォルト動作を防止（スペースでスクロールなど）
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }
      keys.current[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keys;
}
