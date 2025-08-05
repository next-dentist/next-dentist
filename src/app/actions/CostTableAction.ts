'use server';
import { db } from "@/db";
import { CostTableFormValues, costTableSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export async function createCostTable(data: CostTableFormValues) {
  try {
    const validatedData = costTableSchema.parse(data);
    
    const entries = await Promise.all(
      validatedData.costTables.map(table => 
        db.costTable.create({
          data: {
            ...table,
            costPageId: validatedData.costPageId,
            tableSetId: table.tableSetId,
          },
        })
      )
    );

    revalidatePath('/admin/cost-pages');
    return entries;
  } catch (error) {
    console.error('Error creating cost table:', error);
    throw error;
  }
}

export async function getCostPageTableById(id: string) {
  try {
    const data = await db.costTable.findMany({
      where: { costPageId: id },
    });
    return data;
  } catch (error) {
    console.error('Error getting cost table:', error);
    throw error;
  }
}

export async function updateCostTable(id: string, data: Partial<CostTableFormValues>) {
  try {
    const validatedData = costTableSchema.partial().parse(data);
    
    // Extract the first cost table from the array since we're updating a single table
    const tableData = validatedData.costTables?.[0];
    
    if (!tableData) {
      throw new Error('No table data provided for update');
    }

    const updatedEntry = await db.costTable.update({
      where: {
        id: id,
      },
      data: {
        ...tableData,
        costPageId: validatedData.costPageId,
        tableSetId: tableData.tableSetId,
      },
    });

    revalidatePath('/admin/cost-pages');
    return updatedEntry;
  } catch (error) {
    console.error('Error updating cost table:', error);
    throw error;
  }
}

export async function deleteCostTable(id: string) {
  try {
    await db.costTable.delete({
      where: {
        id: id,
      },
    });
    
    revalidatePath('/admin/cost-pages');
    return { message: "Cost table deleted successfully" };
  } catch (error) {
    console.error('Error deleting cost table:', error);
    throw error;
  }
}

export async function createTableSet(data: { name: string; slug: string; costPageId: string }) {
  try {
    const tableSet = await db.costTableSet.create({
      data: {
        name: data.name,
        slug: data.slug,
        costPageId: data.costPageId,
      },
    });

    revalidatePath('/admin/cost-pages');
    return tableSet;
  } catch (error) {
    console.error('Error creating table set:', error);
    throw error;
  }
}

export async function deleteTableSet(id: string) {
  try {
    await db.costTableSet.delete({
      where: {
        id: id,
      },
    });

    revalidatePath('/admin/cost-pages');
    return { message: 'Table set deleted successfully' };
  } catch (error) {
    console.error('Error deleting table set:', error);
    throw error;
  }
}

// edit table set
export async function updateTableSet(id: string, data: { name: string; slug: string }) {
  try {
    const tableSet = await db.costTableSet.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        slug: data.slug,
      },
    });

    revalidatePath('/admin/cost-pages');
    return tableSet;
  } catch (error) {
    console.error('Error updating table set:', error);
    throw error;
  }
}

export async function getTableSetsByCostPageId(costPageId: string) {
  try {
    const tableSets = await db.costTableSet.findMany({
      where: { costPageId },
      include: {
        costTables: true,
      },
    });
    return tableSets;
  } catch (error) {
    console.error('Error getting table sets:', error);
    throw error;
  }
}
