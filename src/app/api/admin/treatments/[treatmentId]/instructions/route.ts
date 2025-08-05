import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for validating instruction creation data
const instructionCreateSchema = z.object({
  type: z.string().optional().nullable(), // e.g., 'pre-care', 'post-care'
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  icon: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().url("Must be a valid URL").optional().nullable(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ treatmentId: string }> }
) {
  try {
    const { treatmentId } = await params;
    const body = await request.json();

    // Validate treatment existence
    const treatment = await db.treatmentMeta.findUnique({
      where: { id: treatmentId },
    });
    if (!treatment) {
      return NextResponse.json(
        { success: false, error: "Treatment not found" },
        { status: 404 }
      );
    }

    // Validate request body
    const validation = instructionCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validation.error.flatten().fieldErrors, // More detailed errors
        },
        { status: 400 }
      );
    }

    const newInstruction = await db.instruction.create({
      data: {
        ...validation.data,
        treatmentMetaId: treatmentId, // Link to the treatment
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Instruction created successfully",
        instruction: newInstruction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create instruction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create instruction" },
      { status: 500 }
    );
  }
}
