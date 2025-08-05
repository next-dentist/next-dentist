'use client';
import DentistSearchCard from '@/components/DentistSearchCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { LocationPrompt } from '@/components/LocationPrompt';
import { SectionThree } from '@/components/SectionThree';
import { Input } from '@/components/ui/input';
import { WhiteRoundedBox } from '@/components/WhiteRoundedBox';
import { useInfiniteDentists } from '@/hooks/useInfiniteDentists';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const SearchPage: React.FC = () => {
  // 1. Router and params hooks
  const searchParams = useSearchParams();
  const router = useRouter();

  // 2. State hooks
  const [hasLocationAccess, setHasLocationAccess] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(true);

  // 3. Intersection observer hook
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px 200px 0px',
  });

  // 4. Data fetching hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteDentists(searchParams);

  // 5. Callback hooks
  const handleSearchInputClick = useCallback(() => {
    router.push('/search-nav');
  }, [router]);

  // 6. Effect hooks
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    // Check for geo cookie to determine location access
    const checkLocationAccess = async () => {
      try {
        const cookies = document.cookie;
        const hasGeoCookie = cookies.includes('geo=');

        // Also check if geo cookie has valid data
        let geoData = null;
        if (hasGeoCookie) {
          try {
            const geoCookieMatch = cookies.match(/geo=([^;]+)/);
            if (geoCookieMatch) {
              geoData = JSON.parse(decodeURIComponent(geoCookieMatch[1]));
            }
          } catch (parseError) {
            console.error('Error parsing geo cookie:', parseError);
          }
        }

        // Check if we have valid location data
        const hasValidLocation =
          geoData &&
          typeof geoData.lat === 'number' &&
          typeof geoData.lon === 'number' &&
          geoData.lat >= -90 &&
          geoData.lat <= 90 &&
          geoData.lon >= -180 &&
          geoData.lon <= 180;

        setHasLocationAccess(hasValidLocation);
        setIsCheckingLocation(false);
      } catch (error) {
        console.error('Error checking location access:', error);
        setHasLocationAccess(false);
        setIsCheckingLocation(false);
      }
    };

    checkLocationAccess();
  }, []);

  // Safely flatten the pages array to get all dentists
  const dentists = data?.pages?.flatMap(page => page?.dentists || []) || [];

  // Get search parameters for display
  const city = searchParams.get('city');
  const treatment = searchParams.get('treatment');
  const search = searchParams.get('search'); // General search parameter
  const name = searchParams.get('name');
  const location = searchParams.get('location');
  const specialization = searchParams.get('specialization');

  // Check if nearby search is enabled and other filters
  const nearbyEnabled = searchParams.get('nearby') === 'true';

  const hasOtherFilters =
    searchParams.get('city') ||
    searchParams.get('treatment') ||
    searchParams.get('name') ||
    searchParams.get('location') ||
    searchParams.get('search') ||
    searchParams.get('specialization');

  // Check if search term indicates nearby search
  const isNearbySearch =
    search &&
    ['near me', 'nearby', 'close to me', 'dentist near me'].some(term =>
      search.toLowerCase().includes(term)
    );

  // Build page title based on search parameters
  let pageTitle = 'Find a Dentist';

  // Show loading while checking location access
  if (isCheckingLocation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8f8]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#356574] md:mb-4"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Show LocationPrompt if:
  // 1. No location access (no geo cookie) AND
  // 2. (Nearby search is requested OR search contains "near me" terms OR no specific search filters)
  if (
    !hasLocationAccess &&
    (nearbyEnabled || isNearbySearch || (!hasOtherFilters && !search))
  ) {
    return <LocationPrompt />;
  }

  if (search) {
    if (isNearbySearch) {
      pageTitle = hasLocationAccess
        ? 'Dentists Near You'
        : 'Find Dentists Near You';
    } else {
      pageTitle = `Search Results for "${search}"`;
    }
  } else if (city && treatment) {
    pageTitle = `${treatment} in ${city}`;
  } else if (city) {
    pageTitle = `Dentists in ${city}`;
  } else if (treatment) {
    pageTitle = `${treatment} Specialists`;
  } else if (specialization) {
    pageTitle = `${specialization} Specialists`;
  } else if (name) {
    pageTitle = `Search Results for "${name}"`;
  }

  // Build description based on search parameters
  let description =
    'Browse through our network of qualified dentists to find the perfect match for your dental needs.';

  if (search) {
    if (isNearbySearch) {
      description = hasLocationAccess
        ? 'Showing nearby dentists sorted by distance from your location.'
        : 'Please allow location access to show dentists near you.';
    } else {
      description = `Showing search results for "${search}" across treatments, specialties, locations, and dentist names.`;
    }
  } else if (city && treatment) {
    description = `Showing results for ${treatment} specialists in ${city}.`;
  } else if (city) {
    description = `Showing results for dentists in ${city}.`;
  } else if (treatment) {
    description = `Showing results for dentists specializing in ${treatment}.`;
  } else if (specialization) {
    description = `Showing results for ${specialization} specialists.`;
  } else if (name) {
    description = `Showing search results for dentists named "${name}".`;
  } else if (location) {
    description = `Showing results for dentists in or near "${location}".`;
  }

  // Add nearby search info to description
  if (nearbyEnabled && hasLocationAccess && !hasOtherFilters) {
    description += ' Sorted by distance from your location.';
  } else if (
    (nearbyEnabled || isNearbySearch) &&
    hasLocationAccess &&
    hasOtherFilters &&
    !search
  ) {
    description += ' Filtered and sorted by distance.';
  }

  // Build results summary for display
  const totalResults = data?.pages?.[0]?.pagination?.total || 0;
  let resultsText = '';

  if (totalResults > 0) {
    resultsText = `${totalResults} dentist${totalResults !== 1 ? 's' : ''} found`;

    if (search) {
      resultsText += ` for "${search}"`;
    } else if (city || treatment || specialization || name || location) {
      const filters = [city, treatment, specialization, name, location].filter(
        Boolean
      );
      if (filters.length > 0) {
        resultsText += ` for ${filters.join(', ')}`;
      }
    }
  }

  return (
    <>
      <SectionThree className="py-4">
        <div
          className="bg-background border-input hover:border-primary/30 focus-within:border-primary/50 focus-within:ring-primary/10 flex h-12 w-full cursor-pointer items-center gap-2 rounded-xl border px-4 transition-all duration-300 focus-within:ring-2"
          onClick={handleSearchInputClick}
          tabIndex={0}
        >
          <Search className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <Input
            placeholder="Search dentists, treatments, specialties, locations, or 'dentist near me'..."
            className="placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
            readOnly
          />
        </div>
      </SectionThree>

      <SectionThree className="">
        <div className="flex w-full flex-col gap-4">
          <WhiteRoundedBox>
            {/* Search Results Header */}
            <div className="mb-4">
              {resultsText && (
                <span className="text-sm font-medium text-gray-700">
                  {resultsText}
                </span>
              )}

              {/* Location access warning for nearby searches */}
              {(nearbyEnabled || isNearbySearch) && !hasLocationAccess && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Location Access Needed
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          To show dentists near you, we need access to your
                          location. Please enable location access to get
                          personalized results.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : isError ? (
                <div className="col-span-full py-8 text-center text-red-500">
                  Error loading dentists: {error.message}
                </div>
              ) : dentists.length === 0 ? (
                <div className="col-span-full py-8 text-center">
                  <div className="mx-auto max-w-md">
                    <h3 className="text-lg font-medium text-gray-900">
                      No dentists found
                    </h3>
                    <p className="text-gray-600">
                      {search
                        ? `No results found for "${search}". Try searching with different keywords or check your spelling.`
                        : name
                          ? `No dentists found named "${name}". Try searching with a different name or check your spelling.`
                          : 'No dentists found matching your criteria. Try adjusting your filters or search terms.'}
                    </p>
                    {(nearbyEnabled || isNearbySearch) &&
                      !hasLocationAccess && (
                        <div className="mt-4">
                          <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center rounded-md border border-transparent bg-[#356574] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a4f5a]"
                          >
                            Enable Location Access
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ) : (
                <>
                  {dentists.map(dentist => (
                    <DentistSearchCard key={dentist.id} dentistData={dentist} />
                  ))}

                  {/* Loading indicator and intersection observer reference */}
                  <div
                    ref={ref}
                    className="col-span-full flex justify-center py-4"
                  >
                    {isFetchingNextPage && <LoadingSpinner />}
                    {!hasNextPage && dentists.length > 0 && (
                      <p className="text-gray-500">
                        {totalResults > dentists.length
                          ? `Showing ${dentists.length} of ${totalResults} results`
                          : 'No more dentists to load'}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </WhiteRoundedBox>
        </div>
      </SectionThree>
    </>
  );
};

export default SearchPage;
