import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for validating instruction update data (all fields optional)
const instructionUpdateSchema = z.object({
  type: z.string().optional().nullable(),
  title: z.string().min(1, "Title cannot be empty").optional(),
  content: z.string().min(1, "Content cannot be empty").optional(),
  icon: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().url("Must be a valid URL").optional().nullable(),
});

// --- UPDATE Handler ---
export async function PATCH(
  request: NextRequest,
  { params }: { params: { treatmentId: string; instructionId: string } }
) {
  try {
    const { treatmentId, instructionId } = params;
    const body = await request.json();

    // Validate instruction existence and relation to treatment
    const instruction = await db.instruction.findUnique({
      where: { id: instructionId, treatmentMetaId: treatmentId },
    });
    if (!instruction) {
      return NextResponse.json(
        { success: false, error: "Instruction not found for this treatment" },
        { status: 404 }
      );
    }

    // Validate request body for update
    const validation = instructionUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Prevent sending empty data object
    if (Object.keys(validation.data).length === 0) {
      return NextResponse.json(
        { success: false, error: "No update data provided" },
        { status: 400 }
      );
    }

    const updatedInstruction = await db.instruction.update({
      where: { id: instructionId },
      data: validation.data, // Use validated data
    });

    return NextResponse.json({
      success: true,
      message: "Instruction updated successfully",
      instruction: updatedInstruction,
    });
  } catch (error) {
    console.error("Failed to update instruction:", error);
    // Handle potential Prisma errors like unique constraint violations if needed
    return NextResponse.json(
      { success: false, error: "Failed to update instruction" },
      { status: 500 }
    );
  }
}

// --- DELETE Handler ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: { treatmentId: string; instructionId: string } }
) {
  try {
    const { treatmentId, instructionId } = params;

    // Validate instruction existence and relation to treatment
    const instruction = await db.instruction.findUnique({
      where: { id: instructionId, treatmentMetaId: treatmentId },
    });
    if (!instruction) {
      return NextResponse.json(
        { success: false, error: "Instruction not found for this treatment" },
        { status: 404 }
      );
    }

    await db.instruction.delete({
      where: { id: instructionId },
    });

    return NextResponse.json({
      success: true,
      message: "Instruction deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete instruction:", error);
    // Handle potential Prisma errors (e.g., foreign key constraints if applicable)
    return NextResponse.json(
      { success: false, error: "Failed to delete instruction" },
      { status: 500 }
    );
  }
}
