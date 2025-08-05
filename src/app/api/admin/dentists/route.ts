// admin dentists route

import { db } from "@/db";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const searchQuery = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || undefined;
  const city = url.searchParams.get("city") || "";
  const speciality = url.searchParams.get("speciality") || "";
  const sortBy = url.searchParams.get("sortBy") || "createdAt";
  const sortOrder = url.searchParams.get("sortOrder") || "desc";

  // // Access control - check for admin permissions
  // const headersList = await headers();
  // const referer = headersList.get("referer");
  // const apiKey = headersList.get("x-api-key");

  // // TODO: Implement proper authentication check for admin
  // const isValidOrigin =
  //   referer && new URL(referer).origin === process.env.NEXT_PUBLIC_APP_URL;
  // const hasValidApiKey = apiKey === process.env.API_SECRET_KEY;

  // if (!isValidOrigin && !hasValidApiKey) {
  //   return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  // }

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
          { email: { contains: decodedSearch } },
          { phone: { contains: decodedSearch } },
          { city: { contains: decodedSearch } },
          { speciality: { contains: decodedSearch } },
        ];
      } catch (searchError) {
        console.error("Error processing search query:", searchError);
        // Fall back to a basic search if decoding fails
        whereClause.OR = [
          { name: { contains: searchQuery } },
          { email: { contains: searchQuery } },
        ];
      }
    }

    if (status) {
      // Create a simple array of valid statuses
      const validStatuses = [
        "pending",
        "verified",
        "rejected",
        "banned",
        "deleted",
        "suspended",
        "closed",
      ];
      if (validStatuses.includes(status)) {
        whereClause.status = status;
      }
    }

    if (city) {
      whereClause.city = { contains: city };
    }

    if (speciality) {
      whereClause.speciality = { contains: speciality };
    }

    // Build orderBy based on sort parameters
    let orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Fetch dentists with pagination and filtering
    const [dentists, totalCount] = await Promise.all([
      db.dentist.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          images: true,
          treatments: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy,
      }),
      db.dentist.count({
        where: whereClause,
      }),
    ]);

    // Get unique cities and specialities for filter options
    const [cities, specialities, statuses] = await Promise.all([
      db.dentist.findMany({
        select: { city: true },
        distinct: ["city"],
        where: { city: { not: null } },
      }),
      db.dentist.findMany({
        select: { speciality: true },
        distinct: ["speciality"],
        where: { speciality: { not: null } },
      }),
      db.dentist.findMany({
        select: { status: true },
        distinct: ["status"],
      }),
    ]);

    return NextResponse.json({
      dentists,
      pagination: {
        total: totalCount,
        page,
        limit,
        hasMore: skip + limit < totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      filters: {
        cities: cities.map((c) => c.city).filter(Boolean),
        specialities: specialities.map((s) => s.speciality).filter(Boolean),
        statuses: statuses.map((s) => s.status).filter(Boolean),
      },
    });
  } catch (error) {
    console.error("Error fetching dentists:", error);
    // Add more detailed logging
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to fetch dentists",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Handle POST to create a new dentist
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

    // Generate a slug from the name
    const slug =
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString().slice(-6);

    // Create the dentist record
    const newDentist = await db.dentist.create({
      data: {
        ...data,
        slug,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Dentist created successfully",
      dentist: newDentist,
    });
  } catch (error) {
    console.error("Error creating dentist:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create dentist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
