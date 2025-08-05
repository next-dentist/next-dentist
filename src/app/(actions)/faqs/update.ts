'use server';
import { db } from '@/db';
import { faqUpdateSchema } from '@/lib/validators/faq';

export async function updateFaq(_: unknown, fd: FormData) {
  const data = faqUpdateSchema.parse(Object.fromEntries(fd));

  return db.fAQ.update({
    where: { id: data.id },
    data: {
      question: data.question,
      answer: data.answer,
      updatedAt: new Date(),
    },
  });
}
