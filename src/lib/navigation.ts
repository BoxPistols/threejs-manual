export interface PageInfo {
  step: number;
  path: string;
  title: string;
  sectionId: string;
}

export interface SectionInfo {
  id: string;
  title: string;
}

export const sections: SectionInfo[] = [
  { id: 'intro', title: 'はじめに' },
  { id: 'basics', title: '基礎編' },
  { id: 'applied', title: '応用編' },
  { id: 'practical', title: '実践編' },
  { id: 'game-dev', title: '開発編' },
];

export const pages: PageInfo[] = [
  { step: 1, path: '/', title: 'はじめに', sectionId: 'intro' },
  // 基礎編
  { step: 2, path: '/basics/scene', title: 'シーンを作ろう', sectionId: 'basics' },
  { step: 3, path: '/basics/camera', title: 'カメラを理解する', sectionId: 'basics' },
  { step: 4, path: '/basics/renderer', title: 'レンダラーの仕組み', sectionId: 'basics' },
  { step: 5, path: '/basics/geometry', title: 'ジオメトリ（形）', sectionId: 'basics' },
  { step: 6, path: '/basics/material', title: 'マテリアル（質感）', sectionId: 'basics' },
  { step: 7, path: '/basics/light', title: 'ライト（光）', sectionId: 'basics' },
  { step: 8, path: '/basics/animation', title: 'アニメーション', sectionId: 'basics' },
  // 応用編
  { step: 9, path: '/applied/textures', title: 'テクスチャ', sectionId: 'applied' },
  { step: 10, path: '/applied/model-loading', title: '3D モデル読み込み', sectionId: 'applied' },
  { step: 11, path: '/applied/interaction', title: 'インタラクション', sectionId: 'applied' },
  { step: 12, path: '/applied/responsive', title: 'レスポンシブ対応', sectionId: 'applied' },
  { step: 13, path: '/applied/orbit-controls', title: 'OrbitControls', sectionId: 'applied' },
  { step: 14, path: '/applied/post-processing', title: 'ポストプロセシング入門', sectionId: 'applied' },
  // 実践編
  { step: 15, path: '/practical/r3f-basics', title: 'React Three Fiber 入門', sectionId: 'practical' },
  { step: 16, path: '/practical/r3f-drei', title: 'drei ヘルパー活用', sectionId: 'practical' },
  { step: 17, path: '/practical/portfolio-scene', title: 'ポートフォリオ 3D シーン作成', sectionId: 'practical' },
  // 開発編 - 3D 飛行シミュレーション
  { step: 18, path: '/game-dev/overview', title: 'ゲーム設計の全体像', sectionId: 'game-dev' },
  { step: 19, path: '/game-dev/aircraft', title: '飛行機モデルと操作', sectionId: 'game-dev' },
  { step: 20, path: '/game-dev/terrain', title: '地形と空の環境', sectionId: 'game-dev' },
  { step: 21, path: '/game-dev/physics', title: '飛行物理シミュレーション', sectionId: 'game-dev' },
  { step: 22, path: '/game-dev/camera', title: 'カメラ追従と視点切替', sectionId: 'game-dev' },
  { step: 23, path: '/game-dev/hud-gameloop', title: 'HUD・スコア・ゲームループ', sectionId: 'game-dev' },
];

export function getPageByPath(path: string): PageInfo | undefined {
  return pages.find((p) => p.path === path);
}

export function getNextPage(currentPath: string): PageInfo | undefined {
  const current = getPageByPath(currentPath);
  if (!current) return undefined;
  return pages.find((p) => p.step === current.step + 1);
}

export function getPreviousPage(currentPath: string): PageInfo | undefined {
  const current = getPageByPath(currentPath);
  if (!current) return undefined;
  return pages.find((p) => p.step === current.step - 1);
}

export function getSectionPages(sectionId: string): PageInfo[] {
  return pages.filter((p) => p.sectionId === sectionId);
}

export function getNextSectionFirstPage(currentPath: string): PageInfo | undefined {
  const page = getPageByPath(currentPath);
  if (!page) return undefined;
  const sectionIndex = sections.findIndex((s) => s.id === page.sectionId);
  if (sectionIndex === -1 || sectionIndex >= sections.length - 1) return undefined;
  return getSectionPages(sections[sectionIndex + 1].id)[0];
}

export function getPrevSectionFirstPage(currentPath: string): PageInfo | undefined {
  const page = getPageByPath(currentPath);
  if (!page) return undefined;
  const sectionIndex = sections.findIndex((s) => s.id === page.sectionId);
  if (sectionIndex <= 0) return undefined;
  return getSectionPages(sections[sectionIndex - 1].id)[0];
}
