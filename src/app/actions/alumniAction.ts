'use server'

import { db } from '@/db';
import { z } from 'zod';

const alumniSchema = z.object({
  "@type": z.literal("CollegeOrUniversity"),
  name: z.string().min(1, "Institution name is required"),
  sameAs: z.string().url("Please enter a valid URL"),
});

type AlumniInput = z.infer<typeof alumniSchema>;

function isValidAlumni(obj: unknown): obj is AlumniInput {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '@type' in obj &&
    obj['@type'] === 'CollegeOrUniversity' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'sameAs' in obj &&
    typeof obj.sameAs === 'string'
  );
}

export async function createAlumni(dentistId: string, alumniData: AlumniInput[]) {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { alumniOf: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    const updatedDentist = await db.dentist.update({
      where: { id: dentistId },
      data: { alumniOf: alumniData as any },
    });

    return { success: true, data: alumniData };
  } catch (error) {
    console.error('Error creating alumni:', error);
    return { success: false, error: 'Failed to create alumni' };
  }
}

export async function readAlumni(dentistId: string) {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { alumniOf: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    let alumni: AlumniInput[] = [];
    try {
      if (Array.isArray(dentist.alumniOf)) {
        alumni = dentist.alumniOf
          .filter(isValidAlumni)
          .map((alumni: AlumniInput) => ({
            "@type": "CollegeOrUniversity",
            name: alumni.name,
            sameAs: alumni.sameAs
          }));
      }
    } catch (e) {
      console.error("Error parsing alumni:", e);
    }

    return { success: true, data: alumni };
  } catch (error) {
    console.error('Error reading alumni:', error);
    return { success: false, error: 'Failed to read alumni' };
  }
}

export async function deleteAlumni(dentistId: string, alumniId: string) {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { alumniOf: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    let currentAlumni: AlumniInput[] = [];
    try {
      if (Array.isArray(dentist.alumniOf)) {
        currentAlumni = dentist.alumniOf
          .filter(isValidAlumni)
          .map((alumni: AlumniInput) => ({
            "@type": "CollegeOrUniversity",
            name: alumni.name,
            sameAs: alumni.sameAs
          }));
      }
    } catch (e) {
      console.error("Error parsing existing alumni:", e);
    }

    const updatedAlumni = currentAlumni.filter(alumni => alumni.name !== alumniId);

    const updatedDentist = await db.dentist.update({
      where: { id: dentistId },
      data: { alumniOf: updatedAlumni as any },
    });

    return { success: true, data: updatedDentist.alumniOf };
  } catch (error) {
    console.error('Error deleting alumni:', error);
    return { success: false, error: 'Failed to delete alumni' };
  }
} 