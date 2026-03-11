'use client';
import React, { createContext, useContext } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
  theme: 'light' | 'dark';
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  const mode = (theme as ThemeMode) || 'system';
  const resolved = (resolvedTheme as 'light' | 'dark') || 'light';

  const setMode = (newMode: ThemeMode) => {
    setTheme(newMode);
  };

  const toggleTheme = () => {
    setTheme(resolved === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme: resolved, mode, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeContextProvider');
  return ctx;
}
