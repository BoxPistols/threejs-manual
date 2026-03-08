"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getNextPage,
  getPreviousPage,
  getNextSectionFirstPage,
  getPrevSectionFirstPage,
} from "@/lib/navigation";

export function useKeyboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Cmd+K (Mac) / Ctrl+K (Win) → 検索フォーカス
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent("focus-search"));
        return;
      }

      // input / textarea にフォーカス中はナビショートカットを無視
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // Ctrl + ↑↓ でページ / セクション移動
      if (e.ctrlKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();

        if (e.shiftKey) {
          // Shift+Ctrl+↑↓ → セクション単位移動
          const target =
            e.key === "ArrowDown"
              ? getNextSectionFirstPage(pathname)
              : getPrevSectionFirstPage(pathname);
          if (target) router.push(target.path);
        } else {
          // Ctrl+↑↓ → ページ単位移動
          const target =
            e.key === "ArrowDown"
              ? getNextPage(pathname)
              : getPreviousPage(pathname);
          if (target) router.push(target.path);
        }
      }
    }

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [pathname, router]);
}
