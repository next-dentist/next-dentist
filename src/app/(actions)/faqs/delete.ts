'use server';
import { db } from '@/db';

/** Delete row and re-compact orders */
export async function deleteFaq(id: string) {
  const faq = await db.fAQ.delete({ where: { id } });

  // re-index remaining FAQs for that dentist
  const faqs = await db.fAQ.findMany({
    where: { dentistId: faq.dentistId },
    orderBy: { createdAt: 'asc' },
  });

  await Promise.all(
    faqs.map((f, idx) =>
      db.fAQ.update({ where: { id: f.id }, data: { createdAt: new Date() } }),
    ),
  );
  return { ok: true };
  
}
