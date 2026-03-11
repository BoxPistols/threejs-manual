'use client';
import { useState, useEffect, useMemo } from 'react';
import { Code2, CheckCircle2, Lightbulb, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { buildThreePreviewHtml } from '@/lib/preview';
import { useThemeContext } from '@/contexts/ThemeContext';

interface CodingChallengeProps {
  title: string;
  description: string;
  initialCode: string;
  answer: string;
  hints?: string[];
  keywords?: string[];
  preview?: boolean;
}

function fuzzyCheck(code: string, answer: string, keywords?: string[]): boolean {
  const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
  const normalizedCode = normalize(code);
  const normalizedAnswer = normalize(answer);
  if (normalizedCode === normalizedAnswer) return true;
  if (keywords && keywords.length > 0) {
    return keywords.every((kw) => normalizedCode.includes(kw));
  }
  const answerLines = normalizedAnswer.split(/[;\n]/).map(normalize).filter(Boolean);
  const matchCount = answerLines.filter((line) => normalizedCode.includes(line)).length;
  return matchCount >= Math.ceil(answerLines.length * 0.5);
}

export default function CodingChallenge({ title, description, initialCode, answer, hints = [], keywords, preview }: CodingChallengeProps) {
  const [code, setCode] = useState(initialCode);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!preview) return;
    const timer = setTimeout(() => {
      setPreviewHtml(buildThreePreviewHtml(code, isDark));
    }, 400);
    return () => clearTimeout(timer);
  }, [code, preview, isDark]);

  const blobUrl = useMemo(() => {
    if (!previewHtml) return '';
    const blob = new Blob([previewHtml], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }, [previewHtml]);

  useEffect(() => {
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl); };
  }, [blobUrl]);

  const handleCheck = () => setIsCorrect(fuzzyCheck(code, answer, keywords));
  const handleNextHint = () => {
    if (hintIndex < hints.length - 1) setHintIndex((prev) => prev + 1);
    setShowHint(true);
  };
  const handleReset = () => {
    setCode(initialCode);
    setShowAnswer(false);
    setShowHint(false);
    setHintIndex(0);
    setIsCorrect(null);
  };

  return (
    <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 my-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
          <Code2 className="text-white" size={16} />
        </div>
        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
          コーディングチャレンジ
        </span>
      </div>

      <h4 className="text-lg font-semibold text-foreground mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>

      {preview ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="rounded-lg overflow-hidden border border-border bg-[#1e1e2e]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-[#313244]">
              <span className="text-xs font-mono text-[#cdd6f4]/60 uppercase">エディタ</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setIsCorrect(null);
              }}
              spellCheck={false}
              wrap="off"
              className="w-full py-4 px-5 font-mono text-sm leading-relaxed bg-transparent text-[#cdd6f4] resize-none focus:outline-none min-h-[160px] overflow-auto whitespace-pre"
              rows={Math.max(6, code.split('\n').length + 1)}
            />
          </div>
          <div className={`relative rounded-lg overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`} style={{ minHeight: '300px' }}>
            <div className={`absolute top-2 right-2 text-xs z-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>プレビュー</div>
            {blobUrl && (
              <iframe
                src={blobUrl}
                className="w-full h-full border-0"
                style={{ minHeight: '300px' }}
                sandbox="allow-scripts"
                title="Three.js プレビュー"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border border-border bg-[#1e1e2e] mb-4">
          <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-[#313244]">
            <span className="text-xs font-mono text-[#cdd6f4]/60 uppercase">エディタ</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setIsCorrect(null);
            }}
            spellCheck={false}
            wrap="off"
            className="w-full py-4 px-5 font-mono text-sm leading-relaxed bg-transparent text-[#cdd6f4] resize-none focus:outline-none min-h-[160px] overflow-auto whitespace-pre"
            rows={Math.max(6, code.split('\n').length + 1)}
          />
        </div>
      )}

      {isCorrect !== null && (
        <div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg mb-4 ${
            isCorrect
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
          }`}
        >
          {isCorrect ? (
            <>
              <CheckCircle2 size={18} />
              <span className="text-sm font-semibold">正解！素晴らしい！</span>
            </>
          ) : (
            <>
              <Code2 size={18} />
              <span className="text-sm font-semibold">もう少し！ヒントを確認してみましょう。</span>
            </>
          )}
        </div>
      )}

      {showHint && hints.length > 0 && (
        <div className="px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb size={14} className="text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
              ヒント {hintIndex + 1} / {hints.length}
            </span>
          </div>
          <p className="text-sm text-foreground/80">{hints[hintIndex]}</p>
        </div>
      )}

      {showAnswer && (
        <div className="rounded-lg overflow-hidden border border-border bg-[#1e1e2e] mb-4">
          <div className="px-4 py-2 bg-[#181825] border-b border-[#313244]">
            <span className="text-xs font-mono text-emerald-400 uppercase">模範解答</span>
          </div>
          <pre className="p-4 font-mono text-sm leading-relaxed text-[#cdd6f4] overflow-x-auto whitespace-pre">
            {answer}
          </pre>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCheck}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          チェックする
        </button>
        {hints.length > 0 && (
          <button
            onClick={handleNextHint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-sm hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
          >
            <Lightbulb size={14} />
            {showHint && hintIndex < hints.length - 1 ? '次のヒント' : 'ヒントを見る'}
          </button>
        )}
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:bg-muted transition-colors"
        >
          {showAnswer ? <EyeOff size={14} /> : <Eye size={14} />}
          {showAnswer ? '模範解答を隠す' : '模範解答を見る'}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <RotateCcw size={14} />
          リセット
        </button>
      </div>
    </div>
  );
}
