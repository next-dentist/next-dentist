'use server';

import { db } from '@/db';
import { ReviewInput, reviewSchema } from '@/lib/validators/review';

export async function createReview(_: unknown, formData: FormData) {
  // -------- 1) zod validation -------------------------------------------
  const payload: any = {};
  formData.forEach((v, k) => (payload[k] = v));
  payload.rating = Number(payload.rating);
  payload.subratings = JSON.parse(payload.subratings ?? '[]');

  const data = reviewSchema.parse(payload) as ReviewInput;

  // -------- 2) main Review row ------------------------------------------
  const review = await db.review.create({
    data: {
      rating: data.rating,
      title: data.title,
      body: data.body,
      reviewerName: data.reviewerName,
      reviewerEmail: data.reviewerEmail,
      dentistId: data.dentistId,
      status: 'PENDING', // moderation gate
    },
  });

  // -------- 3) granular scores (bulk create) ----------------------------
  if (data.subratings.length) {
    await db.reviewRating.createMany({
      data: data.subratings.map(s => ({
        value: s.value,
        reviewId: review.id,
        categoryId: s.categoryId,
      })),
    });
  }

  // TODO: send Slack / email to admin for moderation

  return { ok: true };
}
