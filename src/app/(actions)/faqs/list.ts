'use server';
import { db } from "@/db";

/** All FAQs for one dentist, ordered ASC */
export async function listFaqs(dentistId: string) {
  return db.fAQ.findMany({
    where: { dentistId },
    orderBy: { createdAt: 'asc' },
  });
}
