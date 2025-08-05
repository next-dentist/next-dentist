'use server';
import { db } from '@/db';
import { faqCreateSchema } from '@/lib/validators/faq';

/** Append a new FAQ (goes to bottom). */
export async function createFaq(_: unknown, fd: FormData) {
  const data = faqCreateSchema.parse(Object.fromEntries(fd));

  // Get current max order
  const last = await db.fAQ.findFirst({
    where: { dentistId: data.dentistId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true },
  });

  return db.fAQ.create({
    data: { ...data, createdAt: new Date() },
  });
}
