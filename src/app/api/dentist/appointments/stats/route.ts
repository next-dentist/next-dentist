import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dentistId = searchParams.get('dentistId');

    if (!dentistId) {
      return NextResponse.json(
        { error: 'Dentist ID is required' },
        { status: 400 }
      );
    }

    // Get stats for different appointment statuses for this dentist
    const [
      total,
      pending,
      approved,
      rejected,
      cancelledByPatient,
      cancelledByDentist,
      rescheduled,
      completed,
      noShow,
    ] = await Promise.all([
      prisma.appointment.count({ where: { dentistId } }),
      prisma.appointment.count({ where: { dentistId, dentistStatus: 'PENDING' } }),
      prisma.appointment.count({ where: { dentistId, dentistStatus: 'APPROVED' } }),
      prisma.appointment.count({ where: { dentistId, dentistStatus: 'REJECTED' } }),
      prisma.appointment.count({ where: { dentistId, dentistStatus: 'CANCELLED_BY_PATIENT' } }),
      prisma.appointment.count({ where: { dentistId, dentistStatus: 'CANCELLED_BY_DENTIST' } }),
      prisma.appointment.count({ where: { dentistId, dentistStatus: 'RESCHEDULED' } }),
      prisma.appointment.count({ where: { dentistId, dentistStatus: 'COMPLETED' } }),
      prisma.appointment.count({ where: { dentistId, dentistStatus: 'NO_SHOW' } }),
    ]);

    // Calculate cancelled total
    const cancelled = cancelledByPatient + cancelledByDentist;

    // Get today's appointments
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todayAppointments = await prisma.appointment.count({
      where: {
        dentistId,
        appointmentDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    // Get upcoming appointments (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingAppointments = await prisma.appointment.count({
      where: {
        dentistId,
        appointmentDate: {
          gte: new Date(),
          lte: nextWeek,
        },
        dentistStatus: {
          in: ['PENDING', 'APPROVED'],
        },
      },
    });

    // Get pending requests (appointments waiting for dentist approval)
    const pendingRequests = await prisma.appointment.count({
      where: {
        dentistId,
        dentistStatus: 'PENDING',
        appointmentDate: {
          gte: new Date(), // Only future pending appointments
        },
      },
    });

    // Get this week's completed appointments
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekCompleted = await prisma.appointment.count({
      where: {
        dentistId,
        dentistStatus: 'COMPLETED',
        appointmentDate: {
          gte: startOfWeek,
        },
      },
    });

    return NextResponse.json({
      total,
      pending,
      approved,
      rejected,
      cancelled,
      cancelledByPatient,
      cancelledByDentist,
      rescheduled,
      completed,
      noShow,
      todayAppointments,
      upcomingAppointments,
      pendingRequests,
      thisWeekCompleted,
    });
  } catch (error) {
    console.error('Error fetching dentist appointment statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment statistics' },
      { status: 500 }
    );
  }
} 