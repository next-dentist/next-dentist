import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for validating section creation data
const sectionCreateSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"), // Remove optional()
  menuText: z.string().optional().nullable(),
  cssId: z.string().optional().nullable(),
  content: z.string().min(1, "Content cannot be empty"), // Remove optional()
  image: z.string().optional().nullable(),
  video: z.string().optional().nullable(),
  buttonLink: z.string().url("Must be a valid URL").optional().nullable(),
  buttonText: z.string().optional().nullable(),
});

// --- CREATE Handler ---
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
    const validation = sectionCreateSchema.safeParse(body);
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

    // Create new section
    const newSection = await db.section.create({
      data: {
        title: validation.data.title, // Explicitly specify required fields
        content: validation.data.content,
        menuText: validation.data.menuText,
        cssId: validation.data.cssId,
        image: validation.data.image,
        buttonLink: validation.data.buttonLink,
        buttonText: validation.data.buttonText,
        treatmentMetaId: treatmentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Section created successfully",
      section: newSection,
    });
  } catch (error) {
    console.error("Failed to create section:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create section" },
      { status: 500 }
    );
  }
}
