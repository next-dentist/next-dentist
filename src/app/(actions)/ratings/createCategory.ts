'use server';

import { db } from '@/db';
import { ratingCategorySchema } from '@/lib/validators/ratingCategory';

export async function createCategory(_: unknown, fd: FormData) {
  const payload = Object.fromEntries(fd) as Record<string, string>;
  const data = ratingCategorySchema.parse(payload);

  // unique name check is handled by Prisma unique constraint,
  // but you can catch & translate P2002 to a nicer message:
  try {
    const category = await db.ratingCategory.create({ data });
    return { id: category.id, name: category.name, label: category.label };
  } catch (e: any) {
    if (e.code === 'P2002') {
      throw new Error('Name already exists');
    }
    throw e;
  }
}

