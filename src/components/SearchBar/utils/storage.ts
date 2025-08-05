import type { SearchSuggestion } from '../types';

const KEY = 'dentist-recent-searches';

export function getRecent(): SearchSuggestion[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function storeRecent(suggestion: SearchSuggestion) {
  if (typeof window === 'undefined') return;
  try {
    const recent = getRecent();
    const filtered = recent.filter(item => item.id !== suggestion.id);
    const updated = [
      { ...suggestion, lastUsed: new Date() },
      ...filtered,
    ].slice(0, 8);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function clearRecent() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEY);
  }
}
