'use server';

import { db } from '@/db';

/** Return ALL categories in deterministic order */
export async function listCategories() {
  return db.ratingCategory.findMany({ orderBy: { name: 'asc' } });
}
