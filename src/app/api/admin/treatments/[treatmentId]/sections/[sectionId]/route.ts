import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for validating section update data
// Making all fields optional for PATCH, but ensuring at least one is provided might be needed depending on requirements.
// For simplicity, we allow updating individual fields.
const sectionUpdateSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  menuText: z.string().optional().nullable(),
  cssId: z.string().optional().nullable(),
  content: z.string().min(1, "Content cannot be empty").optional(),
  image: z.string().optional().nullable(),
  video: z.string().optional().nullable(),
  buttonLink: z.string().url("Must be a valid URL").optional().nullable(),
  buttonText: z.string().optional().nullable(),
});

// --- UPDATE Handler (PATCH) ---
export async function PATCH(
  request: NextRequest,
  { params }: { params: { treatmentId: string; sectionId: string } }
) {
  try {
    const { treatmentId, sectionId } = params;
    const body = await request.json();

    // Validate section existence and relation to treatment
    const section = await db.section.findUnique({
      where: { id: sectionId, treatmentMetaId: treatmentId },
    });

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found for this treatment" },
        { status: 404 }
      );
    }

    // Validate the request body against the schema
    // Use safeParse for better error handling
    const validation = sectionUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validation.error.flatten().fieldErrors, // Use flatten for detailed errors
        },
        { status: 400 }
      );
    }

    // Ensure there's actually data to update
    if (Object.keys(validation.data).length === 0) {
      return NextResponse.json(
        { success: false, error: "No update data provided" },
        { status: 400 }
      );
    }

    // Perform the update using the validated data
    const updatedSection = await db.section.update({
      where: {
        id: sectionId,
        // treatmentMetaId: treatmentId, // Already validated existence above
      },
      data: validation.data, // Pass the validated data directly
    });

    return NextResponse.json({
      success: true,
      message: "Section updated successfully",
      section: updatedSection,
    });
  } catch (error) {
    console.error("Failed to update section:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update section" },
      { status: 500 }
    );
  }
}

// --- DELETE Handler ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: { treatmentId: string; sectionId: string } }
) {
  try {
    const { treatmentId, sectionId } = params;

    // Validate section existence and relation to treatment
    const section = await db.section.findUnique({
      where: { id: sectionId, treatmentMetaId: treatmentId },
    });

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found for this treatment" },
        { status: 404 }
      );
    }

    // Perform the deletion
    await db.section.delete({
      where: {
        id: sectionId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete section:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete section" },
      { status: 500 }
    );
  }
}
