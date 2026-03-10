'use client';
import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function toSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[<>'"&(){}[\]#@!?:;,./\\|=+*~`$%^]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function assignHeadingIds() {
  const headings = document.querySelectorAll('main h2, main h3');
  headings.forEach((el) => {
    if (!el.id) {
      const text = el.textContent?.trim();
      if (text) el.id = toSlug(text);
    }
  });
}

function scrollToHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  setTimeout(() => {
    const target = document.getElementById(decodeURIComponent(hash));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add('search-highlight');
      setTimeout(() => target.classList.remove('search-highlight'), 2000);
    }
  }, 100);
}

export function useAutoHeadingIds() {
  const pathname = usePathname();
  const handleHashChange = useCallback(() => {
    assignHeadingIds();
    scrollToHash();
  }, []);

  useEffect(() => {
    assignHeadingIds();
    scrollToHash();
  }, [pathname]);

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [handleHashChange]);
}
