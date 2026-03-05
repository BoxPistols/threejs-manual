import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flight Simulator",
  description: "3D飛行シミュレーター",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-hidden m-0 p-0">
        {children}
      </body>
    </html>
  );
}
