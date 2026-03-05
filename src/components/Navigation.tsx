"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Search, Sun, Moon, Box } from "lucide-react";
import { pages, getPageByPath } from "@/lib/navigation";
import { useTheme } from "next-themes";

const navSections = [
  {
    id: "intro",
    title: "はじめに",
    href: "/",
  },
  {
    id: "basics",
    title: "基礎編",
    subsections: [
      { title: "シーンを作ろう", href: "/basics/scene" },
      { title: "カメラを理解する", href: "/basics/camera" },
      { title: "レンダラーの仕組み", href: "/basics/renderer" },
      { title: "ジオメトリ（形）", href: "/basics/geometry" },
      { title: "マテリアル（質感）", href: "/basics/material" },
      { title: "ライト（光）", href: "/basics/light" },
      { title: "アニメーション", href: "/basics/animation" },
    ],
  },
  {
    id: "applied",
    title: "応用編",
    subsections: [
      { title: "テクスチャ", href: "/applied/textures" },
      { title: "3D モデル読み込み", href: "/applied/model-loading" },
      { title: "インタラクション", href: "/applied/interaction" },
      { title: "レスポンシブ対応", href: "/applied/responsive" },
      { title: "OrbitControls", href: "/applied/orbit-controls" },
      { title: "ポストプロセシング入門", href: "/applied/post-processing" },
    ],
  },
  {
    id: "practical",
    title: "実践編",
    subsections: [
      { title: "React Three Fiber 入門", href: "/practical/r3f-basics" },
      { title: "drei ヘルパー活用", href: "/practical/r3f-drei" },
      { title: "ポートフォリオ 3D シーン作成", href: "/practical/portfolio-scene" },
    ],
  },
  {
    id: "game-dev",
    title: "開発編",
    subsections: [
      { title: "ゲーム設計の全体像", href: "/game-dev/overview" },
      { title: "飛行機モデルと操作", href: "/game-dev/aircraft" },
      { title: "地形と空の環境", href: "/game-dev/terrain" },
      { title: "飛行物理シミュレーション", href: "/game-dev/physics" },
      { title: "カメラ追従と視点切替", href: "/game-dev/camera" },
      { title: "HUD・スコア・ゲームループ", href: "/game-dev/hud-gameloop" },
    ],
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const currentPage = useMemo(() => getPageByPath(pathname), [pathname]);

  // 現在ページのセクションを自動展開
  useEffect(() => {
    if (currentPage) {
      setExpandedSection(currentPage.sectionId);
    }
  }, [currentPage]);

  // Cmd+K / Ctrl+K でフォーカス
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        requestAnimationFrame(() => searchInputRef.current?.focus());
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchResults = searchQuery.trim()
    ? pages.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const hasSearch = searchQuery.trim().length > 0;
  const isMac = typeof navigator !== "undefined" && navigator.platform.includes("Mac");

  return (
    <>
      {/* モバイルメニューボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border hover:bg-muted"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* サイドバー */}
      <nav
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Box className="text-primary-foreground" size={20} />
            </div>
            <span className="font-poppins font-bold text-lg text-foreground">
              Three.js 入門
            </span>
          </Link>

          {/* 検索 */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={`検索... (${isMac ? "Cmd" : "Ctrl"}+K)`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* ダークモード切替 */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-2 px-4 py-2 mb-4 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === "dark" ? "ライトモード" : "ダークモード"}</span>
          </button>

          {/* 検索結果 */}
          {hasSearch ? (
            <div className="space-y-1">
              <p className="px-4 py-1 text-xs font-semibold text-muted-foreground">
                検索結果 ({searchResults.length}件)
              </p>
              {searchResults.length === 0 ? (
                <p className="px-4 py-2 text-sm text-muted-foreground">
                  該当するページがありません
                </p>
              ) : (
                searchResults.map((page) => (
                  <Link
                    key={page.path}
                    href={page.path}
                    onClick={() => {
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
                  >
                    <span className="text-xs text-primary font-semibold mr-1.5">
                      STEP {page.step}
                    </span>
                    {page.title}
                  </Link>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {navSections.map((section) => (
                <div key={section.id}>
                  {section.href ? (
                    <Link
                      href={section.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2 rounded-lg transition-colors ${
                        pathname === section.href
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      {section.title}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setExpandedSection(
                            expandedSection === section.id ? null : section.id
                          )
                        }
                        className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <span>{section.title}</span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${
                            expandedSection === section.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expandedSection === section.id && section.subsections && (
                        <div className="ml-2 mt-1 space-y-1 border-l-2 border-sidebar-border">
                          {section.subsections.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setIsOpen(false)}
                              className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                                pathname === sub.href
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                              }`}
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* モバイルオーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
