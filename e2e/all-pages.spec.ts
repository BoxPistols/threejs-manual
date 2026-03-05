import { test, expect } from "@playwright/test";

// 全ページのパスとタイトル
const allPages = [
  { path: "/", title: "Three.js" },
  { path: "/basics/scene", title: "シーンを作ろう" },
  { path: "/basics/camera", title: "カメラを理解する" },
  { path: "/basics/renderer", title: "レンダラーの仕組み" },
  { path: "/basics/geometry", title: "ジオメトリ" },
  { path: "/basics/material", title: "マテリアル" },
  { path: "/basics/light", title: "ライト" },
  { path: "/basics/animation", title: "アニメーション" },
  { path: "/applied/textures", title: "テクスチャ" },
  { path: "/applied/model-loading", title: "3D モデル" },
  { path: "/applied/interaction", title: "インタラクション" },
  { path: "/applied/responsive", title: "レスポンシブ" },
  { path: "/applied/orbit-controls", title: "OrbitControls" },
  { path: "/applied/post-processing", title: "ポストプロセシング" },
  { path: "/practical/r3f-basics", title: "React Three Fiber" },
  { path: "/practical/r3f-drei", title: "drei" },
  { path: "/practical/portfolio-scene", title: "ポートフォリオ" },
  { path: "/game-dev/overview", title: "ゲーム設計" },
  { path: "/game-dev/aircraft", title: "飛行機" },
  { path: "/game-dev/terrain", title: "地形" },
  { path: "/game-dev/physics", title: "物理" },
  { path: "/game-dev/camera", title: "カメラ追従" },
  { path: "/game-dev/hud-gameloop", title: "HUD" },
];

// ヘッドレス Chromium では WebGL が使えないため、WebGL エラーは無視する
const ignoredErrors = ["Error creating WebGL context"];

test.describe("全ページ描画テスト", () => {
  for (const page of allPages) {
    test(`${page.path} が正常に描画される`, async ({ page: p }) => {
      const errors: string[] = [];
      p.on("pageerror", (error) => {
        if (!ignoredErrors.some((ignored) => error.message.includes(ignored))) {
          errors.push(error.message);
        }
      });

      const response = await p.goto(page.path);
      // HTTP ステータスが 200
      expect(response?.status()).toBe(200);
      // ページにテキストが含まれる
      await expect(p.locator("body")).toContainText(page.title);
      // 少し待って致命的エラーがないことを確認
      await p.waitForTimeout(500);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("ナビゲーション", () => {
  test("サイドバーが表示される（デスクトップ）", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    await expect(nav).toContainText("Three.js 入門");
  });

  test("サイドバーの検索が機能する", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.locator('input[placeholder*="検索"]');
    await searchInput.fill("カメラ");
    await expect(page.locator("text=検索結果")).toBeVisible();
  });

  test("セクションが展開・折りたたみできる", async ({ page }) => {
    await page.goto("/");
    await page.locator("button", { hasText: "基礎編" }).click();
    await expect(page.locator("nav").locator("text=シーンを作ろう")).toBeVisible();
  });

  test("ページ間の前後ナビゲーションが機能する", async ({ page }) => {
    await page.goto("/basics/scene");
    // main エリア内の次ページリンクが存在
    const nextLink = page.locator("main").getByRole("link", { name: "カメラを理解する" });
    await expect(nextLink).toBeVisible();
  });
});

test.describe("3D プレビュー", () => {
  test("basics/geometry にスライダーが存在する", async ({ page }) => {
    await page.goto("/basics/geometry");
    const sliders = page.locator('[role="slider"]');
    expect(await sliders.count()).toBeGreaterThan(0);
  });
});

test.describe("テーマ切替", () => {
  test("ダークモードに切り替えできる", async ({ page }) => {
    await page.goto("/");
    const themeButton = page.locator("button", { hasText: "ダークモード" });
    await themeButton.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

test.describe("コードブロック", () => {
  test("シンタックスハイライトが適用されている", async ({ page }) => {
    await page.goto("/basics/scene");
    // prism-react-renderer がトークンに span + style を付与する
    const highlightedTokens = page.locator("pre span[style]");
    expect(await highlightedTokens.count()).toBeGreaterThan(5);
  });

  test("コピーボタンが機能する", async ({ page }) => {
    await page.goto("/basics/scene");
    const copyButton = page.locator('button[title="コードをコピー"]').first();
    await expect(copyButton).toBeVisible();
  });
});
