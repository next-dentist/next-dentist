'use server';

import { db } from '@/db';
import { ratingCategorySchema } from '@/lib/validators/ratingCategory';

export async function updateCategory(
  _: unknown,
  fd: FormData
) {
  const payload = Object.fromEntries(fd) as Record<string, string>;
  const { id, ...rest } = payload;
  if (!id) throw new Error('Missing category id');

  const data = ratingCategorySchema.parse(rest);

  try {
    const category = await db.ratingCategory.update({
      where: { id },
      data,
    });
    return category;
  } catch (e: any) {
    if (e.code === 'P2002') throw new Error('Name already exists');
    throw e;
  }
}
