'use server';
import { db } from "@/db";

export async function listDentistFeatures(dentistId: string) {
  const rows = await db.dentistFeature.findMany({
    where: { dentistId },
    select: { featureId: true },
  });
  return rows.map((r) => r.featureId); // array of IDs
}
