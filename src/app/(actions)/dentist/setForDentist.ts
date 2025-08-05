'use server';
import { db } from "@/db";

/**
 * Replace the dentist's feature list with `featureIds`.
 * Runs in a single transaction.
 */
export async function setDentistFeatures(
  dentistId: string,
  featureIds: string[],
) {
  await db.$transaction([
    db.dentistFeature.deleteMany({ where: { dentistId } }),
    db.dentistFeature.createMany({
      data: featureIds.map((id) => ({ dentistId, featureId: id })),
    }),
  ]);
  return { ok: true };
}
