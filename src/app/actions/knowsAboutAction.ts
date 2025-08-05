'use server'

import { db } from '@/db';
import { z } from 'zod';

const knowsAboutSchema = z.object({
  "@type": z.literal("MedicalSpecialty"),
  name: z.string().min(1, "Specialty name is required"),
  url: z.string().url("Please enter a valid URL"),
});

type KnowsAboutInput = z.infer<typeof knowsAboutSchema>;

function isValidKnowsAbout(obj: unknown): obj is KnowsAboutInput {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '@type' in obj &&
    obj['@type'] === 'MedicalSpecialty' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'url' in obj &&
    typeof obj.url === 'string'
  );
}

export async function createKnowsAbout(dentistId: string, knowsAboutData: KnowsAboutInput[]) {
  try {
    // Validate the input data
    const validationResult = z.array(knowsAboutSchema).safeParse(knowsAboutData);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return { success: false, error: 'Invalid data format: ' + validationResult.error.message };
    }

    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { knowsAbout: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    // Get existing specialties
    let existingKnowsAbout: KnowsAboutInput[] = [];
    try {
      if (Array.isArray(dentist.knowsAbout)) {
        existingKnowsAbout = dentist.knowsAbout.filter(isValidKnowsAbout);
      }
    } catch (e) {
      console.error("Error parsing existing specialties:", e);
    }

    // Merge existing and new specialties, removing duplicates by name
    const mergedKnowsAbout = [...existingKnowsAbout];
    for (const newSpecialty of knowsAboutData) {
      const existingIndex = mergedKnowsAbout.findIndex(specialty => specialty.name === newSpecialty.name);
      if (existingIndex >= 0) {
        mergedKnowsAbout[existingIndex] = newSpecialty;
      } else {
        mergedKnowsAbout.push(newSpecialty);
      }
    }

    // Validate the merged data before saving
    const mergedValidationResult = z.array(knowsAboutSchema).safeParse(mergedKnowsAbout);
    if (!mergedValidationResult.success) {
      console.error('Merged data validation error:', mergedValidationResult.error);
      return { success: false, error: 'Invalid merged data format' };
    }

    try {
      const updatedDentist = await db.dentist.update({
        where: { id: dentistId },
        data: { knowsAbout: mergedKnowsAbout },
      });

      return { success: true, data: mergedKnowsAbout };
    } catch (dbError) {
      console.error('Database error:', dbError);
      return { success: false, error: 'Failed to update database' };
    }
  } catch (error) {
    console.error('Error creating specialties:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid data format: ' + error.message };
    }
    return { success: false, error: 'Failed to create specialties' };
  }
}

export async function readKnowsAbout(dentistId: string) {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { knowsAbout: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    let knowsAbout: KnowsAboutInput[] = [];
    try {
      if (Array.isArray(dentist.knowsAbout)) {
        knowsAbout = dentist.knowsAbout
          .filter(isValidKnowsAbout)
          .map(specialty => ({
            "@type": "MedicalSpecialty",
            name: specialty.name,
            url: specialty.url
          }));
      }
    } catch (e) {
      console.error("Error parsing specialties:", e);
    }

    return { success: true, data: knowsAbout };
  } catch (error) {
    console.error('Error reading specialties:', error);
    return { success: false, error: 'Failed to read specialties' };
  }
}

export async function deleteKnowsAbout(dentistId: string, specialtyName: string) {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { knowsAbout: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    let currentKnowsAbout: KnowsAboutInput[] = [];
    try {
      if (Array.isArray(dentist.knowsAbout)) {
        currentKnowsAbout = dentist.knowsAbout
          .filter(isValidKnowsAbout)
          .map(specialty => ({
            "@type": "MedicalSpecialty",
            name: specialty.name,
            url: specialty.url
          }));
      }
    } catch (e) {
      console.error("Error parsing existing specialties:", e);
    }

    const updatedKnowsAbout = currentKnowsAbout.filter(specialty => specialty.name !== specialtyName);

    const updatedDentist = await db.dentist.update({
      where: { id: dentistId },
      data: { knowsAbout: updatedKnowsAbout as any },
    });

    return { success: true, data: updatedDentist.knowsAbout };
  } catch (error) {
    console.error('Error deleting specialty:', error);
    return { success: false, error: 'Failed to delete specialty' };
  }
} 