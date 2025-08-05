'use server';
import { db } from "@/db";
import { CostSectionFormValues, costSectionSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export async function createCostSection(data: CostSectionFormValues) {
  try {
    const validatedData = costSectionSchema.parse(data);
    
    const entries = await Promise.all(
      validatedData.costSections.map(section => 
        db.costSection.create({
          data: {
            ...section,
            costPageId: validatedData.costPageId,
          },
        })
      )
    );

    revalidatePath('/admin/cost-pages');
    return entries;
  } catch (error) {
    console.error('Error creating cost section:', error);
    throw error;
  }
}

export async function getCostPageSectionById(id: string) {
  try {
    const data = await db.costSection.findMany({
      where: {
        costPageId: id,
      },
    });
    return data;
  } catch (error) {
    console.error('Error getting cost section:', error);
    throw error;
  }
}

export async function updateCostSection(
  id: string,
  data: Partial<{
    title: string;
    content: string | null;
    image: string | null;
    imageAlt: string | null;
  }>
) {
  try {
    const updatedEntry = await db.costSection.update({
      where: {
        id: id,
      },
      data,
    });

    revalidatePath('/admin/cost-pages');
    return updatedEntry;
  } catch (error) {
    console.error('Error updating cost section:', error);
    throw error;
  }
}

export async function deleteCostSection(id: string) {
  try {
    await db.costSection.delete({
      where: {
        id: id,
      },
    });
    
    revalidatePath('/admin/cost-pages');
    return { message: "Cost section deleted successfully" };
  } catch (error) {
    console.error('Error deleting cost section:', error);
    throw error;
  }
}





