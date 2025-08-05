'use server';
import { db } from '@/db';

export async function getRatingCategories() {
  return db.ratingCategory.findMany({
    orderBy: { name: 'asc' },
  });
}
