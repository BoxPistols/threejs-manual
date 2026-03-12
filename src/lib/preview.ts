/**
 * Three.js コードをプレビュー用HTMLに変換する
 */
export function buildThreePreviewHtml(code: string, isDark: boolean = true): string {
  // ユーザーコードの穴埋め部分(___) を空文字に置換して実行エラーを軽減
  const safeCode = code.replace(/___/g, "''");
  const bgColor = isDark ? '#1a1a2e' : '#e8e8f0';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: ${bgColor}; overflow: hidden; }
  canvas { display: block; width: 100%; height: 100%; }
  #error { color: #ff6b6b; font-family: monospace; font-size: 13px; padding: 12px; white-space: pre-wrap; }
</style>
</head>
<body>
<div id="error"></div>
<script>
(function() {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.min.js';
  s.onload = function() {
    try {
      ${safeCode}
    } catch(e) {
      document.getElementById('error').textContent = e.message;
    }
  };
  s.onerror = function() {
    document.getElementById('error').textContent = 'Three.js の読み込みに失敗しました';
  };
  document.head.appendChild(s);
})();
<\/script>
</body>
</html>`;
}
