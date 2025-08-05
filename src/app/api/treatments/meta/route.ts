import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET handler for fetching treatment meta data
 * This endpoint returns treatment meta information with optional search functionality
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    // If search parameter is provided, filter treatments by name
    const treatments = await db.treatmentMeta.findMany({
      where: search
        ? {
            name: {
              contains: search,
            },
          }
        : undefined,
    });

    // Return successful response with treatments data
    return NextResponse.json({
      success: true,
      treatments,
    });
  } catch (error) {
    console.error("Error fetching treatment meta data:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch treatments",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
