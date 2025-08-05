import { db } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch appointments for the user with dentist details
    const appointments = await db.appointment.findMany({
      where: {
        userId: userId,
      },
      include: {
        dentist: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            image: true,
            city: true,
            state: true,
            address: true,
            practiceLocation: true,
          },
        },
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      appointments: appointments.map(appointment => ({
        id: appointment.id,
        appointmentDate: appointment.appointmentDate.toISOString().split('T')[0],
        appointmentTime: appointment.appointmentTime,
        status: appointment.status,
        patientName: appointment.patientName,
        patientPhone: appointment.patientPhone,
        patientEmail: appointment.patientEmail,
        otherInfo: appointment.otherInfo,
        createdAt: appointment.createdAt.toISOString(),
        dentist: {
          id: appointment.dentist.id,
          name: appointment.dentist.name,
          phone: appointment.dentist.phone,
          email: appointment.dentist.email,
          image: appointment.dentist.image,
          city: appointment.dentist.city,
          state: appointment.dentist.state,
          clinicName: appointment.dentist.practiceLocation,
          clinicAddress: appointment.dentist.address,
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
} 