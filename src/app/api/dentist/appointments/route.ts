import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const dentistId = searchParams.get('dentistId');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'appointmentDate';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Validate dentistId is provided
    if (!dentistId) {
      return NextResponse.json(
        { error: 'Dentist ID is required' },
        { status: 400 }
      );
    }

    // Build where clause
    const where: any = {
      dentistId, // Filter by dentist
    };

    // Search functionality
    if (search) {
      where.OR = [
        {
          patientName: {
            contains: search,
          },
        },
        {
          patientPhone: {
            contains: search,
          },
        },
        {
          patientEmail: {
            contains: search,
          },
        },
        {
          treatmentName: {
            contains: search,
          },
        },
      ];
    }

    // Status filters - validate enum values
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED_BY_PATIENT', 'CANCELLED_BY_DENTIST', 'RESCHEDULED', 'COMPLETED', 'NO_SHOW'];
    
    if (status && validStatuses.includes(status)) {
      where.dentistStatus = status; // Filter by dentist status
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.appointmentDate = {};
      if (dateFrom) {
        where.appointmentDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.appointmentDate.lte = new Date(dateTo + 'T23:59:59.999Z');
      }
    }

    // Build sort object with validation
    let orderBy: any = { appointmentDate: 'asc', appointmentTime: 'asc' }; // Default sorting
    
    if (sortBy) {
      switch (sortBy) {
        case 'patientName':
          orderBy = { patientName: sortOrder };
          break;
        case 'appointmentDate':
          orderBy = [
            { appointmentDate: sortOrder },
            { appointmentTime: 'asc' }
          ];
          break;
        case 'status':
          orderBy = { dentistStatus: sortOrder };
          break;
        case 'createdAt':
          orderBy = { createdAt: sortOrder };
          break;
        case 'treatmentName':
          orderBy = { treatmentName: sortOrder };
          break;
        default:
          // Keep default sorting for unknown fields
          orderBy = [
            { appointmentDate: 'asc' },
            { appointmentTime: 'asc' }
          ];
      }
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch appointments with relations
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
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
        orderBy,
        skip,
        take: limit,
      }),
      prisma.appointment.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      appointments,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching dentist appointments:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch appointments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 