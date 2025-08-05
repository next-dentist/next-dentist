'use server';
import { db } from "@/db";

export async function listAllFeatures() {
  return db.feature.findMany({ orderBy: { label: 'asc' } });
}
