import { db } from "@/db";
import { Dentist } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // const headersList = await headers();
  // const referer = headersList.get("referer");
  // const apiKey = headersList.get("x-api-key");

  // const isValidOrigin =
  //   referer && new URL(referer).origin === process.env.NEXT_PUBLIC_APP_URL;
  // const hasValidApiKey = apiKey === process.env.API_SECRET_KEY;

  // if (!isValidOrigin && !hasValidApiKey) {
  //   return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  // }

  try {
    const data = await request.json();

    // Basic validation of required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
      "gender",
      "speciality",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Required field ${field} is missing`,
          },
          { status: 400 }
        );
      }
    }

    // Check if a dentist with the same email or phone already exists
    const existingDentist = await db.dentist.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingDentist) {
      let duplicateField = "";
      if (existingDentist.email === data.email) duplicateField = "email";
      else if (existingDentist.phone === data.phone) duplicateField = "phone";
      else duplicateField = "name";

      return NextResponse.json(
        {
          success: false,
          error: `A dentist with this ${duplicateField} already exists`,
        },
        { status: 409 } // Conflict status code
      );
    }

    // Generate a slug from the name
    const slug =
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString().slice(-6);

    // Create the dentist record with businessHours as JSON
    const newDentist: Dentist = await db.dentist.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        speciality: data.speciality,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        gender: data.gender,
        priceStart: data.priceStart,
        image: data.image || "",
        // convert to json
        businessHours: JSON.stringify(data.businessHours),
        slug: slug,
        status: "pending",
        user: {
          connect: {
            id: data.userId || "cm227scs00000o1e91ffssejg",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Dentist created successfully",
      dentist: newDentist,
    });
  } catch (error) {
    console.error("Error creating dentist:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create dentist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
