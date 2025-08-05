'use server';

import { db } from "@/db";
import { z } from 'zod';

const appointmentSchema = z.object({
  patientName: z.string().min(1),
  patientPhone: z.string().min(1),
  patientEmail: z.string().optional().or(z.literal('')),
  patientAge: z.string().optional().or(z.literal('')),
  patientGender: z.string().optional().or(z.literal('')),
  patientCity: z.string().optional().or(z.literal('')),
  patientCountry: z.string().optional().or(z.literal('')),
  costTableId: z.string().min(1),
  costPageId: z.string().min(1),
  dateAndTime: z.string().min(1).refine(value => !isNaN(Date.parse(value)), {
    message: "Invalid value for argument `dateAndTime`: Expected ISO-8601 DateTime."
  }),
});

export interface CostPageAppointment {
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  patientAge: string | null;
  patientGender: string | null;
  patientCity: string | null;
  patientCountry: string | null;
  costTableId: string;
  costPageId: string;
  dateAndTime: string;
}

export interface AppointmentResponse {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  patientAge: string | null;
  patientGender: string | null;
  patientCity: string | null;
  patientCountry: string | null;
  costTableId: string;
  costPageId: string;
  dateAndTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const createCostPageAppointment = async (appointment: CostPageAppointment): Promise<{
  error?: string;
  issues?: Record<string, any>;
} | { success: true; data: AppointmentResponse }> => {
  const validatedFields = appointmentSchema.safeParse(appointment);
  if (!validatedFields.success) {
    return { error: "Invalid fields", issues: validatedFields.error.format() };
  }

  try {
    // Ensure all string fields have at least empty string values
    const sanitizedData = {
      patientName: appointment.patientName,
      patientPhone: appointment.patientPhone,
      patientEmail: appointment.patientEmail || '',
      patientAge: appointment.patientAge || '',
      patientGender: appointment.patientGender || '',
      patientCity: appointment.patientCity || '',
      patientCountry: appointment.patientCountry || '',
      costTableId: appointment.costTableId,
      costPageId: appointment.costPageId,
      dateAndTime: new Date(appointment.dateAndTime),
    };

    const newAppointment = await db.costTableAppointment.create({
      data: sanitizedData,
    });

    return { success: true, data: newAppointment };

  } catch (error) {
    console.error("Error creating appointment:", error);
    return { error: "Failed to create appointment. Please try again later." };
  }
};

export const getCostPageAppointments = async (id: string) => {
  try {
    const appointments = await db.costTableAppointment.findFirst({
      where: { id },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

// get Cost Table by ID
export const getCostTableById = async (id: string) => {
  try {
    if (!id) return null;
    const costTable = await db.costTable.findUnique({
      where: { id },
    });
    return costTable;
  } catch (error) {
    console.error("Error fetching cost table:", error);
    return null;
  }
};

// get Cost page by ID
export const getCostPageById = async (id: string) => {
  try {
    if (!id) return null;
    const costPage = await db.costPages.findUnique({
      where: { id },
    });
    return costPage;
  } catch (error) {
    console.error("Error fetching cost page:", error);
    return null;
  }
};
