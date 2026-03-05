import { ImageResponse } from "next/og";

export const alt = "Three.js 入門マニュアル";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #818CF8 50%, #0F172A 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "#F9FAFB",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            marginBottom: 16,
            letterSpacing: -2,
          }}
        >
          Three.js 入門
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.8,
          }}
        >
          インタラクティブ 3D プレビューで学ぶ
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.6,
            marginTop: 24,
          }}
        >
          基礎 → 応用 → 実践 → ゲーム開発
        </div>
      </div>
    ),
    { ...size }
  );
}
