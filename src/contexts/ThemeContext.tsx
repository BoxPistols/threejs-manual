'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
  theme: 'light' | 'dark';
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const mode = (theme as ThemeMode) || 'system';
  const resolved = (resolvedTheme as 'light' | 'dark') || 'light';

  const setMode = (newMode: ThemeMode) => {
    setTheme(newMode);
  };

  const toggleTheme = () => {
    setTheme(resolved === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme: resolved, mode, setMode, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeContextProvider');
  return ctx;
}
