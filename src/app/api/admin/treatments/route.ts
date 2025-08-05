import { db } from "@/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const searchQuery = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || undefined;
  const category = url.searchParams.get("category") || "";
  const sortBy = url.searchParams.get("sortBy") || "dateAndTime";
  const sortOrder = url.searchParams.get("sortOrder") || "desc";

  try {
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const whereClause: any = {};

    if (searchQuery) {
      try {
        // Decode the URL-encoded search term
        const decodedSearch = decodeURIComponent(searchQuery);

        // Use safe search with error handling
        whereClause.OR = [
          { name: { contains: decodedSearch } },
          { description: { contains: decodedSearch } },
          { slug: { contains: decodedSearch } },
        ];
      } catch (searchError) {
        console.error("Error processing search query:", searchError);
        // Fall back to a basic search if decoding fails
        whereClause.OR = [
          { name: { contains: searchQuery } },
          { description: { contains: searchQuery } },
        ];
      }
    }

    if (status) {
      // Create a simple array of valid statuses
      const validStatuses = ["active", "inactive", "featured", "archived"];
      if (validStatuses.includes(status)) {
        whereClause.status = status;
      }
    }

    if (category) {
      // Comment out or remove this section
    }

    // Build orderBy based on sort parameters
    let orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Fetch treatments with pagination and filtering
    const [treatments, totalCount] = await Promise.all([
      db.treatmentMeta.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: {
          costs: true,
        },
      }),
      db.treatmentMeta.count({
        where: whereClause,
      }),
    ]);

    // Get unique categories and statuses for filter options
    const [categories, statuses] = await Promise.all([
      Promise.resolve([]), // Empty array as TreatmentMeta doesn't have category
      Promise.resolve([]), // Empty array as TreatmentMeta doesn't have status
    ]);

    return NextResponse.json({
      treatments,
      pagination: {
        total: totalCount,
        page,
        limit,
        hasMore: skip + limit < totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      filters: {
        categories: [], // No categories in your schema
        statuses: [], // No statuses in your schema
      },
    });
  } catch (error) {
    console.error("Error fetching treatments:", error);
    // Add more detailed logging
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to fetch treatments",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Handle POST to create a new treatment
export async function POST(request: NextRequest) {
  // Access control check
  const headersList = await headers();
  const referer = headersList.get("referer");
  const apiKey = headersList.get("x-api-key");

  // TODO: Implement proper authentication check for admin
  const isValidOrigin =
    referer && new URL(referer).origin === process.env.NEXT_PUBLIC_APP_URL;
  const hasValidApiKey = apiKey === process.env.API_SECRET_KEY;

  if (!isValidOrigin && !hasValidApiKey) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Generate a slug from the name if not provided
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        "-" +
        Date.now().toString().slice(-6);

    // Create the treatment record
    const newTreatment = await db.treatmentMeta.create({
      data: {
        ...data,
        slug,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Treatment created successfully",
      treatment: newTreatment,
    });
  } catch (error) {
    console.error("Error creating treatment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create treatment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
