import Fuse from 'fuse.js';
import { useMemo } from 'react';
import type { SearchSuggestion } from '../types';
import { mockLocations, mockSpecializations } from '../utils/mockData';

export default function useSuggestions(dentists: SearchSuggestion[], query: string) {
  const fuse = useMemo(
    () =>
      new Fuse(dentists, {
        keys: ['title', 'city', 'subtitle', 'description'],
        threshold: 0.3,
      }),
    [dentists]
  );

  if (!query.trim()) return [];

  const dMatches = fuse.search(query).map(r => r.item);
  const filterText = (arr: SearchSuggestion[]) =>
    arr.filter(i => i.title.toLowerCase().includes(query.toLowerCase()));

  return [
    ...dMatches,
    ...filterText(mockLocations),
    ...filterText(mockSpecializations),
  ];
}