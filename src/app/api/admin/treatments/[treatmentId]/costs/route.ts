import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for validating cost creation data
const costCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  priceMin: z.string().optional().nullable(),
  priceMax: z.string().optional().nullable(),
  priceSuffix: z.string().optional().nullable(),
  pricePrefix: z.string().optional().nullable(),
  currency: z.string().optional().default("₹"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { treatmentId: string } }
) {
  try {
    const { treatmentId } = params;
    const body = await request.json();

    // Validate treatment existence
    const treatment = await db.treatmentMeta.findUnique({
      where: { id: treatmentId },
    });
    if (!treatment) {
      return NextResponse.json(
        { error: "Treatment not found" },
        { status: 404 }
      );
    }

    // Validate request body
    const validation = costCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    const newCost = await db.cost.create({
      data: {
        ...validation.data,
        treatmentMetaId: treatmentId, // Link to the treatment
      },
    });

    return NextResponse.json(
      { success: true, message: "Cost created successfully", cost: newCost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create cost:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create cost" },
      { status: 500 }
    );
  }
}
