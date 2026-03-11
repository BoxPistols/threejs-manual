"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Settings, HelpCircle } from "lucide-react";
import {
  getNextPage,
  getPreviousPage,
  getPageByPath,
  getNextSectionFirstPage,
  getPrevSectionFirstPage,
  pages,
} from "@/lib/navigation";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function KeyboardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isMac, setIsMac] = useState(true);
  const { toggleTheme } = useThemeContext();

  useEffect(() => {
    setIsMac(navigator.userAgent.includes("Mac"));
  }, []);

  const currentPage = getPageByPath(pathname);
  const prevPage = getPreviousPage(pathname);
  const nextPage = getNextPage(pathname);

  const navigate = useCallback(
    (path: string, label: string) => {
      router.push(path);
      setShowToast(label);
      window.scrollTo({ top: 0, behavior: "instant" });
      setTimeout(() => setShowToast(null), 1200);
    },
    [router],
  );

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // Cmd/Ctrl+K で検索フォーカス
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent("focus-search"));
        return;
      }

      // Cmd/Ctrl+Shift+D でダークモード切替
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // → 次のページ
      if (e.key === "ArrowRight" && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        const next = getNextPage(pathname);
        if (next) {
          e.preventDefault();
          navigate(next.path, `→ ${next.title}`);
        }
        return;
      }
      // ← 前のページ
      if (e.key === "ArrowLeft" && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        const prev = getPreviousPage(pathname);
        if (prev) {
          e.preventDefault();
          navigate(prev.path, `← ${prev.title}`);
        }
        return;
      }

      // Shift+→ 次のセクション
      if (e.shiftKey && e.key === "ArrowRight") {
        const next = getNextSectionFirstPage(pathname);
        if (next) {
          e.preventDefault();
          navigate(next.path, `⇒ ${next.title}`);
        }
        return;
      }
      // Shift+← 前のセクション
      if (e.shiftKey && e.key === "ArrowLeft") {
        const prev = getPrevSectionFirstPage(pathname);
        if (prev) {
          e.preventDefault();
          navigate(prev.path, `⇐ ${prev.title}`);
        }
        return;
      }

      // Home / Cmd+↑ でスクロールトップ
      if (e.key === "Home" || (e.key === "ArrowUp" && e.metaKey)) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [pathname, navigate, toggleTheme]);

  const mod = isMac ? "⌘" : "Ctrl";

  return (
    <>
      {/* トースト通知 */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {showToast}
        </div>
      )}

      {/* ショートカットバー（MD以上で表示） */}
      <div className="fixed bottom-0 left-0 right-0 z-30 hidden md:flex items-center justify-center gap-1 py-2 px-4 bg-card/80 backdrop-blur-sm border-t border-border md:ml-64">
        <button
          onClick={() =>
            prevPage && navigate(prevPage.path, `← ${prevPage.title}`)
          }
          disabled={!prevPage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="前のステップ (←)"
        >
          <ChevronLeft size={14} />
          <span className="hidden lg:inline max-w-[120px] truncate">
            {prevPage?.title ?? "---"}
          </span>
          <kbd className="ml-1 px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">
            ←
          </kbd>
        </button>

        {currentPage && (
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs">
            <span className="text-primary font-bold">
              {currentPage.step}/{pages.length}
            </span>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{
                  width: `${(currentPage.step / pages.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <button
          onClick={() =>
            nextPage && navigate(nextPage.path, `→ ${nextPage.title}`)
          }
          disabled={!nextPage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="次のステップ (→)"
        >
          <span className="hidden lg:inline max-w-[120px] truncate">
            {nextPage?.title ?? "---"}
          </span>
          <kbd className="mr-1 px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">
            →
          </kbd>
          <ChevronRight size={14} />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
          <span className="flex items-center gap-0.5">
            <kbd className="px-1 py-0.5 rounded bg-muted/60 border border-border/50 font-mono">
              Shift
            </kbd>
            <kbd className="px-1 py-0.5 rounded bg-muted/60 border border-border/50 font-mono">
              ←→
            </kbd>
            <span className="ml-0.5">セクション</span>
          </span>
          <span className="flex items-center gap-0.5">
            <kbd className="px-1 py-0.5 rounded bg-muted/60 border border-border/50 font-mono">
              {mod}+K
            </kbd>
            <span className="ml-0.5">検索</span>
          </span>
        </div>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          onClick={() => document.dispatchEvent(new CustomEvent("open-settings"))}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="設定 (⌘/Ctrl+,)"
        >
          <Settings size={14} />
          <span className="hidden lg:inline">設定</span>
        </button>

        <button
          onClick={() => document.dispatchEvent(new CustomEvent("open-help"))}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="ヘルプ (?)"
        >
          <HelpCircle size={14} />
          <span className="hidden lg:inline">ヘルプ</span>
        </button>
      </div>
    </>
  );
}
