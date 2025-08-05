'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Fuse from 'fuse.js';
import {
  Building2,
  Clock,
  Command as CommandIcon,
  Filter,
  History,
  Keyboard,
  Loader2,
  MapPin,
  Mic,
  MicOff,
  Search,
  Sparkles,
  Star,
  Stethoscope,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SIZE_CLASSES, VARIANT_CLASSES } from './constants';
import type { SearchBarProps, SearchSuggestion } from './types';
import { track } from './utils/analytics';
import { calculateDistance, getUserLocation } from './utils/location';
import {
  generateSmartSuggestions,
  mockLocations,
  mockSpecializations,
} from './utils/mockData';
import { clearRecent, getRecent, storeRecent } from './utils/storage';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search treatments, dentists, locations...',
  className = '',
  onSearch,
  onSuggestionSelect,
  showRecentSearches = true,
  showTrending = true,
  showFilters = true,
  maxSuggestions = 10,
  enableVoiceSearch = true,
  enableSmartSuggestions = true,
  enableKeyboardShortcuts = true,
  enableAnalytics = true,
  theme = 'auto',
  size = 'md',
  variant = 'default',
  autoFocus = false,
  disabled = false,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [dentists, setDentists] = useState<SearchSuggestion[]>([]);
  const [treatments, setTreatments] = useState<SearchSuggestion[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  const dentistFuse = useMemo(
    () =>
      new Fuse(dentists, {
        keys: ['title', 'city', 'subtitle', 'description', 'relatedKeys'],
        threshold: 0.3,
        includeScore: true,
      }),
    [dentists]
  );

  const treatmentFuse = useMemo(
    () =>
      new Fuse(treatments, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'subtitle', weight: 1.5 },
          { name: 'description', weight: 1 },
          { name: 'relatedKeys', weight: 1.8 },
        ],
        threshold: 0.5,
        includeScore: true,
        ignoreLocation: true,
        findAllMatches: true,
      }),
    [treatments]
  );

  useEffect(() => {
    setUserLocation(getUserLocation());
  }, []);

  useEffect(() => {
    fetch('/searchData.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch search data');
        return r.json();
      })
      .then(data => {
        const transformedDentists = data.dentists.map((d: any) => {
          const dentistLocation = { lat: d.latitude, lng: d.longitude };
          let distance: number | undefined;
          if (userLocation && dentistLocation.lat && dentistLocation.lng) {
            distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              dentistLocation.lat,
              dentistLocation.lng
            );
          }
          return {
            id: d.id.toString(),
            type: 'dentist' as const,
            title: d.name,
            subtitle: d.speciality || 'General Dentist',
            description: d.shortBio || `Dentist in ${d.city || 'Unknown City'}`,
            iconType: 'dentist',
            city: d.city || '',
            rating: d.rating || null,
            popularity: Math.floor(Math.random() * 100) + 50,
            searchCount: Math.floor(Math.random() * 1000) + 100,
            badge:
              d.rating >= 4.8
                ? 'Top Rated'
                : d.rating >= 4.5
                  ? 'Recommended'
                  : undefined,
            metadata: {
              latitude: d.latitude,
              longitude: d.longitude,
              distance,
              image: d.image,
            },
          };
        });
        setDentists(transformedDentists);

        if (data.treatments) {
          const transformedTreatments = data.treatments.map(
            (t: any, index: number) => ({
              id: t.id.toString(),
              type: 'treatment' as const,
              title: t.name,
              subtitle: 'Treatment',
              description: `Find dentists offering ${t.name.toLowerCase()}`,
              iconType: 'treatment',
              badge: index < 3 ? 'Popular' : index < 6 ? 'Trending' : undefined,
              popularity: Math.floor(Math.random() * 100) + 50,
              searchCount: Math.floor(Math.random() * 1000) + 100,
              category: 'Healthcare',
              metadata: {
                image: t.image,
              },
              relatedKeys: t.relatedKeys,
            })
          );
          setTreatments(transformedTreatments);
        }
      })
      .catch(error => {
        console.error('Error fetching search data:', error);
      });
  }, [userLocation]);

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const dentistResults = dentistFuse.search(query).map(result => ({
          ...result.item,
          score: result.score,
        }));

        // Use Fuse for treatment search to get better fuzzy matching with relatedKeys
        const treatmentFuseResults = treatmentFuse
          .search(query)
          .map(result => ({
            ...result.item,
            score: result.score,
          }));

        // Fallback: direct filter for treatments to catch any missed matches
        const treatmentFilterResults = treatments
          .filter(treatment => {
            const queryLower = query.toLowerCase();
            const queryWords = queryLower
              .split(' ')
              .filter(word => word.length > 1);

            const matchesRelatedKeys =
              treatment.relatedKeys &&
              (treatment.relatedKeys.toLowerCase().includes(queryLower) ||
                queryWords.some(word =>
                  treatment.relatedKeys?.toLowerCase().includes(word)
                ));

            const matchesTitle =
              treatment.title.toLowerCase().includes(queryLower) ||
              queryWords.some(word =>
                treatment.title.toLowerCase().includes(word)
              );

            return matchesRelatedKeys || matchesTitle;
          })
          .filter(
            treatment =>
              !treatmentFuseResults.some(
                fuseResult => fuseResult.id === treatment.id
              )
          );

        const treatmentResults = [
          ...treatmentFuseResults,
          ...treatmentFilterResults,
        ];

        const filterByQuery = (item: SearchSuggestion) => {
          const queryLower = query.toLowerCase();
          const queryWords = queryLower
            .split(' ')
            .filter(word => word.length > 1);

          // Check if any search term matches
          const matchesQuery = (text: string) => {
            const textLower = text.toLowerCase();
            return (
              queryWords.some(word => textLower.includes(word)) ||
              textLower.includes(queryLower)
            );
          };

          return (
            matchesQuery(item.title) ||
            (item.subtitle && matchesQuery(item.subtitle)) ||
            (item.description && matchesQuery(item.description)) ||
            (item.relatedKeys && matchesQuery(item.relatedKeys))
          );
        };
        const locationResults = mockLocations.filter(filterByQuery);
        const specializationResults = mockSpecializations.filter(filterByQuery);

        let allSuggestions = [
          ...dentistResults,
          ...treatmentResults,
          ...locationResults,
          ...specializationResults,
        ];

        if (enableSmartSuggestions) {
          const smart = generateSmartSuggestions(query);
          allSuggestions = [...smart, ...allSuggestions];
        }

        const filtered = allSuggestions
          .sort((a, b) => {
            // Define type priority order: Smart Search -> Specialization -> Treatments -> Dentists
            const getTypePriority = (type: string) => {
              switch (type) {
                case 'smart':
                  return 1;
                case 'specialization':
                  return 2;
                case 'treatment':
                  return 3;
                case 'dentist':
                  return 4;
                default:
                  return 5;
              }
            };

            const aPriority = getTypePriority(a.type);
            const bPriority = getTypePriority(b.type);

            // First sort by type priority
            if (aPriority !== bPriority) {
              return aPriority - bPriority;
            }

            // Within same type, apply additional sorting logic
            if (a.type === b.type) {
              // For dentists, sort by distance if available
              if (a.type === 'dentist' && userLocation) {
                const aDist = a.metadata?.distance as number | undefined;
                const bDist = b.metadata?.distance as number | undefined;
                if (aDist !== undefined && bDist !== undefined) {
                  return aDist - bDist;
                }
              }

              // Check for exact matches (title starts with query)
              const aExact = a.title
                .toLowerCase()
                .startsWith(query.toLowerCase())
                ? 1
                : 0;
              const bExact = b.title
                .toLowerCase()
                .startsWith(query.toLowerCase())
                ? 1
                : 0;
              if (aExact !== bExact) return bExact - aExact;

              // Sort by search score if available (lower score = better match)
              if (a.score && b.score) {
                return a.score - b.score;
              }

              // Finally sort by popularity
              return (b.popularity || 0) - (a.popularity || 0);
            }

            return 0;
          })
          .slice(0, maxSuggestions);

        setSuggestions(filtered);

        if (enableAnalytics) {
          track('search_query', {
            query,
            resultsCount: filtered.length,
          });
        }
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      maxSuggestions,
      enableSmartSuggestions,
      enableAnalytics,
      dentistFuse,
      treatmentFuse,
      treatments,
      userLocation,
    ]
  );

  useEffect(() => {
    if (enableVoiceSearch && typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchValue(transcript);
          handleInputChange(transcript);
          setIsListening(false);
          if (enableAnalytics) {
            track('voice_search', { query: transcript });
          }
        };
        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, [enableVoiceSearch, enableAnalytics]);

  useEffect(() => {
    if (!enableKeyboardShortcuts) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
        if (enableAnalytics) {
          track('keyboard_shortcut', { shortcut: 'cmd_k' });
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcuts, enableAnalytics, isOpen]);

  useEffect(() => {
    setRecentSearches(getRecent());
  }, []);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    setHighlightedIndex(-1);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (value.length <= 1) {
      setSuggestions([]);
      return;
    }
    const delay = value.length > 3 ? 150 : 300;
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, delay);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchValue(suggestion.title);
    setIsOpen(false);
    storeRecent(suggestion);
    setRecentSearches(getRecent());

    if (enableAnalytics) {
      track('suggestion_select', {
        id: suggestion.id,
        type: suggestion.type,
        title: suggestion.title,
        position: suggestions.findIndex(s => s.id === suggestion.id),
      });
    }

    const queryParams: Record<string, string> = { nearby: 'true' };
    switch (suggestion.type) {
      case 'treatment':
        queryParams.treatment = suggestion.title;
        break;
      case 'location':
        queryParams.city = suggestion.title;
        queryParams.nearby = 'false';
        break;
      case 'dentist':
        queryParams.name = suggestion.title;
        queryParams.nearby = 'false';
        break;
      case 'specialization':
        queryParams.specialization = suggestion.title;
        break;
      case 'smart':
        if (suggestion.id.includes('emergency')) {
          queryParams.search = 'emergency dentist';
          queryParams.urgent = 'true';
        } else if (suggestion.id.includes('nearby')) {
          // just nearby=true
        } else if (suggestion.id.includes('insurance')) {
          queryParams.insurance = 'true';
        } else {
          queryParams.search = suggestion.title;
        }
        break;
      default:
        queryParams.search = suggestion.title;
    }
    router.push(`/search?${new URLSearchParams(queryParams).toString()}`);
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    setIsOpen(false);
    onSearch?.(searchValue, { filters: selectedFilters });

    if (enableAnalytics) {
      track('manual_search', { query: searchValue });
    }

    const customSuggestion: SearchSuggestion = {
      id: `search-${Date.now()}`,
      type: 'recent',
      title: searchValue,
      subtitle: 'Manual Search',
      iconType: 'search',
      lastUsed: new Date(),
    };
    storeRecent(customSuggestion);

    router.push(
      `/search?search=${encodeURIComponent(searchValue)}&nearby=true`
    );
  };

  const handleVoiceSearch = () => {
    if (!recognitionRef.current || isListening) return;
    try {
      setIsListening(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Voice recognition error:', error);
      setIsListening(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionSelect(suggestions[highlightedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        if (e.shiftKey || !suggestions.length) return;
        e.preventDefault();
        if (suggestions[0]) {
          setSearchValue(suggestions[0].title);
        }
        break;
    }
  };

  const getSuggestionIcon = (suggestion: SearchSuggestion) => {
    const iconType = suggestion.iconType || suggestion.type;
    const imageUrl = suggestion.metadata?.image;
    const props = { className: 'h-4 w-4' };

    // If there's an image URL, render an image instead of an icon
    if (
      imageUrl &&
      (suggestion.type === 'dentist' || suggestion.type === 'treatment')
    ) {
      return (
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={imageUrl}
            alt={suggestion.title}
            className="h-full w-full object-cover"
            onError={e => {
              // Fallback to icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallbackIcon = target.nextElementSibling as HTMLElement;
              if (fallbackIcon) {
                fallbackIcon.style.display = 'block';
              }
            }}
            width={48}
            height={48}
          />
          {/* Fallback icon (hidden by default) */}
          <div className="absolute inset-0 hidden items-center justify-center">
            {suggestion.type === 'dentist' ? (
              <User {...props} />
            ) : (
              <Stethoscope {...props} />
            )}
          </div>
        </div>
      );
    }

    // Fallback to icons for cases without images
    switch (iconType) {
      case 'treatment':
        return <Stethoscope {...props} />;
      case 'dentist':
        return <User {...props} />;
      case 'location':
        return <MapPin {...props} />;
      case 'specialization':
        return <Building2 {...props} />;
      case 'recent':
        return <History {...props} />;
      case 'trending':
        return <TrendingUp {...props} />;
      case 'smart':
        return <Sparkles {...props} />;
      case 'search':
      default:
        return <Search {...props} />;
    }
  };

  const getBadgeVariant = (suggestion: SearchSuggestion) => {
    switch (suggestion.badge) {
      case 'Popular':
      case 'Most Searched':
        return 'default';
      case 'Top Rated':
        return 'secondary';
      case 'Emergency':
        return 'destructive';
      case 'Trending':
        return 'outline';
      case 'Smart':
      case 'Budget':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const handleClearRecent = () => {
    clearRecent();
    setRecentSearches([]);
    if (enableAnalytics) {
      track('clear_recent', {});
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const shouldShowRecent =
    showRecentSearches && recentSearches.length > 0 && !searchValue;
  const shouldShowSuggestions = searchValue && suggestions.length > 0;
  const shouldShowTrending = showTrending && !searchValue;

  return (
    <TooltipProvider>
      <div className={cn('relative w-full', className)}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <div
                className={cn(
                  'flex w-full items-center gap-2 rounded-xl border transition-all duration-300',
                  SIZE_CLASSES[size],
                  VARIANT_CLASSES[variant],
                  isOpen &&
                    'border-primary/50 ring-primary/10 shadow-lg ring-2',
                  'hover:border-primary/30 focus-within:border-primary/50 focus-within:ring-primary/10 focus-within:ring-2',
                  disabled && 'cursor-not-allowed opacity-50',
                  variant === 'glass' && 'shadow-lg'
                )}
              >
                <Search className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchValue}
                  onChange={e => !disabled && handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => !disabled && setIsOpen(true)}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="placeholder:text-muted-foreground flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
                />
                <div className="flex flex-shrink-0 items-center gap-1">
                  {isLoading && (
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  )}
                  {showFilters && selectedFilters.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="text-xs">
                          <Filter className="mr-1 h-3 w-3" />
                          {selectedFilters.length}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>{selectedFilters.length} active filter(s)</span>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {enableVoiceSearch && recognitionRef.current && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-muted h-6 w-6 p-0"
                          onClick={handleVoiceSearch}
                          disabled={disabled || isListening}
                        >
                          {isListening ? (
                            <MicOff className="text-destructive h-3 w-3 animate-pulse" />
                          ) : (
                            <Mic className="h-3 w-3" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>
                          {isListening ? 'Listening...' : 'Voice search'}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {enableKeyboardShortcuts && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-muted h-6 w-6 p-0"
                          onClick={() => setShowKeyboardShortcuts(true)}
                        >
                          <Keyboard className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Keyboard shortcuts</span>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {searchValue && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-muted h-6 w-6 p-0"
                          onClick={() => {
                            setSearchValue('');
                            setSuggestions([]);
                            inputRef.current?.focus();
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Clear search</span>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
              {enableKeyboardShortcuts && !isOpen && !searchValue && (
                <div className="text-muted-foreground absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-1 text-xs md:flex">
                  <kbd className="bg-muted rounded px-2 py-0.5 text-xs">⌘</kbd>
                  <kbd className="bg-muted rounded px-2 py-0.5 text-xs">K</kbd>
                </div>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="bg-background/95 w-[var(--radix-popover-trigger-width)] max-w-lg border p-0 shadow-xl backdrop-blur-sm"
            align="start"
            sideOffset={8}
            onOpenAutoFocus={e => e.preventDefault()}
          >
            <Command className="max-h-[60vh] md:max-h-[500px]">
              <CommandList>
                <AnimatePresence mode="wait">
                  {shouldShowRecent && (
                    <motion.div
                      key="recent"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CommandGroup heading="Recent Searches">
                        {recentSearches.slice(0, 5).map((s, i) => (
                          <CommandItem
                            key={s.id}
                            onSelect={() => handleSuggestionSelect(s)}
                            className={cn(
                              'mx-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5',
                              i === highlightedIndex && 'bg-accent'
                            )}
                          >
                            <div className="text-muted-foreground">
                              {getSuggestionIcon(s)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="truncate text-sm font-medium">
                                {s.title}
                              </span>
                              {s.lastUsed && (
                                <span className="text-muted-foreground flex items-center text-xs">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {new Date(s.lastUsed).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                        <div className="px-3 py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground w-full justify-center text-xs"
                            onClick={handleClearRecent}
                          >
                            Clear recent searches
                          </Button>
                        </div>
                      </CommandGroup>
                      {shouldShowTrending && (
                        <CommandSeparator className="my-1" />
                      )}
                    </motion.div>
                  )}

                  {shouldShowSuggestions ? (
                    <motion.div
                      key="suggestions"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CommandGroup heading={`Results for "${searchValue}"`}>
                        {suggestions.map((s, i) => (
                          <CommandItem
                            key={s.id}
                            onSelect={() => handleSuggestionSelect(s)}
                            className={cn(
                              'mx-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3',
                              i === highlightedIndex && 'bg-accent'
                            )}
                          >
                            <div className="text-muted-foreground flex-shrink-0">
                              {getSuggestionIcon(s)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <span className="truncate text-sm font-medium">
                                  {s.title}
                                </span>
                                {s.badge && (
                                  <Badge
                                    variant={getBadgeVariant(s)}
                                    className="flex-shrink-0 px-2 py-0 text-xs"
                                  >
                                    {s.badge}
                                  </Badge>
                                )}
                              </div>
                              {s.subtitle && (
                                <span className="text-muted-foreground mb-1 text-xs">
                                  {s.subtitle}
                                </span>
                              )}
                              {s.description && (
                                <span className="text-muted-foreground line-clamp-1 text-xs">
                                  {s.description}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-shrink-0 flex-col items-end gap-1">
                              {s.metadata?.distance !== undefined && (
                                <div className="text-muted-foreground flex items-center text-xs">
                                  <MapPin className="mr-1 h-3 w-3" />
                                  {`${s.metadata.distance.toFixed(1)} km`}
                                </div>
                              )}
                              {s.rating && (
                                <div className="text-muted-foreground flex items-center text-xs">
                                  <Star className="fill-primary text-primary mr-1 h-3 w-3" />
                                  {s.rating}
                                </div>
                              )}
                              {s.type === 'smart' && (
                                <Sparkles className="text-primary h-3 w-3" />
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </motion.div>
                  ) : searchValue && !isLoading ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <CommandEmpty className="py-8 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Search className="text-muted-foreground/50 h-12 w-12" />
                          <div>
                            <span className="text-muted-foreground mb-1 text-sm font-medium">
                              No results found for "{searchValue}"
                            </span>
                            <span className="text-muted-foreground text-xs">
                              Try another search or browse popular categories.
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSearch}
                            className="mt-2"
                          >
                            Search for "{searchValue}"
                          </Button>
                        </div>
                      </CommandEmpty>
                    </motion.div>
                  ) : null}

                  {shouldShowTrending && (
                    <motion.div
                      key="trending"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CommandGroup heading="Popular Searches">
                        {[
                          ...treatments,
                          ...mockSpecializations,
                          ...dentists.slice(0, 3),
                        ]
                          .sort(
                            (a, b) => (b.popularity || 0) - (a.popularity || 0)
                          )
                          .slice(0, 6)
                          .map((s, i) => (
                            <CommandItem
                              key={s.id}
                              onSelect={() => handleSuggestionSelect(s)}
                              className={cn(
                                'mx-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5',
                                i === highlightedIndex && 'bg-accent'
                              )}
                            >
                              <div className="text-muted-foreground">
                                {getSuggestionIcon(s)}
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-medium">
                                  {s.title}
                                </span>
                                <div className="text-muted-foreground flex items-center justify-between text-xs">
                                  <span>{s.subtitle}</span>
                                  {s.searchCount && (
                                    <span>
                                      {s.searchCount.toLocaleString()} searches
                                    </span>
                                  )}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {showKeyboardShortcuts && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowKeyboardShortcuts(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background w-full max-w-md rounded-lg p-6 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <CommandIcon className="h-5 w-5" />
                  Keyboard Shortcuts
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeyboardShortcuts(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Focus search</span>
                  <div className="flex gap-1">
                    <kbd className="bg-muted rounded px-2 py-1 text-xs">⌘</kbd>
                    <kbd className="bg-muted rounded px-2 py-1 text-xs">K</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Navigate</span>
                  <div className="flex gap-1">
                    <kbd className="bg-muted rounded px-2 py-1 text-xs">↑</kbd>
                    <kbd className="bg-muted rounded px-2 py-1 text-xs">↓</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Select</span>
                  <kbd className="bg-muted rounded px-2 py-1 text-xs">
                    Enter
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Autocomplete</span>
                  <kbd className="bg-muted rounded px-2 py-1 text-xs">Tab</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Close</span>
                  <kbd className="bg-muted rounded px-2 py-1 text-xs">Esc</kbd>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default SearchBar;
