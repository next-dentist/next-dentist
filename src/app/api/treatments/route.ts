import { db } from "@/db";
import { TreatmentMeta } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const treatment: TreatmentMeta | null = await db.treatmentMeta.findUnique({
    where: { slug },
    include: {
      faq: true,
      sections: true,
      costs: true,
      instructions: true,
      images: true,
      videos: true,
    },
  });

  if (!treatment) {
    return NextResponse.json({ error: "Treatment not found" }, { status: 404 });
  }

  return NextResponse.json(treatment);
}
