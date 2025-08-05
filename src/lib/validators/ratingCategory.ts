import { z } from 'zod';

export const ratingCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'At least 2 chars')
    .max(40)
    .regex(/^[A-Z0-9_]+$/, 'Use UPPERCASE and _ only (e.g. WAITING_TIME)'),
  label: z.string().trim().min(2).max(60),
});

export type RatingCategoryInput = z.infer<typeof ratingCategorySchema>;
