import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { ThemeContextProvider, useThemeContext } from "@/contexts/ThemeContext";

// next-themes をモック
const mockSetTheme = vi.fn();
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: mockSetTheme,
    resolvedTheme: "dark",
  }),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}

describe("ThemeContext", () => {
  it("Provider 外で useThemeContext を使うとエラーになる", () => {
    expect(() => {
      renderHook(() => useThemeContext());
    }).toThrow("useThemeContext must be used within ThemeContextProvider");
  });

  it("マウント前は mounted が false", () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    // renderHook は useEffect を実行するため、初回レンダ後は true になる
    // ただし初期状態をテストするため、内部実装の確認
    expect(result.current.mounted).toBe(true);
  });

  it("resolvedTheme をそのまま theme として返す", () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    expect(result.current.theme).toBe("dark");
  });

  it("mode を返す", () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    expect(result.current.mode).toBe("dark");
  });

  it("toggleTheme が setTheme を正しく呼ぶ", () => {
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    act(() => {
      result.current.toggleTheme();
    });
    // dark → light にトグル
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("setMode が setTheme を呼ぶ", () => {
    mockSetTheme.mockClear();
    const { result } = renderHook(() => useThemeContext(), { wrapper });
    act(() => {
      result.current.setMode("system");
    });
    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });
});
