'use server';
import { db } from '@/db';

/**
 * Return overall average + per-category averages + total count
 */
export async function dentistSummary(dentistId: string) {
  // 1) all rating dimensions
  const cats = await db.ratingCategory.findMany({ orderBy: { name: 'asc' } });

  // 2) overall is already denormalised on Dentist

  const reviewsCount = await db.review.count({
    where: { dentistId, status: 'APPROVED' },
  });

  const dentist = await db.dentist.findUnique({
    where: { id: dentistId },
    include: {
      Reviews: {
        where: { status: 'APPROVED' },
      },
    },
  });

  // 3) per-category averages (one query instead of N)
  const perCat = await db.reviewRating.groupBy({
    by: ['categoryId'],
    _avg: { value: true },
    where: {
      categoryId: { in: cats.map((c) => c.id) },
      review: { dentistId, status: 'APPROVED' },
    },
  });

  const map = Object.fromEntries(
    perCat.map((p) => [p.categoryId, p._avg.value ?? 0]),
  );

  return {
    overall: dentist ?? { averageRating: 0, reviewsCount: 0 },
    categories: cats.map((c) => ({
      id: c.id,
      label: c.label ?? c.name,
      average: map[c.id] ?? 0,
    })),
  };
}
