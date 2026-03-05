"use client";

import { ArrowRight, Zap, Users, CheckCircle2, Eye, Box, Lightbulb, Layers, Palette, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const learningPath = [
    {
      number: 1,
      title: "基礎編",
      description: "シーン・カメラ・ジオメトリ・マテリアル・ライト・アニメーション",
      duration: "2時間",
      icon: <Box className="w-8 h-8 text-primary" />,
    },
    {
      number: 2,
      title: "応用編",
      description: "テクスチャ・3Dモデル・インタラクション・OrbitControls",
      duration: "1時間50分",
      icon: <Layers className="w-8 h-8 text-secondary" />,
    },
    {
      number: 3,
      title: "実践編",
      description: "React Three Fiber・drei・ポートフォリオシーン作成",
      duration: "1時間30分",
      icon: <Rocket className="w-8 h-8 text-accent" />,
    },
  ];

  const benefits = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "インタラクティブ 3D プレビュー",
      description: "コードの結果をリアルタイムで3D確認できます",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "初心者向け",
      description: "プログラミング未経験でも理解できる丁寧な説明",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "パラメータ操作",
      description: "スライダーで値を変えて3Dへの影響を直感的に理解",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "段階的な学習",
      description: "基礎から実践まで、ステップバイステップで進行",
    },
  ];

  const whyThreeJs = [
    {
      icon: <Lightbulb className="w-6 h-6 text-violet-600" />,
      title: "Web でそのまま動く 3D",
      body: "Three.js はブラウザ上で動作する 3D ライブラリです。プラグインやアプリのインストールなしで、誰でもすぐに 3D コンテンツを体験できます。",
    },
    {
      icon: <Palette className="w-6 h-6 text-orange-500" />,
      title: "表現の幅が一気に広がる",
      body: "ポートフォリオサイト、製品ビジュアライザー、データの3D可視化、インタラクティブアート。2Dでは伝えきれない情報を立体的に表現できます。",
    },
    {
      icon: <Rocket className="w-6 h-6 text-blue-500" />,
      title: "React との相性抜群",
      body: "React Three Fiber を使えば、React のコンポーネントとして 3D シーンを組み立てられます。既存の React プロジェクトにもスムーズに統合可能です。",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary font-medium text-sm">
              はじめての 3D グラフィックス
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-poppins font-bold text-foreground mb-6 leading-tight">
            Three.js
            <span className="block text-primary">入門マニュアル</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            プログラミング初心者でも、インタラクティブなプレビューで確認しながら
            Three.js を基礎から習得できます。最終的には React Three Fiber で
            ポートフォリオ用の 3D シーンを作れるようになります。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/basics/scene">
                学習を始める
                <ArrowRight size={20} />
              </Link>
            </Button>
          </div>

          <div className="inline-block bg-card border border-border rounded-lg px-6 py-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">総学習時間：</span>
              約 5 時間 20 分
            </p>
          </div>
        </div>
      </section>

      {/* なぜ Three.js を学ぶのか */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-bold text-foreground mb-4">
              なぜ Three.js を学ぶのか
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Web の表現力を一段上に引き上げる 3D グラフィックス。
              その入り口として最も人気のあるライブラリが Three.js です。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyThreeJs.map((card) => (
              <div
                key={card.title}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{card.icon}</div>
                <h3 className="font-semibold text-foreground mb-3 text-base">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 学習フロー */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-poppins font-bold text-center text-foreground mb-12">
            学習フロー
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPath.map((step) => (
              <div key={step.number} className="relative group">
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-poppins font-bold text-lg">
                        {step.number}
                      </span>
                    </div>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {step.description}
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-xs font-medium">
                    {step.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 特徴 */}
      <section className="py-16 px-4 md:px-8 bg-card">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-poppins font-bold text-center text-foreground mb-12">
            このガイドの特徴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto bg-primary/5 border border-primary/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-poppins font-bold text-foreground mb-4">
            準備はいいですか？
          </h2>
          <p className="text-muted-foreground mb-8">
            まずは 3D シーンの基本から始めましょう。
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/basics/scene">
              今すぐ始める
              <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
