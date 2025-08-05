//  fetchDataForSitemap.ts

import { db } from "@/db";

export async function fetchDataForSitemap() {
  const dentists = await db.dentist.findMany({
    // Use a string literal instead of the enum
    where: {
      status: "verified", // Use the exact string value that matches your schema
    },
    select: {
      id: true,
      name: true,
      slug: true,
      updatedDateAndTime: true,
    },
  });
  const treatments = await db.treatmentMeta.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      updatedDateAndTime: true,
    },
  });


  const blogs = await db.blog.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      updatedAt: true,
    },
  });


  const costPages = await db.costPages.findMany({
    select: {

      slug: true,
      updatedDateAndTime: true,
    },
  });

  return { dentists, treatments, blogs, costPages };
}


