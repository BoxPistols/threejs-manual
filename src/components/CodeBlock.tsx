"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

// prism-react-renderer が認識する言語名にマッピング
function mapLanguage(lang: string): string {
  const map: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    jsx: "jsx",
    tsx: "tsx",
    html: "markup",
    css: "css",
    bash: "bash",
    shell: "bash",
    json: "json",
    glsl: "glsl",
  };
  return map[lang.toLowerCase()] || lang.toLowerCase();
}

export default function CodeBlock({
  code,
  language = "javascript",
  title,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const prismLang = mapLanguage(language);

  return (
    <div className="rounded-lg overflow-hidden border border-border bg-[#011627] text-slate-100">
      {(title || language) && (
        <div className="flex items-center justify-between px-4 py-3 bg-[#01111d] border-b border-slate-700">
          <div className="flex items-center gap-2">
            {language && (
              <span className="text-xs font-mono text-slate-300 uppercase">
                {language}
              </span>
            )}
            {title && (
              <span className="text-sm font-medium text-slate-200">
                {title}
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-slate-700 transition-colors"
            title="コードをコピー"
          >
            {copied ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} className="text-slate-300" />
            )}
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <Highlight theme={themes.nightOwl} code={code.trimEnd()} language={prismLang}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className="p-4 font-mono text-sm leading-relaxed m-0" style={{ background: "transparent" }}>
              {tokens.map((line, i) => {
                const { key: _lk, ...lineRest } = getLineProps({ line });
                return (
                  <div key={i} {...lineRest} className="flex">
                    {showLineNumbers && (
                      <span className="inline-block min-w-[2.5rem] text-right pr-4 text-slate-500 select-none">
                        {i + 1}
                      </span>
                    )}
                    <span>
                      {line.map((token, j) => {
                        const { key: _tk, ...tokenRest } = getTokenProps({ token });
                        return <span key={j} {...tokenRest} />;
                      })}
                    </span>
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
