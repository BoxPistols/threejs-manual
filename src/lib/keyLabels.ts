export function modKey(isMac: boolean): string {
  return isMac ? '⌘' : 'Ctrl';
}

export function navModKey(isMac: boolean): string {
  return isMac ? '⌥' : 'Alt';
}

export function searchShortcutLabel(isMac: boolean): string {
  return `${modKey(isMac)}+K`;
}

export function pageNavLabel(isMac: boolean, direction: 'next' | 'prev'): string {
  const arrow = direction === 'next' ? '↓' : '↑';
  return `${navModKey(isMac)}+${arrow}`;
}
