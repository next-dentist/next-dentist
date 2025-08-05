import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for validating FAQ creation data
const faqCreateSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
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
    const validation = faqCreateSchema.safeParse(body);
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

    const newFAQ = await db.fAQ.create({
      data: {
        ...validation.data,
        treatmentMetaId: treatmentId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "FAQ created successfully",
        faq: newFAQ,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create FAQ:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}

// Get all FAQs for a treatment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ treatmentId: string }> }
) {
  try {
    const { treatmentId } = await params;

    const faqs = await db.fAQ.findMany({
      where: { treatmentMetaId: treatmentId },
    });

    return NextResponse.json({
      success: true,
      faqs,
    });
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}
