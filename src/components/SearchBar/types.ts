export interface SearchSuggestion {
  id: string;
  type:
    | 'treatment'
    | 'dentist'
    | 'location'
    | 'specialization'
    | 'recent'
    | 'trending'
    | 'smart'
    | 'search';
  title: string;
  subtitle?: string;
  description?: string;
  iconType?: string;
  badge?: string;
  popularity?: number;
  lastUsed?: Date;
  metadata?: Record<string, any>;
  category?: string;
  searchCount?: number;
  rating?: number;
  city?: string;
  score?: number;
  relatedKeys?: string;
}

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string, filters?: Record<string, any>) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  showRecentSearches?: boolean;
  showTrending?: boolean;
  showFilters?: boolean;
  maxSuggestions?: number;
  enableVoiceSearch?: boolean;
  enableSmartSuggestions?: boolean;
  enableKeyboardShortcuts?: boolean;
  enableAnalytics?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'minimal' | 'prominent' | 'glass';
  autoFocus?: boolean;
  disabled?: boolean;
}