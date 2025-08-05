'use server';
import { db } from "@/db";

/**
 * Replace dentist’s feature list with `featureIds` array.
 */
export async function setDentistFeatures(
  dentistId: string,
  featureIds: string[],
) {
  await db.dentist.update({
    where: { id: dentistId },
    data: {
      features: {
        deleteMany: {},                         // clear existing
        createMany: { data: featureIds.map((f) => ({ featureId: f })) },
      },
    },
  });
}
