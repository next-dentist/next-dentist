import { db } from "@/db";
import { ReviewStatus } from "@prisma/client";

/**
 * Recalculate averageRating & reviewsCount for a dentist
 * considering ONLY APPROVED reviews.
 * 
 * This function handles:
 * - New review approvals
 * - Review rejections
 * - Review deletions
 * - Status changes from approved to pending
 * - Multiple reviews being processed
 * - Edge cases like no reviews
 */
export async function updateDentistAggregates(dentistId: string) {
  try {
    // Get all approved reviews for the dentist
    const approvedReviews = await db.review.findMany({
      where: { 
        dentistId, 
        status: ReviewStatus.APPROVED 
      },
      select: {
        rating: true,
        subratings: {
          select: {
            value: true,
            category: {
              select: {
                name: true,
                label: true
              }
            }
          }
        }
      }
    });

    // Calculate main rating average
    const mainRatingAvg = approvedReviews.length > 0
      ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length
      : 0;

    // Calculate subcategory averages
    const subcategoryRatings = new Map<string, { sum: number; count: number }>();
    
    approvedReviews.forEach(review => {
      review.subratings.forEach(subrating => {
        const categoryName = subrating.category.label || subrating.category.name;
        const current = subcategoryRatings.get(categoryName) || { sum: 0, count: 0 };
        subcategoryRatings.set(categoryName, {
          sum: current.sum + subrating.value,
          count: current.count + 1
        });
      });
    });

    // Convert subcategory ratings to averages
    const subcategoryAverages = Object.fromEntries(
      Array.from(subcategoryRatings.entries()).map(([category, { sum, count }]) => [
        category,
        count > 0 ? sum / count : 0
      ])
    );

    // Update dentist record with new aggregates
    const updatedDentist = await db.dentist.update({
      where: { id: dentistId },
      data: {
        rating: mainRatingAvg,
        totalReviews: approvedReviews.length,
        // Store subcategory averages in a JSON field if needed
        // You'll need to add this field to your schema if you want to use it
        // subcategoryRatings: subcategoryAverages
      },
      select: {
        id: true,
        name: true,
        rating: true,
        totalReviews: true
      }
    });

    // Log the update for monitoring

    return updatedDentist;
  } catch (error) {
    // Log error but don't throw - we want to handle failures gracefully
    console.error('Error updating dentist aggregates:', {
      dentistId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    // Return null to indicate failure
    return null;
  }
}

/**
 * Batch update multiple dentists' aggregates
 * Useful when bulk operations affect multiple dentists
 */
export async function updateMultipleDentistAggregates(dentistIds: string[]) {
  const results = await Promise.allSettled(
    dentistIds.map(id => updateDentistAggregates(id))
  );

  // Log results
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Failed to update aggregates for dentist ${dentistIds[index]}:`, result.reason);
    }
  });

  return results;
}

/**
 * Validate dentist aggregates
 * Can be used to check if aggregates are in sync with actual reviews
 */
export async function validateDentistAggregates(dentistId: string) {
  const dentist = await db.dentist.findUnique({
    where: { id: dentistId },
    select: {
      id: true,
      name: true,
      rating: true,
      totalReviews: true
    }
  });

  if (!dentist) {
    throw new Error(`Dentist ${dentistId} not found`);
  }

  const approvedReviews = await db.review.findMany({
    where: { 
      dentistId, 
      status: ReviewStatus.APPROVED 
    }
  });

  const actualCount = approvedReviews.length;
  const actualRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length
    : 0;

  const isValid = 
    dentist.rating && actualRating && Math.abs(dentist.rating - actualRating) < 0.01 && // Allow small floating point differences
    dentist.totalReviews === actualCount;

  return {
    isValid,
    dentist,
    actualCount,
    actualRating,
    discrepancy: {
      rating: Math.abs(dentist.rating || 0 - actualRating),
      count: (dentist.totalReviews || 0) - actualCount
    }
  };
}
