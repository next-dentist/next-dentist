'use server';
import { db } from '@/db';
import { z } from 'zod';

// Define the schema for awards using zod
const awardSchema = z.object({
  "@type": z.literal("Award"),
  name: z.string().min(1, "Award name is required"),
  dateAwarded: z.string().min(1, "Date awarded is required"),
});

type AwardInput = z.infer<typeof awardSchema>;

function isValidAward(obj: unknown): obj is AwardInput {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '@type' in obj &&
    obj['@type'] === 'Award' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'dateAwarded' in obj &&
    typeof obj.dateAwarded === 'string'
  );
}

// Create a new award entry
export async function createAward(dentistId: string, awardData: AwardInput[]) {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { awards: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    // Instead of appending to existing awards, we'll replace them with the new array
    const updatedDentist = await db.dentist.update({
      where: { id: dentistId },
      data: { awards: awardData as any },
    });

    return { success: true, data: awardData };
  } catch (error) {
    console.error('Error creating award:', error);
    return { success: false, error: 'Failed to create award' };
  }
}

// Read awards for a specific dentist
export async function readAwards(dentistId: string) {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { awards: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    let awards: AwardInput[] = [];
    try {
      if (Array.isArray(dentist.awards)) {
        awards = dentist.awards
          .filter(isValidAward)
          .map(award => ({
            "@type": "Award",
            name: award.name,
            dateAwarded: award.dateAwarded
          }));
      }
    } catch (e) {
      console.error("Error parsing awards:", e);
    }

    return { success: true, data: awards };
  } catch (error) {
    console.error('Error reading awards:', error);
    return { success: false, error: 'Failed to read awards' };
  }
}

// Update an award for a specific dentist
export async function updateAward(dentistId: string, awardId: string, awardData: AwardInput) {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { awards: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    let currentAwards: AwardInput[] = [];
    try {
      if (Array.isArray(dentist.awards)) {
        currentAwards = dentist.awards
          .filter(isValidAward)
          .map(award => ({
            "@type": "Award",
            name: award.name,
            dateAwarded: award.dateAwarded
          }));
      }
    } catch (e) {
      console.error("Error parsing existing awards:", e);
    }

    const updatedAwards = currentAwards.map(award => 
      award.name === awardId ? awardData : award
    );

    const updatedDentist = await db.dentist.update({
      where: { id: dentistId },
      data: { awards: updatedAwards as any },
    });

    return { success: true, data: updatedDentist.awards };
  } catch (error) {
    console.error('Error updating award:', error);
    return { success: false, error: 'Failed to update award' };
  }
}

// Delete an award for a specific dentist
export async function deleteAward(dentistId: string, awardId: string) {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { awards: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    let currentAwards: AwardInput[] = [];
    try {
      if (Array.isArray(dentist.awards)) {
        currentAwards = dentist.awards
          .filter(isValidAward)
          .map(award => ({
            "@type": "Award",
            name: award.name,
            dateAwarded: award.dateAwarded
          }));
      }
    } catch (e) {
      console.error("Error parsing existing awards:", e);
    }

    const updatedAwards = currentAwards.filter(award => award.name !== awardId);

    const updatedDentist = await db.dentist.update({
      where: { id: dentistId },
      data: { awards: updatedAwards as any },
    });

    return { success: true, data: updatedDentist.awards };
  } catch (error) {
    console.error('Error deleting award:', error);
    return { success: false, error: 'Failed to delete award' };
  }
}
