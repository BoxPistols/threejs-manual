'use client';

import { useEffect, useState } from 'react';
import { X, Keyboard, Code2, Eye, CheckCircle2, Lightbulb, RotateCcw, EyeOff } from 'lucide-react';

const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');
const mod = isMac ? '⌘' : 'Ctrl';

const shortcuts = [
  { keys: '←/→', desc: '前後のページに移動' },
  { keys: 'Shift+←/→', desc: '前後のセクションに移動' },
  { keys: `${mod}+K`, desc: '検索にフォーカス' },
  { keys: `${mod}+Shift+D`, desc: 'ダーク/ライトモード切替' },
  { keys: `${mod}+,`, desc: '設定を開く' },
  { keys: '?', desc: 'このヘルプを表示' },
  { keys: 'Home', desc: 'ページトップにスクロール' },
];

export default function HelpModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }
    // ヘルプモーダルのopen/closeイベント
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    document.addEventListener('keydown', handler);
    document.addEventListener('open-help', handleOpen);
    document.addEventListener('close-help', handleClose);
    return () => {
      document.removeEventListener('keydown', handler);
      document.removeEventListener('open-help', handleOpen);
      document.removeEventListener('close-help', handleClose);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card/95 backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Keyboard size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground">ヘルプ</h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* キーボードショートカット */}
          <section>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">キーボードショートカット</h3>
            <div className="space-y-1.5">
              {shortcuts.map((s) => (
                <div key={s.keys} className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-muted/50">
                  <span className="text-sm text-muted-foreground">{s.desc}</span>
                  <kbd className="px-2 py-1 rounded bg-muted border border-border text-xs font-mono text-foreground shrink-0 ml-4">
                    {s.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </section>

          {/* コーディングチャレンジ */}
          <section>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">コーディングチャレンジ</h3>
            <p className="text-sm text-muted-foreground mb-3">
              各ページ下部の緑色エリアがチャレンジです。お題に沿ってコードを書き、Three.js プレビューで結果を確認できます。
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span className="text-muted-foreground">チェックで採点</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                <Lightbulb size={14} className="text-amber-500 shrink-0" />
                <span className="text-muted-foreground">段階的にヒント表示</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <Eye size={14} className="text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">模範解答を表示/非表示</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <RotateCcw size={14} className="text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">初期状態にリセット</span>
              </div>
            </div>
          </section>

          {/* コードプレビュー */}
          <section>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">コードプレビュー</h3>
            <p className="text-sm text-muted-foreground mb-3">
              コーディングチャレンジではリアルタイムで Three.js の 3D プレビューが表示されます。コードを編集するとプレビューが自動更新されます。
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <Code2 size={14} className="text-blue-500 shrink-0" />
                <span className="text-muted-foreground">エディタでコード編集</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <Eye size={14} className="text-blue-500 shrink-0" />
                <span className="text-muted-foreground">3D プレビュー自動更新</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <EyeOff size={14} className="text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">模範解答の表示切替</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <RotateCcw size={14} className="text-amber-500 shrink-0" />
                <span className="text-muted-foreground">コードをリセット</span>
              </div>
            </div>
          </section>
        </div>

        {/* フッター */}
        <div className="px-6 py-3 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">?</kbd> でこのヘルプを表示 / <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">Esc</kbd> で閉じる
          </p>
        </div>
      </div>
    </div>
  );
}
