import { db } from "@/db";
import { Treatments } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const treatmentUpdateSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  description: z.string().optional(),
  image: z.string().url("Image must be a valid URL").optional().nullable(),
  price: z.string().optional(),
  currency: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  duration: z.string().optional(),
  slug: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { dentistId: string; treatmentId: string } }
) {
  try {
    // Make sure params exist and are valid
    if (!params?.dentistId || !params?.treatmentId) {
      return NextResponse.json(
        { error: "Dentist ID and Treatment ID are required" },
        { status: 400 }
      );
    }

    const { dentistId, treatmentId } = params;
    const body = await request.json();

    // Validate the treatment belongs to this dentist
    const existingTreatment = await db.treatments.findUnique({
      where: {
        id: treatmentId,
        dentistId: dentistId,
      },
    });

    if (!existingTreatment) {
      return NextResponse.json(
        { error: "Treatment not found or does not belong to this dentist" },
        { status: 404 }
      );
    }

    // Update the dentist-specific treatment (NOT the template)
    const updatedTreatment = await db.treatments.update({
      where: {
        id: treatmentId,
        // Including dentistId ensures we're only updating treatments that belong to this dentist
        dentistId: dentistId,
      },
      data: {
        // Update fields from request body
        slug: body.slug,
        name: body.name,
        description: body.description,
        image: body.image,

        // Convert price to string as required by the schema
        price:
          body.price !== undefined
            ? String(body.price)
            : existingTreatment.price,
        currency: body.currency || existingTreatment.currency,
        // Convert min/max prices to strings
        minPrice:
          body.minPrice !== undefined
            ? String(body.minPrice)
            : existingTreatment.minPrice,
        maxPrice:
          body.maxPrice !== undefined
            ? String(body.maxPrice)
            : existingTreatment.maxPrice,
        duration: body.duration,

        // Keep the original reference to template if it exists
        TreatmentMetaId: existingTreatment.TreatmentMetaId,
      },
    });

    return NextResponse.json(updatedTreatment);
  } catch (error) {
    console.error("Error updating treatment:", error);
    return NextResponse.json(
      { error: "Failed to update treatment" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { dentistId: string; treatmentId: string } }
) {
  try {
    const { dentistId, treatmentId } = params;

    // Fetch the treatment by ID and dentist ID
    const treatment = await db.treatments.findUnique({
      where: {
        id: treatmentId,
        dentistId: dentistId,
      },
    });

    if (!treatment) {
      return NextResponse.json(
        { error: "Treatment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(treatment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { dentistId: string; treatmentId: string } }
) {
  try {
    const { dentistId, treatmentId } = params;

    // Optional: Verify dentistId exists or matches logged-in admin's scope if needed

    // Check if treatment exists
    const existingTreatment = await db.treatments.findUnique({
      where: { id: treatmentId, dentistId: dentistId },
    });

    if (!existingTreatment) {
      return NextResponse.json(
        { error: "Treatment not found or does not belong to this dentist" },
        { status: 404 }
      );
    }

    // Delete the treatment
    await db.treatments.delete({
      where: { id: treatmentId },
    });

    return NextResponse.json(
      { message: "Treatment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting treatment:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { dentistId: string } }
) {
  try {
    const { dentistId } = params;
    const body = await request.json();

    // Validate request body using schema
    const validatedData = await treatmentUpdateSchema.parseAsync(body);

    // Prepare data for creation
    const createData = {
      name: validatedData.name!,
      description: validatedData.description ?? null,
      image: validatedData.image ?? null,
      price: validatedData.price ? parseFloat(validatedData.price) : null,
      currency: validatedData.currency ?? null,
      minPrice: validatedData.minPrice
        ? parseFloat(validatedData.minPrice)
        : null,
      maxPrice: validatedData.maxPrice
        ? parseFloat(validatedData.maxPrice)
        : null,
      duration: validatedData.duration ?? null,
      dentistId, // Associate with the given dentist ID
      slug: validatedData.slug ?? null,
    };

    // Create the new treatment
    const newTreatment = await db.treatments.create({
      data: createData as unknown as Treatments,
    });

    return NextResponse.json(newTreatment, { status: 201 });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
