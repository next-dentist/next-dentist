'use server'

import { db } from '@/db';
import { z } from 'zod';

const timeZoneSchema = z.object({
  timezone: z.string().min(1, "Timezone is required"),
});

type TimeZoneInput = z.infer<typeof timeZoneSchema>;

export async function updateTimeZone(dentistId: string, timezone: string) {
  try {
    // Validate the input data
    const validationResult = timeZoneSchema.safeParse({ timezone });
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return { success: false, error: 'Invalid data format: ' + validationResult.error.message };
    }

    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { id: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    try {
      const updatedDentist = await db.dentist.update({
        where: { id: dentistId },
        data: { timezone },
      });

      return { success: true, data: timezone };
    } catch (dbError) {
      console.error('Database error:', dbError);
      return { success: false, error: 'Failed to update database' };
    }
  } catch (error) {
    console.error('Error updating timezone:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid data format: ' + error.message };
    }
    return { success: false, error: 'Failed to update timezone' };
  }
}

export async function readTimeZone(dentistId: string) {
  try {
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      select: { timezone: true },
    });

    if (!dentist) {
      return { success: false, error: 'Dentist not found' };
    }

    return { 
      success: true, 
      data: dentist.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone 
    };
  } catch (error) {
    console.error('Error reading timezone:', error);
    return { success: false, error: 'Failed to read timezone' };
  }
} 