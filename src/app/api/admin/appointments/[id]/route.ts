import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate the appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        dentist: {
          select: {
            name: true,
            email: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Delete the appointment
    await prisma.appointment.delete({
      where: { id },
    });

    // Here you could add notification logic
    // For example, send email/SMS to patient and dentist about cancellation

    return NextResponse.json({
      message: 'Appointment deleted successfully',
      deletedAppointment: {
        id: existingAppointment.id,
        patientName: existingAppointment.patientName,
        dentistName: existingAppointment.dentist.name,
      },
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
} 