'use server';

import { db } from '@/db';

export async function getCostPageBySlug(slug: string) {
  if (!slug?.trim()) {
    return null;
  }

  try {
    const costPage = await db.costPages.findUnique({
      where: { slug },
      include: {
        costTables: true,
        CostSection: true,
        costImages: true,
        CostVideo: true,
        faqs: true,
        tableSets: true,
        TreatmentMeta: true,
      },
    });
    
    if (costPage) {
      console.log('getCostPageBySlug: Found cost page with city:', costPage.city);
    }
    
    return costPage;
  } catch (error: unknown) {
    console.error('Error in getCostPageBySlug:', error);
    return null;
  }
}
