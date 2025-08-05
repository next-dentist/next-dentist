"use server";

import { db } from "@/db";
import { TreatmentFormValues } from "@/schemas";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const treatmentSchema = z.object({
  seo_title: z.string(),
  seo_description: z.string(),
  seo_extra: z.string().optional().default("{}"),
  seo_keyword: z.string(),
});

// create a server action to edit SEO details of treatment by id
// add error handling

export async function getTreatment(slug: string) {
  const treatment = await db.treatmentMeta.findUnique({
    where: { slug },
  });
  return treatment;
}

export async function editSeoDetails(
  id: string,
  seoDetails: z.infer<typeof treatmentSchema>
) {
  try {
    const validatedData = treatmentSchema.parse(seoDetails);

    const currentTreatment = await db.treatmentMeta.findUnique({
      where: { id },
    });

    const dataToUpdate = {
      seo_title: validatedData.seo_title,
      seo_description: validatedData.seo_description,
      seo_extra: validatedData.seo_extra
        ? JSON.parse(validatedData.seo_extra)
        : null,
      seo_keyword: validatedData.seo_keyword,
    };

    const treatment = await db.treatmentMeta.update({
      where: { id },
      data: dataToUpdate,
    });

    return { success: true, data: treatment };
  } catch (error) {
    console.error("Full error object:", error);

    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return {
        success: false,
        error: "Invalid input data",
        details: error.errors,
      };
    }

    if (error instanceof SyntaxError) {
      console.error("JSON parsing error:", error.message);
      return {
        success: false,
        error: "Invalid JSON format in SEO Extra field",
      };
    }

    if (error instanceof Error) {
      console.error("Error updating treatment SEO details:", error.message);
      return {
        success: false,
        error: "Failed to update treatment SEO details: " + error.message,
      };
    }

    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// create a server action to add a new treatment
export async function addTreatment(TreatmentMeta: TreatmentFormValues) {
  try {
    // Only pick fields that exist in TreatmentMeta model
    const {
      name,
      slug,
      duration,
      relatedKeys,
      description,
      image,
      video,
      imageCaption,
      imageCaptionLink,
      imageTopRightDescription,
      imageTopRightLink,
      imageTopRightText,
      // imageTopRightLinkText, // REMOVE THIS if not in Prisma schema
    } = TreatmentMeta;

    const treatment = await db.treatmentMeta.create({
      data: {
        name,
        slug,
        duration,
        relatedKeys,
        description,
        image,
        video,
        imageCaption,
        imageCaptionLink,
        imageTopRightDescription,
        imageTopRightLink,
        imageTopRightText,
        // imageTopRightLinkText, // REMOVE THIS if not in Prisma schema
      },
    });
    return { success: true, data: treatment };
  } catch (error) {
    console.error("Error creating treatment:", error);

    // Zod validation errors
    if (error instanceof z.ZodError) {
      console.error("Validation error details:", error.errors);
      return {
        success: false,
        error: "Invalid input data",
        details: error.errors,
      };
    }

    // Prisma unique constraint / known request errors
    if (
      (error as any)?.code === "P2002" ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      const target = Array.isArray((error as any).meta?.target)
        ? ((error as any).meta.target as string[]).join(", ")
        : "unknown field";
      return {
        success: false,
        error: `Unique constraint failed on ${target}`,
      };
    }

    // Generic JavaScript errors
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Fallback for anything else
    return {
      success: false,
      error: "An unexpected error occurred while adding treatment",
    };
  }
}

