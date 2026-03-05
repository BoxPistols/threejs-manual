"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPageByPath, getNextPage, getPreviousPage, pages } from "@/lib/navigation";
import { ReactNode, useMemo } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname();

  const currentPage = useMemo(() => getPageByPath(pathname), [pathname]);
  const prevPage = useMemo(() => getPreviousPage(pathname), [pathname]);
  const nextPage = useMemo(() => getNextPage(pathname), [pathname]);

  const totalSteps = pages.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* ステップ表示 */}
        {currentPage && currentPage.step > 1 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                STEP {currentPage.step - 1} / {totalSteps - 1}
              </span>
            </div>
            {/* プログレスバー */}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{
                  width: `${((currentPage.step - 1) / (totalSteps - 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* コンテンツ */}
        <div className="prose-content">{children}</div>

        {/* 前後ナビゲーション */}
        <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
          {prevPage ? (
            <Link
              href={prevPage.path}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <div>
                <div className="text-xs text-muted-foreground">前のページ</div>
                <div className="font-medium text-foreground group-hover:text-primary">
                  {prevPage.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextPage ? (
            <Link
              href={nextPage.path}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group text-right"
            >
              <div>
                <div className="text-xs text-muted-foreground">次のページ</div>
                <div className="font-medium text-foreground group-hover:text-primary">
                  {nextPage.title}
                </div>
              </div>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
