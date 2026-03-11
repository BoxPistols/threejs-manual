'use client';
import { useState, useCallback } from 'react';

const PREFIX = 'page-note:';

export function usePageNotes(path: string) {
  const [note, setNoteState] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(PREFIX + path) || '';
  });

  const setNote = useCallback((value: string) => {
    setNoteState(value);
    if (value) {
      localStorage.setItem(PREFIX + path, value);
    } else {
      localStorage.removeItem(PREFIX + path);
    }
  }, [path]);

  return { note, setNote };
}
