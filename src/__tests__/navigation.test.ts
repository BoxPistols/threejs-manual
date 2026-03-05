import { describe, it, expect } from "vitest";
import {
  pages,
  sections,
  getPageByPath,
  getNextPage,
  getPreviousPage,
  getSectionPages,
  getNextSectionFirstPage,
  getPrevSectionFirstPage,
} from "@/lib/navigation";

describe("navigation", () => {
  it("全ページにユニークな step 番号がある", () => {
    const steps = pages.map((p) => p.step);
    const unique = new Set(steps);
    expect(unique.size).toBe(pages.length);
  });

  it("全ページにユニークな path がある", () => {
    const paths = pages.map((p) => p.path);
    const unique = new Set(paths);
    expect(unique.size).toBe(pages.length);
  });

  it("全ページの sectionId が sections に存在する", () => {
    const sectionIds = sections.map((s) => s.id);
    for (const page of pages) {
      expect(sectionIds).toContain(page.sectionId);
    }
  });

  it("step 番号が 1 から連続している", () => {
    for (let i = 0; i < pages.length; i++) {
      expect(pages[i].step).toBe(i + 1);
    }
  });

  it("getPageByPath で正しいページを取得できる", () => {
    const home = getPageByPath("/");
    expect(home).toBeDefined();
    expect(home?.title).toBe("はじめに");

    const scene = getPageByPath("/basics/scene");
    expect(scene).toBeDefined();
    expect(scene?.title).toBe("シーンを作ろう");
  });

  it("存在しないパスは undefined を返す", () => {
    expect(getPageByPath("/nonexistent")).toBeUndefined();
  });

  it("getNextPage で次のページを取得できる", () => {
    const next = getNextPage("/");
    expect(next?.path).toBe("/basics/scene");

    const next2 = getNextPage("/basics/scene");
    expect(next2?.path).toBe("/basics/camera");
  });

  it("最後のページの次は undefined", () => {
    const lastPage = pages[pages.length - 1];
    expect(getNextPage(lastPage.path)).toBeUndefined();
  });

  it("getPreviousPage で前のページを取得できる", () => {
    const prev = getPreviousPage("/basics/scene");
    expect(prev?.path).toBe("/");
  });

  it("最初のページの前は undefined", () => {
    expect(getPreviousPage("/")).toBeUndefined();
  });

  it("getSectionPages でセクション内のページを取得できる", () => {
    const basicsPages = getSectionPages("basics");
    expect(basicsPages.length).toBe(7);
    expect(basicsPages[0].title).toBe("シーンを作ろう");
  });

  it("getNextSectionFirstPage で次セクションの先頭ページを取得できる", () => {
    const nextSection = getNextSectionFirstPage("/basics/scene");
    expect(nextSection?.sectionId).toBe("applied");
  });

  it("getPrevSectionFirstPage で前セクションの先頭ページを取得できる", () => {
    const prevSection = getPrevSectionFirstPage("/applied/textures");
    expect(prevSection?.sectionId).toBe("basics");
  });

  it("開発編が 6 ページ存在する", () => {
    const gameDevPages = getSectionPages("game-dev");
    expect(gameDevPages.length).toBe(6);
  });

  it("全セクションにページが存在する", () => {
    for (const section of sections) {
      const sectionPages = getSectionPages(section.id);
      expect(sectionPages.length).toBeGreaterThan(0);
    }
  });
});
