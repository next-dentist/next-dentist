'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { siteConfig } from '@/config';
import { FilterIcon, MapPin, Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { ReusableCombobox } from './ReUsableCombo';
import SearchBar from './SearchBar/SearchBar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

// Define filter types for extensibility
interface FilterOption {
  id: string;
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'text' | 'multiselect';
  placeholder: string;
  options?: FilterOption[];
  icon?: React.ReactNode;
}

// Configure available filters - easy to extend
const filterConfigs: FilterConfig[] = [
  {
    key: 'city',
    label: 'City',
    type: 'select',
    placeholder: 'Select city',
    options: siteConfig.cities.map(city => ({
      id: city.id.toString(),
      value: city.value,
      label: city.name,
    })),
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    key: 'treatment',
    label: 'Treatment',
    type: 'select',
    placeholder: 'Select treatment',
    options: siteConfig.treatments.map(treatment => ({
      id: treatment.id.toString(),
      value: treatment.value,
      label: treatment.name,
    })),
  },
  {
    key: 'specialization',
    label: 'Specialization',
    type: 'select',
    placeholder: 'Select specialization',
    options: [
      { id: '1', value: 'orthodontics', label: 'Orthodontics' },
      { id: '2', value: 'oral-surgery', label: 'Oral Surgery' },
      { id: '3', value: 'endodontics', label: 'Endodontics' },
      { id: '4', value: 'periodontics', label: 'Periodontics' },
      { id: '5', value: 'prosthodontics', label: 'Prosthodontics' },
      { id: '6', value: 'pediatric', label: 'Pediatric Dentistry' },
      { id: '7', value: 'cosmetic', label: 'Cosmetic Dentistry' },
    ],
  },
  {
    key: 'name',
    label: 'Dentist Name',
    type: 'text',
    placeholder: 'Search by name',
    icon: <Search className="h-4 w-4" />,
  },
  {
    key: 'location',
    label: 'Location',
    type: 'text',
    placeholder: 'Area, landmark, or address',
    icon: <MapPin className="h-4 w-4" />,
  },
];

const Filters: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // State for all filters
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [generalSearch, setGeneralSearch] = useState<string>('');
  const [nearbySearch, setNearbySearch] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Debouncing for search input
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchValueRef = useRef<string>('');

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Initialize state from URL parameters
  useEffect(() => {
    const newFilters: Record<string, string> = {};

    filterConfigs.forEach(config => {
      const value = searchParams.get(config.key);
      if (value) {
        newFilters[config.key] = value;
      }
    });

    setFilters(newFilters);

    // Initialize general search
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setGeneralSearch(searchParam);
    }

    // Check nearby search parameter and city selection
    const nearbyParam = searchParams.get('nearby');
    const citySelected = searchParams.get('city');

    if (citySelected) {
      // If city is selected, disable nearby search
      setNearbySearch(false);
    } else if (nearbyParam !== null) {
      setNearbySearch(nearbyParam === 'true');
    } else {
      // Default to true if no nearby parameter and no city
      setNearbySearch(true);
    }
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters };

    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }

    setFilters(newFilters);

    // Auto-disable nearby search when city is selected
    if (key === 'city' && value) {
      setNearbySearch(false);
      updateSearchParams(newFilters, false);
    }
    // Auto-enable nearby search when city is cleared (and no other location filters)
    else if (key === 'city' && !value && !newFilters.location) {
      setNearbySearch(true);
      updateSearchParams(newFilters, true);
    }
    // For other filters, keep current nearby state
    else {
      updateSearchParams(newFilters);
    }
  };

  const toggleNearbySearch = (enabled: boolean) => {
    setNearbySearch(enabled);
    updateSearchParams(filters, enabled);
  };

  const updateSearchParams = (
    newFilters: Record<string, string>,
    nearby?: boolean,
    search?: string
  ) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && key !== 'nearby') {
        params.set(key, value);
      }
    });

    // Add general search parameter
    const searchValue = search !== undefined ? search : generalSearch;
    if (searchValue) {
      params.set('search', searchValue);
    }

    // Use the provided nearby parameter or current state
    const nearbyValue = nearby !== undefined ? nearby : nearbySearch;
    params.set('nearby', nearbyValue.toString());

    const newUrl = params.toString()
      ? `/search?${params.toString()}`
      : '/search?nearby=true';
    router.push(newUrl);
  };

  const removeFilter = (key: string) => {
    updateFilter(key, '');
  };

  // Helper: check if current path is already /search-nav
  const isOnSearchNav = React.useMemo(() => {
    // Normalize trailing slash
    return pathname === '/search-nav' || pathname === '/search-nav/';
  }, [pathname]);

  // Debounced function to update search parameters
  const debouncedUpdateSearch = (searchValue: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (isOnSearchNav && lastSearchValueRef.current !== searchValue) {
        updateSearchParams(filters, undefined, searchValue);
        lastSearchValueRef.current = searchValue;
      }
    }, 500); // 500ms delay
  };

  const clearAllFilters = () => {
    // Clear any pending debounced calls
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    setFilters({});
    setGeneralSearch('');
    setNearbySearch(true);
    lastSearchValueRef.current = '';

    if (isOnSearchNav) {
      updateSearchParams({}, true, '');
    } else {
      router.push('/search?nearby=true');
    }
  };

  const handleGeneralSearchSubmit = () => {
    // Clear any pending debounced calls
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // If on search-nav page, perform search directly
    if (isOnSearchNav) {
      updateSearchParams(filters, undefined, generalSearch);
      lastSearchValueRef.current = generalSearch;
      return;
    }

    // Otherwise, redirect to search-nav page with current parameters
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'nearby') {
        params.set(key, value);
      }
    });

    if (generalSearch) {
      params.set('search', generalSearch);
    }

    params.set('nearby', nearbySearch.toString());

    const searchNavUrl = params.toString()
      ? `/search-nav?${params.toString()}`
      : '/search-nav';

    router.push(searchNavUrl);
  };

  const handleSearchBarClick = () => {
    // Only redirect if NOT on search-nav page
    if (isOnSearchNav) return;

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'nearby') {
        params.set(key, value);
      }
    });

    if (generalSearch) {
      params.set('search', generalSearch);
    }

    params.set('nearby', nearbySearch.toString());

    const searchNavUrl = params.toString()
      ? `/search-nav?${params.toString()}`
      : '/search-nav';

    router.push(searchNavUrl);
  };

  const updateGeneralSearch = (value: string) => {
    setGeneralSearch(value);
    // Only update URL if on search-nav page, with debouncing
    if (isOnSearchNav) {
      debouncedUpdateSearch(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGeneralSearchSubmit();
    }
  };

  // Get active filters for display (excluding general search)
  const activeFilters = Object.entries(filters).filter(([_, value]) => value);

  const renderFilter = (config: FilterConfig) => {
    const value = filters[config.key] || '';

    switch (config.type) {
      case 'select':
        return (
          <ReusableCombobox
            key={config.key}
            options={config.options || []}
            value={value}
            onChange={newValue => updateFilter(config.key, newValue)}
            placeholder={config.placeholder}
            className="w-full"
          />
        );

      case 'text':
        return (
          <div key={config.key} className="relative w-full">
            <Input
              placeholder={config.placeholder}
              value={value}
              onChange={e => updateFilter(config.key, e.target.value)}
              className="pl-8"
            />
            {config.icon && (
              <div className="text-muted-foreground absolute top-1/2 left-2 -translate-y-1/2 transform">
                {config.icon}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Main Search Bar */}
      <div className="flex w-full gap-2">
        <div className="relative flex-1">
          <SearchBar
            placeholder="Search treatments, specialties, locations, or 'dentist near me'..."
            onSearch={query => {
              if (isOnSearchNav) {
                updateGeneralSearch(query);
              } else {
                setGeneralSearch(query);
              }
              handleGeneralSearchSubmit();
            }}
            onSuggestionSelect={suggestion => {
              // Handle suggestion selection
              if (suggestion.type === 'treatment') {
                updateFilter('treatment', suggestion.title);
              } else if (suggestion.type === 'location') {
                updateFilter('city', suggestion.title);
              } else if (suggestion.type === 'specialization') {
                updateFilter('specialization', suggestion.title);
              } else {
                setGeneralSearch(suggestion.title);
                handleGeneralSearchSubmit();
              }
            }}
            showRecentSearches={true}
            showTrending={true}
            showFilters={true}
            maxSuggestions={10}
            enableVoiceSearch={true}
            enableSmartSuggestions={true}
            enableKeyboardShortcuts={true}
            enableAnalytics={true}
            size="lg"
            variant="default"
            autoFocus={isOnSearchNav}
            disabled={!isOnSearchNav}
            className={!isOnSearchNav ? 'cursor-pointer' : ''}
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsDialogOpen(true)}
          className="h-12 px-6"
        >
          <FilterIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Nearby Search Toggle */}
      <div className="flex items-center space-x-2 rounded-lg p-3">
        <Switch
          id="nearby-search"
          checked={nearbySearch}
          onCheckedChange={toggleNearbySearch}
          disabled={!!filters.city}
        />
        <Label
          htmlFor="nearby-search"
          className={`flex items-center space-x-2 ${filters.city ? 'text-muted-foreground' : ''}`}
        >
          <MapPin className="h-4 w-4" />
          <span>Near me First</span>
        </Label>
        {nearbySearch && !filters.city && (
          <Badge variant="secondary" className="ml-auto">
            Location-based
          </Badge>
        )}
        {filters.city && (
          <Badge variant="outline" className="ml-auto">
            City: {filters.city}
          </Badge>
        )}
      </div>

      {/* Active Filters Display */}
      {(activeFilters.length > 0 || generalSearch) && (
        <div className="flex flex-wrap gap-2">
          <span className="text-muted-foreground text-sm">Active filters:</span>
          {generalSearch && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {generalSearch}
              <X
                className="hover:text-destructive h-3 w-3 cursor-pointer"
                onClick={() => {
                  // Clear any pending debounced calls
                  if (debounceTimeoutRef.current) {
                    clearTimeout(debounceTimeoutRef.current);
                  }
                  lastSearchValueRef.current = '';

                  if (isOnSearchNav) {
                    updateGeneralSearch('');
                  } else {
                    setGeneralSearch('');
                  }
                }}
              />
            </Badge>
          )}
          {activeFilters.map(([key, value]) => {
            const config = filterConfigs.find(c => c.key === key);
            const label =
              config?.options?.find(o => o.value === value)?.label || value;

            return (
              <Badge
                key={key}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {config?.label}: {label}
                <X
                  className="hover:text-destructive h-3 w-3 cursor-pointer"
                  onClick={() => removeFilter(key)}
                />
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="hidden">
              Open Filters
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Advanced Filters</DialogTitle>
              <DialogDescription>
                Find dentists that match your specific needs.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
              {filterConfigs.map(config => (
                <div key={config.key} className="space-y-2">
                  <Label
                    htmlFor={config.key}
                    className="flex items-center gap-2"
                  >
                    {config.icon}
                    {config.label}
                  </Label>
                  {renderFilter(config)}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  setIsDialogOpen(false);
                }}
              >
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Filters;
