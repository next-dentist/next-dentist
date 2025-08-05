import { db } from '@/db';
import { AppointmentStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  try {
    const { appointmentId } = await params;

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    // Check if appointment exists
    const existingAppointment = await db.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check if appointment can be cancelled (not already completed or cancelled)
    if (existingAppointment.status === AppointmentStatus.COMPLETED) {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel completed appointment' },
        { status: 400 }
      );
    }

    if (existingAppointment.status === AppointmentStatus.CANCELLED_BY_PATIENT) {
      return NextResponse.json(
        { success: false, error: 'Appointment is already cancelled' },
        { status: 400 }
      );
    }

    // Update appointment status to cancelled
    const updatedAppointment = await db.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED_BY_PATIENT },
    });

    return NextResponse.json({
      success: true,
      appointment: {
        id: updatedAppointment.id,
        status: updatedAppointment.status,
        updatedAt: updatedAppointment.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
} 