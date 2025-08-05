'use server'

import { db } from '@/db';
import { z } from 'zod';

const workingAtSchema = z.object({
  "@type": z.literal("Organization"),
  name: z.string().min(1, "Organization name is required"),
  sameAs: z.string().url("Please enter a valid URL"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

type WorkingAtInput = z.infer<typeof workingAtSchema>;

function isValidWorkingAt(obj: unknown): obj is WorkingAtInput {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '@type' in obj &&
    obj['@type'] === 'Organization' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'sameAs' in obj &&
    typeof obj.sameAs === 'string' &&
    'position' in obj &&
    typeof obj.position === 'string' &&
    'startDate' in obj &&
    typeof obj.startDate === 'string'
  );
}

export async function createWorkingAt(dentistId: string, workingAtData: WorkingAtInput[]) {
  try {
    // Validate the input data
    const validationResult = z.array(workingAtSchema).safeParse(workingAtData);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return { success: false, error: 'Invalid data format: ' + validationResult.error.message };
    }

    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { workingAt: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    // Get existing working places
    let existingWorkingAt: WorkingAtInput[] = [];
    try {
      if (Array.isArray(dentist.workingAt)) {
        existingWorkingAt = dentist.workingAt.filter(isValidWorkingAt);
      }
    } catch (e) {
      console.error("Error parsing existing working places:", e);
    }

    // Merge existing and new working places, removing duplicates by name
    const mergedWorkingAt = [...existingWorkingAt];
    for (const newPlace of workingAtData) {
      const existingIndex = mergedWorkingAt.findIndex(place => place.name === newPlace.name);
      if (existingIndex >= 0) {
        mergedWorkingAt[existingIndex] = newPlace;
      } else {
        mergedWorkingAt.push(newPlace);
      }
    }

    // Validate the merged data before saving
    const mergedValidationResult = z.array(workingAtSchema).safeParse(mergedWorkingAt);
    if (!mergedValidationResult.success) {
      console.error('Merged data validation error:', mergedValidationResult.error);
      return { success: false, error: 'Invalid merged data format' };
    }

    try {
      const updatedDentist = await db.dentist.update({
        where: { id: dentistId },
        data: { workingAt: mergedWorkingAt },
      });

      return { success: true, data: mergedWorkingAt };
    } catch (dbError) {
      console.error('Database error:', dbError);
      return { success: false, error: 'Failed to update database' };
    }
  } catch (error) {
    console.error('Error creating working places:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid data format: ' + error.message };
    }
    return { success: false, error: 'Failed to create working places' };
  }
}

export async function readWorkingAt(dentistId: string) {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { workingAt: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    let workingAt: WorkingAtInput[] = [];
    try {
      if (Array.isArray(dentist.workingAt)) {
        workingAt = dentist.workingAt
          .filter(isValidWorkingAt)
          .map(place => ({
            "@type": "Organization",
            name: place.name,
            sameAs: place.sameAs,
            position: place.position,
            startDate: place.startDate,
            endDate: place.endDate
          }));
      }
    } catch (e) {
      console.error("Error parsing working places:", e);
    }

    return { success: true, data: workingAt };
  } catch (error) {
    console.error('Error reading working places:', error);
    return { success: false, error: 'Failed to read working places' };
  }
}

export async function deleteWorkingAt(dentistId: string, workingAtId: string) {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { workingAt: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    let currentWorkingAt: WorkingAtInput[] = [];
    try {
      if (Array.isArray(dentist.workingAt)) {
        currentWorkingAt = dentist.workingAt
          .filter(isValidWorkingAt)
          .map(place => ({
            "@type": "Organization",
            name: place.name,
            sameAs: place.sameAs,
            position: place.position,
            startDate: place.startDate,
            endDate: place.endDate
          }));
      }
    } catch (e) {
      console.error("Error parsing existing working places:", e);
    }

    const updatedWorkingAt = currentWorkingAt.filter(place => place.name !== workingAtId);

    const updatedDentist = await db.dentist.update({
      where: { id: dentistId },
      data: { workingAt: updatedWorkingAt as any },
    });

    return { success: true, data: updatedDentist.workingAt };
  } catch (error) {
    console.error('Error deleting working place:', error);
    return { success: false, error: 'Failed to delete working place' };
  }
} 