import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const {
      appointmentDate,
      appointmentTime,
      statusReason,
      lastModifiedBy,
    } = body;

    // Validate required fields
    if (!appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Appointment date and time are required' },
        { status: 400 }
      );
    }

    // Validate the appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check for conflicts with the dentist's schedule
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        dentistId: existingAppointment.dentistId,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        id: { not: id },
        status: {
          in: ['PENDING', 'APPROVED'],
        },
      },
    });

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: 'Time slot is already booked for this dentist' },
        { status: 409 }
      );
    }

    // Update appointment with new date/time and set status to rescheduled
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        status: 'RESCHEDULED',
        statusReason: statusReason || `Rescheduled to ${appointmentDate} at ${appointmentTime}`,
        lastModifiedBy: lastModifiedBy || 'admin',
        updatedAt: new Date(),
      },
      include: {
        dentist: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Here you could add notification logic
    // For example, send email/SMS to patient and dentist about reschedule

    return NextResponse.json({
      message: 'Appointment rescheduled successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    return NextResponse.json(
      { error: 'Failed to reschedule appointment' },
      { status: 500 }
    );
  }
} 