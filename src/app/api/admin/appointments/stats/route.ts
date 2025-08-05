import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get stats for different appointment statuses
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
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.appointment.count({ where: { status: 'APPROVED' } }),
      prisma.appointment.count({ where: { status: 'REJECTED' } }),
      prisma.appointment.count({ where: { status: 'CANCELLED_BY_PATIENT' } }),
      prisma.appointment.count({ where: { status: 'CANCELLED_BY_DENTIST' } }),
      prisma.appointment.count({ where: { status: 'RESCHEDULED' } }),
      prisma.appointment.count({ where: { status: 'COMPLETED' } }),
      prisma.appointment.count({ where: { status: 'NO_SHOW' } }),
    ]);

    // Calculate cancelled total
    const cancelled = cancelledByPatient + cancelledByDentist;

    // Get today's appointments
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todayAppointments = await prisma.appointment.count({
      where: {
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
        appointmentDate: {
          gte: new Date(),
          lte: nextWeek,
        },
        status: {
          in: ['PENDING', 'APPROVED'],
        },
      },
    });

    // Get recent activity (last 24 hours)
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const recentActivity = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: last24Hours,
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
      recentActivity,
    });
  } catch (error) {
    console.error('Error fetching appointment statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment statistics' },
      { status: 500 }
    );
  }
} 