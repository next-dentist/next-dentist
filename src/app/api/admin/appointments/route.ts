import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const status = searchParams.get('status');
    const dentistStatus = searchParams.get('dentistStatus');
    const patientStatus = searchParams.get('patientStatus');
    const dentistId = searchParams.get('dentistId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build where clause
    const where: any = {};

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
        {
          dentist: {
            name: {
              contains: search,
            },
          },
        },
        {
          dentist: {
            email: {
              contains: search,
            },
          },
        },
      ];
    }

    // Status filters - validate enum values
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED_BY_PATIENT', 'CANCELLED_BY_DENTIST', 'RESCHEDULED', 'COMPLETED', 'NO_SHOW'];
    
    if (status && validStatuses.includes(status)) {
      where.status = status;
    }
    if (dentistStatus && validStatuses.includes(dentistStatus)) {
      where.dentistStatus = dentistStatus;
    }
    if (patientStatus && validStatuses.includes(patientStatus)) {
      where.patientStatus = patientStatus;
    }
    if (dentistId) {
      where.dentistId = dentistId;
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
    let orderBy: any = { createdAt: 'desc' }; // Default sorting
    
    if (sortBy) {
      switch (sortBy) {
        case 'dentist':
          orderBy = { dentist: { name: sortOrder } };
          break;
        case 'patientName':
          orderBy = { patientName: sortOrder };
          break;
        case 'appointmentDate':
          orderBy = { appointmentDate: sortOrder };
          break;
        case 'status':
          orderBy = { status: sortOrder };
          break;
        case 'createdAt':
          orderBy = { createdAt: sortOrder };
          break;
        case 'updatedAt':
          orderBy = { updatedAt: sortOrder };
          break;
        default:
          // Keep default sorting for unknown fields
          orderBy = { createdAt: 'desc' };
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
    console.error('Error fetching appointments:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch appointments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 