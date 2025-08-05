import { db } from '@/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// According to schema.prisma, the Appointment model is:
// model Appointment {
//   id              String   @id @default(cuid())
//   patientName     String?
//   patientPhone    String
//   patientEmail    String?
//   patientAge      String?
//   gender          String?
//   userId          String? // Corrected based on context
//   treatmentId     String?
//   treatmentName   String?
//   otherInfo       String?
//   appointmentDate DateTime
//   appointmentTime String
//   status          String   @default("pending")
//   dentistId       String
//   createdAt       DateTime @default(now())
//   updatedAt       DateTime @updatedAt
//   dentist         Dentist  @relation(fields: [dentistId], references: [id], onDelete: Cascade)
//   user            User?     @relation(fields: [userId], references: [id], onDelete: Cascade) // Corrected based on context
// }

// More lenient schema for API request
const appointmentSchema = z.object({
  dentistId: z.string().optional(),
  userId: z.string().optional(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // yyyy-MM-dd
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:mm
  patientName: z.string().min(2).optional(),
  patientPhone: z.string().min(7), // More lenient for international formats
  patientEmail: z.string().email().optional(),
  patientAge: z.string().optional(),
  gender: z.string().optional(),
  treatmentId: z.string().optional(),
  treatmentName: z.string().optional(),
  otherInfo: z.string().optional(),
  message: z.string().optional(), // not in schema, but can be mapped to otherInfo
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // For backward compatibility
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(), // For backward compatibility
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validationResult = appointmentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid appointment data',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const appointmentData = validationResult.data;

    // Handle both API formats (support both date/time and appointmentDate/appointmentTime)
    const formattedDate = appointmentData.appointmentDate || appointmentData.date;
    const formattedTime = appointmentData.appointmentTime || appointmentData.time;

    if (!formattedDate || !formattedTime) {
      return NextResponse.json(
        { success: false, error: 'Date and time are required' },
        { status: 400 }
      );
    }

    // Check if the time slot is still available
    const existingAppointment = await db.appointment.findFirst({
      where: {
        dentistId: appointmentData.dentistId,
        appointmentDate: new Date(formattedDate),
        appointmentTime: formattedTime,
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'This time slot is no longer available' },
        { status: 409 }
      );
    }

    // Create the appointment
    const appointment = await db.appointment.create({
      data: {
        dentistId: appointmentData.dentistId ?? '',
        userId: appointmentData.userId ?? null, // Use null for optional userId
        appointmentDate: new Date(formattedDate),
        appointmentTime: formattedTime,
        patientName: appointmentData.patientName ?? null,
        patientPhone: appointmentData.patientPhone,
        patientEmail: appointmentData.patientEmail ?? null,
        patientAge: appointmentData.patientAge ?? null,
        gender: appointmentData.gender ?? null,
        treatmentId: appointmentData.treatmentId ?? null,
        treatmentName: appointmentData.treatmentName ?? null,
        otherInfo: appointmentData.message ?? appointmentData.otherInfo ?? null,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        dentistId: appointment.dentistId,
        userId: appointment.userId,
        status: appointment.status,
      }
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to book appointment' },
      { status: 500 }
    );
  }
}