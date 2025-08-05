'use server';

import { db } from '@/db';

export async function deleteCategory(id: string) {
  if (!id) throw new Error('Missing category id');
  await db.ratingCategory.delete({ where: { id } });
  return { ok: true };
}
