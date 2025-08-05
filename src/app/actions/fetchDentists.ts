"use server";

import { db } from "@/db";

export async function fetchDentists() {
  const dentists = await db.dentist.findMany({
    include: {
      images: true,
    },
  });
  return dentists;
}

export async function fetchDentistsByCity(
  city: string,
  page: number = 1,
  pageSize: number = 10
) {
  const skip = (page - 1) * pageSize;

  const [dentists, totalCount] = await Promise.all([
    db.dentist.findMany({
      where: { city },
      skip,
      take: pageSize,
    }),
    db.dentist.count({
      where: { city },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    dentists,
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

export async function getDentistBySlug(slug: string) {
  const dentist = await db.dentist.findUnique({
    where: { slug },
    include: {
      images: true,
      languages: true,
      messages: true,
      post: true,
      Reviews: true,
      TreatmentsReviews: true,
      specializations: true,
      faq: true,

    },
  });
  return dentist;
}

export async function getDentistByUserId(userId: string) {
  const dentist = await db.dentist.findMany({
    where: { userId },
    include: {
      images: true,
    },
  });
  return dentist;
}

export async function getDentistById(id: string) {
  const dentist = await db.dentist.findUnique({
    where: { id },
    include: {
      images: true,
      languages: true,
      messages: true,
      post: true,
      Reviews: true,
      TreatmentsReviews: true,
      specializations: true,
      faq: true,

    },
  });
  return dentist;
}
