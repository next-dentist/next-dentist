'use server';

import { db } from '@/db';
import { costFaqSchema } from '@/schemas';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Helper function to revalidate the relevant path
function revalidateCostFAQsPath() {
  revalidatePath('/cost-faqs');
}

// Create a new Cost FAQ
export async function createCostFAQ(costPageId: string, data: z.infer<typeof costFaqSchema>) {
  try {
    const validatedData = costFaqSchema.parse(data);
    const newFAQ = await db.costFAQ.create({
      data: {
        ...validatedData,
        costPageId,
      },
    });
    revalidateCostFAQsPath();  // Revalidate after successful creation
    return newFAQ;
  } catch (error) {
    console.error('Error creating Cost FAQ:', error);
    throw new Error('Failed to create Cost FAQ: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Read a Cost FAQ by ID
export async function getCostFAQById(id: string) {
  try {
    const faq = await db.costFAQ.findUnique({
      where: { id },
    });
    if (!faq) {
      throw new Error('Cost FAQ not found');
    }
    return faq;
  } catch (error) {
    console.error('Error fetching Cost FAQ by ID:', error);
    throw new Error('Failed to fetch Cost FAQ: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Read Cost FAQs by Cost Page ID
export async function getCostFAQsByCostPageId(costPageId: string) {
  try {
    const faqs = await db.costFAQ.findMany({
      where: { costPageId },
    });
    return faqs;
  } catch (error) {
    console.error('Error fetching Cost FAQs by Cost Page ID:', error);
    throw new Error('Failed to fetch Cost FAQs: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Update a Cost FAQ by ID
export async function updateCostFAQ(costPageId: string, id: string, data: z.infer<typeof costFaqSchema>) {
  try {
    const validatedData = costFaqSchema.parse(data);
    const updatedFAQ = await db.costFAQ.update({
      where: { id },
      data: {
        ...validatedData,
        costPageId,
      },
    });
    revalidateCostFAQsPath();  // Revalidate after successful update
    return updatedFAQ;
  } catch (error) {
    console.error('Error updating Cost FAQ:', error);
    throw new Error('Failed to update Cost FAQ: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Delete a Cost FAQ by ID
export async function deleteCostFAQ(id: string) {
  try {
    await db.costFAQ.delete({
      where: { id },
    });
    revalidateCostFAQsPath();  // Revalidate after successful deletion
  } catch (error) {
    console.error('Error deleting Cost FAQ:', error);
    throw new Error('Failed to delete Cost FAQ: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}
