import { test, expect } from "@playwright/test";

const ignoredErrors = ["Error creating WebGL context", "THREE.WebGLRenderer"];

const pagesWithEditor = [
  "/basics/scene",
  "/basics/camera",
  "/basics/renderer",
  "/basics/geometry",
  "/basics/material",
  "/basics/light",
  "/basics/animation",
  "/applied/textures",
  "/applied/model-loading",
  "/applied/interaction",
  "/applied/responsive",
  "/applied/orbit-controls",
  "/applied/post-processing",
  "/practical/r3f-basics",
  "/practical/r3f-drei",
  "/practical/portfolio-scene",
  "/game-dev/overview",
  "/game-dev/aircraft",
  "/game-dev/terrain",
  "/game-dev/physics",
  "/game-dev/camera",
  "/game-dev/hud-gameloop",
];

test.describe("CodingChallenge エディター", () => {
  for (const path of pagesWithEditor) {
    test(`${path} にエディターが存在する`, async ({ page }) => {
      page.on("pageerror", (error) => {
        if (!ignoredErrors.some((i) => error.message.includes(i))) {
          throw error;
        }
      });
      await page.goto(path);
      // CodingChallenge のテキストエリアが存在する
      const textarea = page.locator("textarea").first();
      await expect(textarea).toBeVisible({ timeout: 10000 });
    });
  }

  test("エディターに入力でき、プレビューiframeが表示される", async ({ page }) => {
    page.on("pageerror", (error) => {
      if (!ignoredErrors.some((i) => error.message.includes(i))) {
        throw error;
      }
    });
    await page.goto("/basics/scene");
    const textarea = page.locator("textarea").first();
    await expect(textarea).toBeVisible({ timeout: 10000 });

    // テキストエリアに入力可能
    await textarea.click();
    const initialValue = await textarea.inputValue();
    expect(initialValue.length).toBeGreaterThan(0);

    // プレビュー iframe が存在する
    const iframe = page.locator('iframe[title*="プレビュー"]');
    await expect(iframe).toBeVisible({ timeout: 5000 });
  });

  test("チェックボタンが機能する", async ({ page }) => {
    page.on("pageerror", (error) => {
      if (!ignoredErrors.some((i) => error.message.includes(i))) {
        throw error;
      }
    });
    await page.goto("/basics/scene");
    const checkButton = page.locator("button", { hasText: "チェック" });
    await expect(checkButton).toBeVisible({ timeout: 10000 });
    await checkButton.click();
    // 正解/不正解のフィードバックが表示される
    await page.waitForTimeout(500);
    const feedback = page.locator("text=正解").or(page.locator("text=もう少し"));
    await expect(feedback).toBeVisible({ timeout: 3000 });
  });

  test("ヒントボタンが機能する", async ({ page }) => {
    page.on("pageerror", (error) => {
      if (!ignoredErrors.some((i) => error.message.includes(i))) {
        throw error;
      }
    });
    await page.goto("/basics/scene");
    const hintButton = page.locator("button", { hasText: "ヒント" });
    if (await hintButton.isVisible()) {
      await hintButton.click();
      await page.waitForTimeout(300);
      // ヒントテキストが表示される
      const hintArea = page.locator("[class*='bg-']", { hasText: "ヒント" });
      expect(await hintArea.count()).toBeGreaterThan(0);
    }
  });

  test("模範解答ボタンが機能する", async ({ page }) => {
    page.on("pageerror", (error) => {
      if (!ignoredErrors.some((i) => error.message.includes(i))) {
        throw error;
      }
    });
    await page.goto("/basics/scene");
    const answerButton = page.locator("button", { hasText: "模範解答" });
    await expect(answerButton).toBeVisible({ timeout: 10000 });
    await answerButton.click();
    await page.waitForTimeout(300);
    // 模範解答のコードブロックが表示される
    const answerCode = page.locator("pre").last();
    await expect(answerCode).toBeVisible();
  });
});

test.describe("検索 + アンカースクロール", () => {
  test("キーワード検索で結果が表示される", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.locator('input[placeholder*="検索"]');
    await searchInput.fill("カメラ");
    await expect(page.locator("text=検索結果")).toBeVisible();
  });

  test("検索結果にキーワードサブアイテムが表示される", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.locator('input[placeholder*="検索"]');
    await searchInput.fill("シーン");
    await page.waitForTimeout(300);
    // # 付きのサブアイテムが存在
    const subItems = page.locator("nav a[href*='#']");
    expect(await subItems.count()).toBeGreaterThan(0);
  });

  test("キーワードリンクがアンカー付きURLを持つ", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.locator('input[placeholder*="検索"]');
    await searchInput.fill("アニメーション");
    await page.waitForTimeout(300);
    const anchorLink = page.locator("nav a[href*='#']").first();
    if (await anchorLink.isVisible()) {
      const href = await anchorLink.getAttribute("href");
      expect(href).toContain("#");
    }
  });
});
