import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Navigation from "@/components/Navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Three.js 入門マニュアル",
    template: "%s | Three.js 入門マニュアル",
  },
  description:
    "プログラミング初心者向け Three.js チュートリアル。3D グラフィックスの基礎から React Three Fiber、飛行シミュレーションゲーム開発まで、インタラクティブなプレビュー付きで学べます。",
  metadataBase: new URL("https://threejs-manual.vercel.app"),
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Three.js 入門マニュアル",
    description: "インタラクティブ 3D プレビューで学ぶ Three.js チュートリアル",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TooltipProvider>
            <Navigation />
            <main className="md:ml-64">{children}</main>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
