'use server';
import { db } from '@/db';

export async function dentistPageReviews(
  dentistId: string,
  page = 1,
  pageSize = 6,
) {
  const reviews = await db.review.findMany({
    where: { dentistId, status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      subratings: {
        include: { category: true },
      },
    },
  });

  const total = await db.review.count({
    where: { dentistId, status: 'APPROVED' },
  });

  return { reviews, total };
}
