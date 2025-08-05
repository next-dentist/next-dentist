"use server";

import { db } from "@/db";

export async function fetchFilteredMeta(dentistId: string) {
  const currentDentistTreatments = await db.treatments.findMany({
    where: {
      dentistId: dentistId,
    },
  });

  const treatmentMeta = await db.treatmentMeta.findMany({
    where: {
      id: {
        notIn: currentDentistTreatments.map(
          (treatment) => treatment.TreatmentMetaId
        ) as string[],
      },
    },
  });

  return treatmentMeta;
}
