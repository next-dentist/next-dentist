import { auth } from "@/auth";
import { db } from "@/db";
import { DentistStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for Dentist model according to schema.prisma
const dentistUpdateSchema = z.object({
  userId: z.string().optional(),
  dob: z.string().optional().nullable(),
  priceStart: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  verified: z.boolean().optional(),
  currency: z.string().optional().nullable(),
  freeConsultation: z.boolean().optional(),
  experience: z.string().optional().nullable(),
  shortBio: z.string().optional().nullable(),
  longBio: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  slug: z.string().optional(),
  status: z.nativeEnum(DentistStatus).optional(),
  rating: z.number().optional().nullable(),
  practiceLocation: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  speciality: z.string().optional().nullable(),
  businessHours: z
    .union([z.record(z.any()), z.array(z.any()), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return Prisma.JsonNull;
        }
      }
      return val === null || val === undefined ? Prisma.JsonNull : val;
    }),
  acceptsInsurance: z.boolean().optional().nullable(),
  DegreesID: z.string().optional().nullable(),
  dentistDegree: z
    .union([z.array(z.any()), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return Prisma.JsonNull;
        }
      }
      return val === null || val === undefined ? Prisma.JsonNull : val;
    }),
  socialLinks: z
    .union([z.record(z.string()), z.object({}).passthrough()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined) {
        return Prisma.JsonNull;
      }
      return val;
    }),
  awards: z
    .union([z.array(z.any()), z.object({}).passthrough(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return Prisma.JsonNull;
        }
      }
      return val === null || val === undefined ? Prisma.JsonNull : val;
    }),
  alumniOf: z
    .union([z.array(z.any()), z.object({}).passthrough(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return Prisma.JsonNull;
        }
      }
      return val === null || val === undefined ? Prisma.JsonNull : val;
    }),
  workingAt: z
    .union([z.array(z.any()), z.object({}).passthrough(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return Prisma.JsonNull;
        }
      }
      return val === null || val === undefined ? Prisma.JsonNull : val;
    }),
  knowsAbout: z
    .union([z.array(z.any()), z.object({}).passthrough(), z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return Prisma.JsonNull;
        }
      }
      return val === null || val === undefined ? Prisma.JsonNull : val;
    }),
  treatmentCompleted: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) =>
      val === "" || val === undefined || val === null ? undefined : Number(val)
    )
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Must be a valid number",
    }),
  patientsServed: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) =>
      val === "" || val === undefined || val === null ? undefined : Number(val)
    )
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Must be a valid number",
    }),
  isAvailable: z.boolean().optional().nullable(),
  isQuickResponse: z.boolean().optional().nullable(),
  hasVideoCall: z.boolean().optional().nullable(),
  specialLineOneTitle: z.string().optional().nullable(),
  specialLineOne: z.string().optional().nullable(),
  specialLineTwoTitle: z.string().optional().nullable(),
  specialLineTwo: z.string().optional().nullable(),
  specialLineThreeTitle: z.string().optional().nullable(),
  specialLineThree: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  dateAndTime: z.string().datetime().optional().nullable(),
  updatedDateAndTime: z.string().datetime().optional().nullable(),
  images: z.object({
    create: z.array(z.object({
      url: z.string().url(),
      alt: z.string().optional(),
      height: z.number().optional(),
      width: z.number().optional(),
    })).optional(),
    deleteMany: z.array(z.object({
      id: z.string(),
    })).optional(),
  }).optional(),
}).partial();

// GET: Get a single dentist by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { dentistId: string } }
) {
  try {
    const dentistId = params.dentistId;

    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
      include: {
        images: true,
        languages: true,
        treatments: true,
        post: true,
        FavoriteDentists: true,
        SavedDentists: true,
        TreatmentsReviews: true,
      },
    });

    if (!dentist) {
      return NextResponse.json({ error: "Dentist not found" }, { status: 404 });
    }

    return NextResponse.json(dentist);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch dentist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH: Update a dentist by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { dentistId: string } }
) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "DENTIST")
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const dentistId = params.dentistId;
    if (!dentistId) {
      return NextResponse.json(
        { message: "Dentist ID is required" },
        { status: 400 }
      );
    }

    // If DENTIST, ensure they are updating their own profile
    if (session.user.role === "DENTIST") {
      const dentistProfile = await db.dentist.findUnique({
        where: { id: dentistId },
        select: { userId: true },
      });
      if (!dentistProfile || dentistProfile.userId !== session.user.id) {
        return NextResponse.json(
          { message: "Forbidden: Dentists can only update their own profile" },
          { status: 403 }
        );
      }
    }

    const body = await request.json();

    const validation = dentistUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const dataToUpdate = validation.data;

    // Handle images separately if present
    let imagesUpdate: any = undefined;
    if (dataToUpdate.images) {
      imagesUpdate = {};
      if (dataToUpdate.images.create && dataToUpdate.images.create.length > 0) {
        imagesUpdate.create = dataToUpdate.images.create;
      }
      if (dataToUpdate.images.deleteMany && dataToUpdate.images.deleteMany.length > 0) {
        imagesUpdate.deleteMany = dataToUpdate.images.deleteMany;
      }
      // Remove images from the main update data
      delete dataToUpdate.images;
    }

    // Remove undefined fields (Prisma will not update them)
    Object.keys(dataToUpdate).forEach(
      (key) => dataToUpdate[key as keyof typeof dataToUpdate] === undefined && delete dataToUpdate[key as keyof typeof dataToUpdate]
    );


    // Prepare the update object
    const updateData: any = { ...dataToUpdate };
    if (imagesUpdate && (imagesUpdate.create || imagesUpdate.deleteMany)) {
      updateData.images = imagesUpdate;
    }

    const updatedDentist = await db.dentist.update({
      where: { id: dentistId },
      data: updateData,
      include: {
        images: true,
        languages: true,
        treatments: true,
        post: true,
        FavoriteDentists: true,
        SavedDentists: true,
        TreatmentsReviews: true,
      },
    });

    return NextResponse.json(updatedDentist);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Dentist not found" },
          { status: 404 }
        );
      }
    } else if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Invalid data structure after parse",
          errors: error.flatten(),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a dentist by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { dentistId: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const dentistId = params.dentistId;
    const dentist = await db.dentist.findUnique({
      where: { id: dentistId },
    });

    if (!dentist) {
      return NextResponse.json({ error: "Dentist not found" }, { status: 404 });
    }

    await db.dentist.delete({
      where: { id: dentistId },
    });

    return NextResponse.json({
      success: true,
      message: "Dentist deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete dentist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
