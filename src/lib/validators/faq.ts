import { z } from 'zod';

export const faqCreateSchema = z.object({
  dentistId: z.string().cuid(),
  question:  z.string().trim().min(5).max(500),
  answer:    z.string().trim().min(5).max(4000),
});

export const faqUpdateSchema = faqCreateSchema.extend({
  id: z.string().cuid(),
  order: z.number().int().optional(),
});

export type FaqCreateInput = z.infer<typeof faqCreateSchema>;
export type FaqUpdateInput = z.infer<typeof faqUpdateSchema>;
