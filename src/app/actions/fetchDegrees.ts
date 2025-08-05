"use server";

import { db } from "@/db";

export async function fetchDegrees() {
  const degrees = await db.degree.findMany();
  return degrees;
}

export async function fetchDegreeById(id: string) {
  const degree = await db.degree.findUnique({
    where: { id },
  });
  return degree;
}

export async function fetchDegreeByName(name: string) {
  const degree = await db.degree.findMany({
    where: { name: { contains: name } },
  });
  return degree;
}
