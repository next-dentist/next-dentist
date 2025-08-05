import { db } from "@/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "8");

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
    // Use select to explicitly fetch businessHours and all other fields, plus images
    const dentists = await db.dentist.findMany({
      take: limit,
      where: {
        status: "verified",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true,
        treatments: true,
        Reviews: true,
        FavoriteDentists: true,
        SavedDentists: true,
        features: true,
      },
    });

    return NextResponse.json({
      dentists,
    });
  } catch (error) {
    console.error("Error fetching recent dentists:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent dentists" },
      { status: 500 }
    );
  }
}
