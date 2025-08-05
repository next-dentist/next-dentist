import { updateDentistAggregates } from '@/app/(actions)/reviews/updateDentistAggregates';
import { auth } from '@/auth';
import { db } from '@/db';
import { ReviewStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !Object.values(ReviewStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be PENDING, APPROVED, or REJECTED' },
        { status: 400 }
      );
    }

    // Check if review exists
    const existingReview = await db.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Update review status
    const updatedReview = await db.review.update({
      where: { id },
      data: {
        status: status as ReviewStatus,
        updatedAt: new Date(),
      },
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
      },
    });

    // Update dentist aggregates if status changed to/from APPROVED
    if (existingReview.status !== status && 
        (existingReview.status === 'APPROVED' || status === 'APPROVED')) {
      await updateDentistAggregates(existingReview.dentistId);
    }

    return NextResponse.json({
      message: 'Review status updated successfully',
      review: updatedReview,
    });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if review exists
    const existingReview = await db.review.findUnique({
      where: { id },
      include: {
        subratings: true, // Include subratings to handle cascade deletion
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Store dentistId before deletion
    const dentistId = existingReview.dentistId;
    const wasApproved = existingReview.status === 'APPROVED';

    // Delete review (this will cascade delete subratings due to Prisma schema)
    await db.review.delete({
      where: { id },
    });

    // Update dentist aggregates if the deleted review was approved
    if (wasApproved) {
      await updateDentistAggregates(dentistId);
    }

    return NextResponse.json({
      message: 'Review deleted successfully',
      deletedId: id,
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Fetch single review with full details
    const review = await db.review.findUnique({
      where: { id },
      include: {
        dentist: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            speciality: true,
            city: true,
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
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ review });

  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 