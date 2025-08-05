import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ treatmentId: string }> }
) {
  try {
    const { treatmentId } = await params;
    const updateData = await request.json();

    // Validate treatmentId
    const treatment = await db.treatmentMeta.findUnique({
      where: { id: treatmentId },
    });

    if (!treatment) {
      return NextResponse.json(
        { error: "Treatment not found" },
        { status: 404 }
      );
    }

    // Handle status updates specifically - with validation
    if (updateData.status !== undefined) {
      const validStatuses = ["active", "inactive", "featured", "archived"];

      if (!validStatuses.includes(updateData.status)) {
        return NextResponse.json(
          {
            error: `Invalid status value: ${
              updateData.status
            }. Must be one of: ${validStatuses.join(", ")}`,
          },
          { status: 400 }
        );
      }
    }

    // Update the treatment with all the provided fields
    const updatedTreatment = await db.treatmentMeta.update({
      where: { id: treatmentId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Treatment updated successfully",
      treatment: updatedTreatment,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update treatment",
        details: error instanceof Error ? error.message : "Unknown error",
        stack:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ treatmentId: string }> }
) {
  try {
    const { treatmentId } = await params;

    // Validate treatmentId
    const treatment = await db.treatmentMeta.findUnique({
      where: { id: treatmentId },
    });

    if (!treatment) {
      return NextResponse.json(
        { error: "Treatment not found" },
        { status: 404 }
      );
    }

    // Delete the treatment
    await db.treatmentMeta.delete({
      where: { id: treatmentId },
    });

    return NextResponse.json({
      success: true,
      message: "Treatment deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete treatment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ treatmentId: string }> }
) {
  try {
    const { treatmentId } = await params;

    // Fetch the treatment data
    const treatment = await db.treatmentMeta.findUnique({
      where: { id: treatmentId },
      include: {
        costs: true,
        faq: true,
        instructions: true,
        sections: true,
        images: true,
        videos: true,
      },
    });

    if (!treatment) {
      return NextResponse.json(
        { error: "Treatment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ treatment });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch treatment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
