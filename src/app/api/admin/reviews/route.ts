import { auth } from '@/auth';
import { db } from '@/db';
import { ReviewStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') as ReviewStatus;
    const dentistId = searchParams.get('dentistId') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Search across multiple fields
    if (search && search.length >= 3) {
      where.OR = [
        {
          reviewerName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          reviewerEmail: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          body: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          dentist: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Filter by status
    if (status && Object.values(ReviewStatus).includes(status)) {
      where.status = status;
    }

    // Filter by dentist
    if (dentistId) {
      where.dentistId = dentistId;
    }

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === 'dentist') {
      orderBy.dentist = { name: sortOrder };
    } else if (sortBy === 'reviewerName' || sortBy === 'rating' || sortBy === 'status' || sortBy === 'createdAt') {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    // Fetch reviews with pagination
    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where,
        include: {
          dentist: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          subratings: {
            include: {
              category: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.review.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    // Get filter options
    const [statuses, dentistNames] = await Promise.all([
      // Get all available statuses
      Promise.resolve(Object.values(ReviewStatus)),
      // Get dentist names for filtering
      db.dentist.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          name: {
            not: null,
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        total,
        page,
        limit,
        hasMore,
        totalPages,
      },
      filters: {
        statuses,
        dentistNames: dentistNames.map((d: { name: string | null }) => d.name).filter(Boolean),
      },
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 