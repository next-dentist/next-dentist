import { z } from 'zod';

export const subRatingSchema = z.object({
  categoryId: z.string().cuid(),
  value: z.coerce.number().int().min(1).max(5),
});

export const reviewSchema = z.object({
  dentistId: z.string().cuid(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(60).optional(),
  body: z.string().min(10).max(1_000),
  reviewerName: z.string().min(2).max(80),
  reviewerEmail: z.string().email().optional(),
  subratings: z.array(subRatingSchema),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
