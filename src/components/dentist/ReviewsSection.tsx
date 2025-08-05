'use client';

import { dentistPageReviews } from '@/app/(actions)/reviews/dentistPage';
import { dentistSummary } from '@/app/(actions)/reviews/dentistSummary';
import ReviewComposer from '@/components/ReviewComposer';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { PenLine } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import RatingStars from './RatingStars';
import ReviewCard from './ReviewCard';

const PAGE_SIZE = 6;

export default function ReviewsSection({ dentistId }: { dentistId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  /* ---------- 1. summary ------------------------------------------------ */
  const { data: summary } = useQuery({
    queryKey: ['dentistSummary', dentistId],
    queryFn: () => dentistSummary(dentistId),
  });

  /* ---------- 2. paginated reviews ------------------------------------- */
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['dentistReviews', dentistId],
      queryFn: ({ pageParam = 1 }) =>
        dentistPageReviews(dentistId, pageParam as number, PAGE_SIZE),
      getNextPageParam: (lastPage, allPages) => {
        const loaded = allPages.flatMap(page => page.reviews).length;
        return loaded < lastPage.total ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });

  /* ---------- 3. intersection observer for auto-load ------------------- */
  const loadMoreRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;

    const io = new IntersectionObserver(
      entries => entries[0].isIntersecting && fetchNextPage(),
      { rootMargin: '200px' }
    );

    io.observe(loadMoreRef.current);
    return () => io.disconnect();
  }, [hasNextPage, fetchNextPage]);

  /* ---------- Render ---------------------------------------------------- */
  return (
    <section id="reviews" className="space-y-8">
      {/* Header with Write Review Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Patient Reviews</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" variant="outline">
              <PenLine className="h-4 w-4" />
              Write a Review
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Please share your experience with this dentist.
            </DialogDescription>
            <ReviewComposer dentistId={dentistId} />
          </DialogContent>
        </Dialog>
      </div>

      {/* summary */}
      {summary && (
        <Card className="shadow-sm">
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="text-5xl font-bold">
                {(summary.overall as any)?.rating?.toFixed(1) ||
                  (summary.overall as any)?.averageRating?.toFixed(1) ||
                  '0.0'}
              </div>
              <div className="space-y-1">
                <RatingStars
                  value={
                    (summary.overall as any)?.rating ||
                    (summary.overall as any)?.averageRating ||
                    0
                  }
                  size={20}
                />
                <p className="text-sm text-gray-500">
                  {(summary.overall as any)?.Reviews?.length ||
                    (summary.overall as any)?.reviewsCount ||
                    0}{' '}
                  reviews
                </p>
              </div>
            </div>

            {/* per category bars */}
            {summary.categories && summary.categories.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {summary.categories.map((category: any) => (
                  <div key={category.id} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span>{category.label}</span>
                      <span>{category.average.toFixed(1)}</span>
                    </div>
                    <div className="h-2 w-full rounded bg-gray-200">
                      <div
                        className="h-full rounded bg-amber-400"
                        style={{ width: `${(category.average / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* list of reviews */}
      <div className="space-y-6">
        {data?.pages && data.pages.length > 0 ? (
          data.pages
            .flatMap((page: any) => page.reviews)
            .map((review: any) => (
              <ReviewCard key={review.id} review={review} />
            ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No reviews yet for this dentist.</p>
            <p className="mt-2 text-sm text-gray-400">
              Be the first to leave a review!
            </p>
          </div>
        )}

        {hasNextPage && (
          <Button
            ref={loadMoreRef}
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mx-auto block rounded border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                Loading more reviews...
              </div>
            ) : (
              'Load more reviews'
            )}
          </Button>
        )}
      </div>

      {/* Empty state when no data is loading */}
      {!data && !summary && (
        <div className="py-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="mx-auto h-8 w-48 rounded bg-gray-200" />
            <div className="mx-auto h-4 w-32 rounded bg-gray-200" />
          </div>
          <p className="mt-4 text-gray-500">Loading reviews...</p>
        </div>
      )}
    </section>
  );
}
