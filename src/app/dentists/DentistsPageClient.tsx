'use client';
import DentistSearchCard from '@/components/DentistSearchCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchBar from '@/components/SearchBar/SearchBar';
import { SectionTwo } from '@/components/SectionTwo';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteDentists } from '@/hooks/useInfiniteDentists';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function DentistsPageClient() {
  const searchParams = useSearchParams();
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px 200px 0px',
  });

  // fetch dentists
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteDentists(searchParams);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Safely flatten the pages array to get all dentists
  const dentists = data?.pages?.flatMap(page => page?.dentists || []) || [];

  return (
    <SectionTwo className="py-4">
      <div className="mb-4">
        <SearchBar
          placeholder="Search for dentists"
          className="w-full"
          showFilters={true}
          showTrending={true}
          showRecentSearches={true}
        />
      </div>
      <h1
        className={clsx(
          'text-sm font-bold',
          'text-muted-foreground mb-4',
          'text-center'
        )}
      >
        Complete list of dentists in your area
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
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
              No dentists found matching your criteria.
            </div>
          ) : (
            <>
              {dentists.map(dentist => (
                <DentistSearchCard key={dentist.id} dentistData={dentist} />
              ))}

              {/* Loading indicator and intersection observer reference */}
              <div ref={ref} className="col-span-full flex justify-center py-4">
                {isFetchingNextPage && <LoadingSpinner />}
                {!hasNextPage && dentists.length > 0 && (
                  <p className="text-gray-500">No more dentists to load</p>
                )}
              </div>
            </>
          )}
        </Suspense>
      </div>
    </SectionTwo>
  );
}
