import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const treatment = await db.treatmentMeta.findUnique({
    where: { id },
    include: {
      costs: true,
    },
  });

  if (!treatment) {
    return NextResponse.json({ error: "Treatment not found" }, { status: 404 });
  }

  return NextResponse.json(treatment);
}
