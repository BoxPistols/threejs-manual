import { describe, it, expect } from "vitest";
import { buildThreePreviewHtml } from "@/lib/preview";

describe("buildThreePreviewHtml", () => {
  const sampleCode = 'const scene = new THREE.Scene();';

  it("有効なHTML文書を生成する", () => {
    const html = buildThreePreviewHtml(sampleCode);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html>");
    expect(html).toContain("</html>");
  });

  it("Three.js CDNを動的スクリプトで読み込む", () => {
    const html = buildThreePreviewHtml(sampleCode);
    expect(html).toContain("cdn.jsdelivr.net/npm/three@");
    expect(html).toContain("document.createElement('script')");
    expect(html).toContain("s.onload");
  });

  it("ユーザーコードをonloadコールバック内で実行する", () => {
    const html = buildThreePreviewHtml(sampleCode);
    // onload 内に try-catch でユーザーコードが入る
    expect(html).toContain("s.onload = function()");
    expect(html).toContain(sampleCode);
    // ユーザーコードが onload の外にないことを確認
    const onloadIndex = html.indexOf("s.onload");
    const codeIndex = html.indexOf(sampleCode);
    expect(codeIndex).toBeGreaterThan(onloadIndex);
  });

  it("CDN読み込み失敗時のエラーハンドリングがある", () => {
    const html = buildThreePreviewHtml(sampleCode);
    expect(html).toContain("s.onerror");
    expect(html).toContain("Three.js の読み込みに失敗しました");
  });

  it("ユーザーコードのランタイムエラーをキャッチする", () => {
    const html = buildThreePreviewHtml(sampleCode);
    expect(html).toContain("try {");
    expect(html).toContain("} catch(e) {");
    expect(html).toContain("document.getElementById('error').textContent = e.message");
  });

  it("エラー表示用のDOM要素がある", () => {
    const html = buildThreePreviewHtml(sampleCode);
    expect(html).toContain('<div id="error"></div>');
  });

  it("ダークモードで暗い背景色を使用する", () => {
    const html = buildThreePreviewHtml(sampleCode, true);
    expect(html).toContain("background: #1a1a2e");
  });

  it("ライトモードで明るい背景色を使用する", () => {
    const html = buildThreePreviewHtml(sampleCode, false);
    expect(html).toContain("background: #e8e8f0");
  });

  it("デフォルトはダークモード", () => {
    const html = buildThreePreviewHtml(sampleCode);
    expect(html).toContain("background: #1a1a2e");
  });

  it("穴埋め部分(___) を空文字列に置換する", () => {
    const codeWithBlanks = "const x = ___;";
    const html = buildThreePreviewHtml(codeWithBlanks);
    expect(html).not.toContain("___");
    expect(html).toContain("const x = '';");
  });

  it("複数の穴埋めをすべて置換する", () => {
    const code = "const a = ___;\nconst b = ___;";
    const html = buildThreePreviewHtml(code);
    const matches = html.match(/___/g);
    expect(matches).toBeNull();
  });

  it("静的な <script src> タグを使わない（動的読み込みのみ）", () => {
    const html = buildThreePreviewHtml(sampleCode);
    // <script src="...three..."> のような静的タグがないことを確認
    expect(html).not.toMatch(/<script\s+src=["']https?:\/\/[^"']*three/);
  });
});
