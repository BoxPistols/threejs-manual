/**
 * Three.js コードをプレビュー用HTMLに変換する
 */
export function buildThreePreviewHtml(code: string): string {
  // ユーザーコードの穴埋め部分(___) を空文字に置換して実行エラーを軽減
  const safeCode = code.replace(/___/g, "''");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #1a1a2e; overflow: hidden; }
  canvas { display: block; width: 100%; height: 100%; }
  #error { color: #ff6b6b; font-family: monospace; font-size: 13px; padding: 12px; white-space: pre-wrap; }
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r152/three.min.js"><\/script>
</head>
<body>
<div id="error"></div>
<script>
try {
  ${safeCode}
} catch(e) {
  document.getElementById('error').textContent = e.message;
}
<\/script>
</body>
</html>`;
}
