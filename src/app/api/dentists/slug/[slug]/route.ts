import { db } from "@/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Use the correct type annotation for Next.js 15
type Params = { params: { slug: string } };

export async function GET(request: NextRequest, { params }: Params) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const apiKey = headersList.get("x-api-key");

  const isValidOrigin =
    referer && new URL(referer).origin === process.env.NEXT_PUBLIC_APP_URL;
  const hasValidApiKey = apiKey === process.env.API_SECRET_KEY;

  if (!isValidOrigin && !hasValidApiKey) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }
  try {
    // Await the params object before accessing its properties
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const dentist = await db.dentist.findUnique({
      where: { slug },
      include: {
        images: true,
        treatments: true,
        specializations: true,
        languages: true,
        faq: true,
        TreatmentsReviews: true,
        features: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isOnline: true,
            lastSeen: true,
          },
        },
      },
    });

    if (!dentist) {
      return NextResponse.json({ error: "Dentist not found" }, { status: 404 });
    }

    // Include userId in the response for messaging functionality
    const response = {
      ...dentist,
      userId: dentist.userId,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching dentist by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch dentist" },
      { status: 500 }
    );
  }
}
