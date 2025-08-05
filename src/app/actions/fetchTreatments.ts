"use server";

import { db } from "@/db";

export async function fetchTreatments(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;

  const [treatments, totalCount] = await Promise.all([
    db.treatmentMeta.findMany({
      skip,
      take: pageSize,
    }),
    db.treatmentMeta.count(),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    treatments,
    pagination: {
      currentPage: page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function fetchTreatmentsMeta() {
  try {
    const treatments = await db.treatmentMeta.findMany();
    return { success: true, data: treatments };
  } catch (error) {
    console.error("Error fetching treatment meta data:", error);
    return {
      success: false,
      error: "Failed to fetch treatments",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
