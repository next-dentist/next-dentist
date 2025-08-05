import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const treatmentCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().optional().nullable(),
  price: z.string().optional(),
  currency: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  duration: z.string().optional(),
  TreatmentMetaId: z.string().optional(),
  slug: z.string().optional(),
});

/**
 * GET handler to retrieve all treatments for a specific dentist
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { dentistId: string } }
) {
  try {
    // Make sure we have a dentistId
    const dentistId = params.dentistId;

    if (!dentistId) {
      return NextResponse.json(
        { error: "Dentist ID is required" },
        { status: 400 }
      );
    }

    // Get all treatments for this dentist
    const treatments = await db.treatments.findMany({
      where: {
        dentistId: dentistId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(treatments);
  } catch (error) {
    console.error("Error fetching treatments:", error);
    return NextResponse.json(
      { error: "Failed to fetch treatments" },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create a new treatment for a specific dentist
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { dentistId: string } }
) {
  try {
    // Make sure we have a dentistId
    const dentistId = params.dentistId;

    if (!dentistId) {
      return NextResponse.json(
        { error: "Dentist ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate the request body against the schema
    const validatedData = treatmentCreateSchema.parse(body);

    // Check if the dentist exists
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
    });

    if (!dentist) {
      return NextResponse.json({ error: "Dentist not found" }, { status: 404 });
    }

    // Create the new treatment with string values for price fields
    const newTreatment = await db.treatments.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        image: validatedData.image || null,
        price: validatedData.price || null,
        currency: validatedData.currency || "₹",
        minPrice: validatedData.minPrice || null,
        maxPrice: validatedData.maxPrice || null,
        duration: validatedData.duration || null,
        slug: validatedData.slug || null,
        dentist: {
          connect: { id: dentistId },
        },
        TreatmentMeta: validatedData.TreatmentMetaId
          ? {
              connect: { id: validatedData.TreatmentMetaId },
            }
          : undefined,
      },
    });

    return NextResponse.json(newTreatment, { status: 201 });
  } catch (error) {
    console.error("Error creating treatment:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create treatment" },
      { status: 500 }
    );
  }
}
