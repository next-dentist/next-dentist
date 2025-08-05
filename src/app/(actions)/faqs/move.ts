'use server';
import { db } from '@/db';

/** Move FAQ up or down (delta = +1 or -1). */
export async function moveFaq(id: string, delta: 1 | -1) {
  const item = await db.fAQ.findUnique({ where: { id } });
  if (!item) throw new Error('Not found');

  const swap = await db.fAQ.findFirst({
    where: {
      dentistId: item.dentistId,
      createdAt: delta === -1 ? { lt: item.createdAt } : { gt: item.createdAt },
    },
    orderBy: { createdAt: delta === -1 ? 'desc' : 'asc' },
  });
  if (!swap) return { ok: true }; // already at edge

  // Swap the createdAt timestamps
  const itemCreatedAt = item.createdAt;
  const swapCreatedAt = swap.createdAt;

  await db.$transaction([
    db.fAQ.update({ where: { id: item.id }, data: { createdAt: swapCreatedAt } }),
    db.fAQ.update({ where: { id: swap.id }, data: { createdAt: itemCreatedAt } }),
  ]);
  return { ok: true };
}
