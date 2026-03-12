import { describe, it, expect } from "vitest";
import { fuzzyCheck } from "@/components/CodingChallenge";

describe("fuzzyCheck", () => {
  const answer = `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);`;

  describe("完全一致", () => {
    it("同一コードで正解になる", () => {
      expect(fuzzyCheck(answer, answer)).toBe(true);
    });

    it("空白の違いを無視する", () => {
      const code = answer.replace(/\n/g, "  \n  ");
      expect(fuzzyCheck(code, answer)).toBe(true);
    });
  });

  describe("キーワードマッチ", () => {
    it("すべてのキーワードを含めば正解", () => {
      const code = "new THREE.Scene(); new THREE.PerspectiveCamera();";
      const keywords = ["THREE.Scene", "THREE.PerspectiveCamera"];
      expect(fuzzyCheck(code, answer, keywords)).toBe(true);
    });

    it("キーワードが1つでも欠けると不正解", () => {
      const code = "new THREE.Scene();";
      const keywords = ["THREE.Scene", "THREE.PerspectiveCamera"];
      expect(fuzzyCheck(code, answer, keywords)).toBe(false);
    });

    it("空のキーワード配列はキーワードマッチをスキップする", () => {
      // keywords が空配列の場合、行マッチにフォールバック
      const code = "completely different code";
      expect(fuzzyCheck(code, answer, [])).toBe(false);
    });
  });

  describe("行マッチ（50%以上）", () => {
    it("半分以上の行が一致すれば正解", () => {
      // answer は2行（セミコロン区切り） → 1行以上一致で正解
      const code = "const scene = new THREE.Scene();";
      expect(fuzzyCheck(code, answer)).toBe(true);
    });

    it("まったく一致しない行だと不正解", () => {
      const code = "console.log('hello');";
      expect(fuzzyCheck(code, answer)).toBe(false);
    });
  });

  describe("実際のチャレンジコード", () => {
    const sceneAnswer = `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x4F46E5 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 3;
renderer.render(scene, camera);`;

    it("模範解答そのままで正解になる", () => {
      expect(fuzzyCheck(sceneAnswer, sceneAnswer)).toBe(true);
    });

    it("コメント付きの模範解答でも正解になる", () => {
      const codeWithComments = `// 1. シーンを作成
const scene = new THREE.Scene();
// 2. カメラを作成
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 3. レンダラーを作成
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// 4. 立方体を作成
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x4F46E5 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
// 5. カメラ位置
camera.position.z = 3;
// 6. レンダリング
renderer.render(scene, camera);`;
      expect(fuzzyCheck(codeWithComments, sceneAnswer)).toBe(true);
    });

    it("色だけ違っても半数以上一致で正解になる", () => {
      const modified = sceneAnswer.replace("0x4F46E5", "0xff0000");
      expect(fuzzyCheck(modified, sceneAnswer)).toBe(true);
    });
  });
});
