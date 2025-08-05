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
      status,
      dentistStatus,
      patientStatus,
      statusReason,
      lastModifiedBy,
    } = body;

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

    // Build update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status !== undefined) {
      updateData.status = status;
    }
    if (dentistStatus !== undefined) {
      updateData.dentistStatus = dentistStatus;
    }
    if (patientStatus !== undefined) {
      updateData.patientStatus = patientStatus;
    }
    if (statusReason !== undefined) {
      updateData.statusReason = statusReason;
    }
    if (lastModifiedBy !== undefined) {
      updateData.lastModifiedBy = lastModifiedBy;
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
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
    // For example, send email/SMS to patient and dentist about status change

    return NextResponse.json({
      message: 'Appointment status updated successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment status' },
      { status: 500 }
    );
  }
} 