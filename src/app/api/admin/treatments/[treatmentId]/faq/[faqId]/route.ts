import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const faqCreateSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

// Create FAQ
export async function POST(
  request: NextRequest,
  { params }: { params: { treatmentId: string } }
) {
  try {
    const { treatmentId } = params;
    const body = await request.json();

    // Validate treatment exists
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
    const validation = faqCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Create FAQ
    const newFAQ = await db.fAQ.create({
      data: {
        ...validation.data,
        treatmentMetaId: treatmentId,
      },
    });

    return NextResponse.json(
      { message: "FAQ created successfully", faq: newFAQ },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}

// Get FAQ
export async function GET(
  request: NextRequest,
  { params }: { params: { treatmentId: string; faqId: string } }
) {
  try {
    const { faqId } = params;

    const faq = await db.fAQ.findUnique({
      where: { id: faqId },
    });

    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json(faq);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json({ error: "Failed to fetch FAQ" }, { status: 500 });
  }
}

// Update FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: { treatmentId: string; faqId: string } }
) {
  try {
    const { faqId } = params;
    const body = await request.json();

    const validation = faqCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const updatedFAQ = await db.fAQ.update({
      where: { id: faqId },
      data: validation.data,
    });

    return NextResponse.json(updatedFAQ);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

// Delete FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: { treatmentId: string; faqId: string } }
) {
  try {
    const { faqId } = params;

    await db.fAQ.delete({
      where: { id: faqId },
    });

    return NextResponse.json(
      { message: "FAQ deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
