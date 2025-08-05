import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for validating cost update data (all fields optional)
const costUpdateSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  description: z.string().optional(),
  priceMin: z.string().optional().nullable(),
  priceMax: z.string().optional().nullable(),
  priceSuffix: z.string().optional().nullable(),
  pricePrefix: z.string().optional().nullable(),
  currency: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { treatmentId: string; costId: string } }
) {
  try {
    const { treatmentId, costId } = params;
    const body = await request.json();

    // Validate cost existence and relation
    const cost = await db.cost.findUnique({
      where: { id: costId, treatmentMetaId: treatmentId },
    });
    if (!cost) {
      return NextResponse.json(
        { error: "Cost not found for this treatment" },
        { status: 404 }
      );
    }

    // Validate request body
    const validation = costUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    const updatedCost = await db.cost.update({
      where: { id: costId },
      data: validation.data,
    });

    return NextResponse.json({
      success: true,
      message: "Cost updated successfully",
      cost: updatedCost,
    });
  } catch (error) {
    console.error("Failed to update cost:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cost" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { treatmentId: string; costId: string } }
) {
  try {
    const { treatmentId, costId } = params;

    // Validate cost existence and relation
    const cost = await db.cost.findUnique({
      where: { id: costId, treatmentMetaId: treatmentId },
    });
    if (!cost) {
      return NextResponse.json(
        { error: "Cost not found for this treatment" },
        { status: 404 }
      );
    }

    await db.cost.delete({
      where: { id: costId },
    });

    return NextResponse.json({
      success: true,
      message: "Cost deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete cost:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete cost" },
      { status: 500 }
    );
  }
}
