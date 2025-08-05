'use client';

import { createReview } from '@/app/(actions)/reviews/create';
import { getRatingCategories } from '@/app/(actions)/reviews/getCategories';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ReviewInput, reviewSchema } from '@/lib/validators/review';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import StarSelector from './StarSelector';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  onClose,
  reviewData,
}: {
  isOpen: boolean;
  onClose: () => void;
  reviewData: { rating: number; reviewerName: string; title?: string } | null;
}) {
  if (!isOpen || !reviewData) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="bg-popover w-full max-w-md rounded-2xl shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h2 className="text-popover-foreground text-xl font-semibold">
                Review Submitted Successfully!
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <div className="text-sm text-green-700">
                  <p className="font-medium">Thank you for your review!</p>
                  <p className="mt-1">
                    Your review has been submitted and is awaiting approval from
                    our moderation team.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-foreground mb-3 text-sm font-medium">
                Review Summary
              </h3>
              <div className="text-muted-foreground space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < reviewData.rating ? 'text-primary' : 'text-muted'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-foreground ml-1 font-medium">
                      ({reviewData.rating}/5)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Reviewer:</span>
                  <span className="text-foreground font-medium">
                    {reviewData.reviewerName}
                  </span>
                </div>
                {reviewData.title && (
                  <div className="flex justify-between">
                    <span>Title:</span>
                    <span className="text-foreground max-w-48 truncate text-right font-medium">
                      "{reviewData.title}"
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="border-primary/20 bg-primary/10 rounded-lg border p-4">
              <h3 className="text-primary mb-2 text-sm font-medium">
                What happens next?
              </h3>
              <ul className="text-primary/80 space-y-1 text-sm">
                <li>• Your review will be reviewed by our moderation team</li>
                <li>• This typically takes 1-2 business days</li>
                <li>
                  • Once approved, it will appear on the dentist's profile
                </li>
                <li>
                  • You'll receive an email confirmation when it's published
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button onClick={onClose} className="flex-1">
              Got it, thanks!
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                // Optional: Add logic to view dentist profile or write another review
              }}
              className="flex-1"
            >
              View Dentist Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewComposer({ dentistId }: { dentistId: string }) {
  const qc = useQueryClient();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedReviewData, setSubmittedReviewData] = useState<{
    rating: number;
    reviewerName: string;
    title?: string;
  } | null>(null);

  // ------------- fetch categories once ----------------------------------
  const { data: categories = [] } = useQuery({
    queryKey: ['ratingCategories'],
    queryFn: getRatingCategories,
    staleTime: Infinity,
  });

  // ------------- form ----------------------------------------------------
  const form = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      dentistId,
      rating: 0,
      subratings: categories.map(c => ({
        categoryId: c.id,
        value: 0,
      })),
    },
  });

  const { control, formState, reset, setValue } = form;
  const { errors, isSubmitting } = formState;

  // keep subratings array in sync when categories arrive
  useEffect(() => {
    setValue(
      'subratings',
      categories.map(c => ({ categoryId: c.id, value: 0 }))
    );
  }, [categories, setValue]);

  // ------------- mutation -----------------------------------------------
  const { mutate } = useMutation({
    mutationFn: async (data: ReviewInput) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        fd.append(k, k === 'subratings' ? JSON.stringify(v) : String(v ?? ''));
      });
      return createReview(null, fd);
    },
    onSuccess: (_, variables) => {
      // Store review data for confirmation modal
      setSubmittedReviewData({
        rating: variables.rating,
        reviewerName: variables.reviewerName,
        title: variables.title,
      });

      // Show confirmation modal
      setShowConfirmation(true);

      // Keep the toast for immediate feedback
      toast.success('Review submitted! Awaiting approval.');

      // Reset form
      reset();

      // Invalidate queries
      qc.invalidateQueries({ queryKey: ['reviews', dentistId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setSubmittedReviewData(null);
  };

  // ------------- render --------------------------------------------------
  return (
    <>
      <Card className="rounded-4xl">
        <CardHeader>
          <CardTitle>Write a review</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(data => mutate(data))}
              className="space-y-6"
            >
              {/* overall rating --------------------------------------------------- */}
              <FormField
                control={control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <p className="mb-1 text-sm font-medium">Overall rating</p>
                    <FormControl>
                      <StarSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* dynamic sub-ratings --------------------------------------------- */}
              {categories.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {categories.map((cat, idx) => (
                    <FormField
                      key={cat.id}
                      control={control}
                      name={`subratings.${idx}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <p className="mb-1 text-sm">
                            {cat.label ?? cat.name}
                          </p>
                          <FormControl>
                            <StarSelector
                              value={field.value}
                              onChange={field.onChange}
                              size={20}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              )}

              {/* text inputs ------------------------------------------------------ */}
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Short headline (optional)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Describe your experience…"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4 sm:flex-row">
                <FormField
                  control={control}
                  name="reviewerName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Your name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="reviewerEmail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Email (optional)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting…' : 'Submit review'}
              </Button>
            </form>
          </Form>
        </CardContent>
        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={handleCloseConfirmation}
          reviewData={submittedReviewData}
        />
      </Card>
    </>
  );
}
