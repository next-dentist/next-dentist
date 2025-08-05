'use server'

import { db } from '@/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const costPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
  imageAlt: z.string().min(1).optional(),
  seoTitle: z.string().min(1).optional(),
  seoDescription: z.string().min(1).optional(),
  seoExtra: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      try {
        return JSON.parse(val);
      } catch (error) {
        return {};
      }
    }),
  relatedKeys: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      try {
        return JSON.parse(val);
      } catch (error) {
        return [];
      }
    }),
  city: z.string().optional(),
});

type CostPageInput = z.infer<typeof costPageSchema>;

//create cost page
export const createCostPage = async (formData: FormData) => {
  try {
    const raw = Object.fromEntries(formData);
    const parseResult = costPageSchema.safeParse(raw);


    if (!parseResult.success) {
      return { error: parseResult.error.message };
    }

    // create cost page
    const data: CostPageInput = parseResult.data;

    // Check if slug already exists
    const existingPage = await db.costPages.findUnique({
      where: { slug: data.slug },
    });

    if (existingPage) {
      return { error: 'A cost page with this slug already exists' };
    }

    const costPage = await db.costPages.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content || '',
        image: data.image || '',
        imageAlt: data.imageAlt || '',
        seoTitle: data.seoTitle || '',
        seoDescription: data.seoDescription || '',
        seoExtra: data.seoExtra || {},
        relatedKeys: data.relatedKeys || [],
        city: data.city || '',
      }
    });

    revalidatePath('/admin/cost-pages');
    return costPage;
  } catch (error) {
    console.error('Error creating cost page:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
}

// update cost page
export const updateCostPage = async (formData: FormData, id: string) => {
  try {
    const raw = Object.fromEntries(formData);
    const parseResult = costPageSchema.safeParse(raw);

    if (!parseResult.success) {
      return { error: parseResult.error.message };
    }

    const data:CostPageInput = parseResult.data;

    const costPage = await db.costPages.update({
      where: { id },
      data,
    });

    revalidatePath('/admin/cost-pages');
    return costPage;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
}

// delete cost page
export const deleteCostPage = async (id: string) => {
  try {
    await db.costPages.delete({ where: { id } });
    revalidatePath('/admin/cost-pages');
    return { success: 'Cost page deleted successfully' }; 
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
}

// fetch all cost pages
export const fetchAllCostPages = async () => {
  try {
    const costPages = await db.costPages.findMany();
    return costPages;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
}

// fetch cost page by id
export const fetchCostPageById = async (id: string) => {
  try {
    const costPage = await db.costPages.findUnique({ where: { id } });
    return costPage;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
}

// fetch cost page by slug
export const fetchCostPageBySlug = async (slug: string) => {
  try {
    const costPage = await db.costPages.findUnique({ where: { slug } });
    return costPage;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  }
}



