'use server';
import { db } from "@/db";
import { appointmentSchema } from "@/schemas";
import { z } from "zod";

export async function createAppointment(
  formData: unknown,
  userId: string,
  dentistId: string
) {
  try {
    // Validate input
    const parsed = appointmentSchema.parse(formData);

    // Check if the slot is available
    const isAvailable = await isAppointmentSlotAvailable(dentistId, parsed.date, parsed.time);
    if (!isAvailable) {
      return { success: false, error: 'Slot is not available' };
    }

    

    // Map form fields to Appointment model fields
    const appointment = await db.appointment.create({
      data: {
        patientName: parsed.name,
        patientPhone: parsed.phone,
        patientEmail: parsed.email,
        appointmentDate: new Date(parsed.date),
        appointmentTime: parsed.time,
        otherInfo: parsed.message || undefined,
        userId,
        dentistId,
        // status, treatmentId, treatmentName, etc. can be added if needed
      },
    });

    // Optionally revalidate a path or redirect here
    // revalidatePath('/appointments');
    // redirect('/appointments');

    return { success: true, data: appointment };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function isAppointmentSlotAvailable(
  dentistId: string,
  date: string,
  time: string
): Promise<boolean> {
  // Check if an appointment already exists for this dentist at the given date and time
  const existing = await db.appointment.findFirst({
    where: {
      dentistId,
      appointmentDate: new Date(date),
      appointmentTime: time,
    },
  });
  return !existing;
}



