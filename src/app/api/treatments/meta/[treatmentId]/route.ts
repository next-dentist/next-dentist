// src/app/api/treatments/meta/[treatmentId]/route.ts
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { treatmentId: string } }
) {
  const { treatmentId } = params;

  try {
    const treatment = await db.treatmentMeta.findUnique({
      where: {
        id: treatmentId,
      },
      include: {
        costs: true,
        faq: true,
        instructions: true,
        sections: true,
        images: true,
        videos: true,
      },
    });

    if (!treatment) {
      return NextResponse.json(
        { error: "Treatment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(treatment);
  } catch (error) {
    console.error("Error fetching treatment meta:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch treatment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
