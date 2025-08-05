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

    const { dentistStatus, statusReason, lastModifiedBy } = body;

    // Validate appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        dentist: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED_BY_PATIENT', 'CANCELLED_BY_DENTIST', 'RESCHEDULED', 'COMPLETED', 'NO_SHOW'];
    if (!validStatuses.includes(dentistStatus)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        dentistStatus,
        ...(statusReason && { statusReason }),
        ...(lastModifiedBy && { lastModifiedBy }),
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
            speciality: true,
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

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment status' },
      { status: 500 }
    );
  }
} 