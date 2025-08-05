import { auth } from "@/auth";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET dentist profile
export async function GET() {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to access this resource" },
        { status: 401 }
      );
    }

    // First check if the user has a dentist profile
    const dentist = await db.dentist.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!dentist) {
      return NextResponse.json(
        { error: "Dentist profile not found" },
        { status: 404 }
      );
    }

    // Optionally verify dentist role if your app has specific roles
    // if (session.user.role !== "DENTIST") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    // }

    return NextResponse.json(dentist);
  } catch (error) {
    console.error("Error fetching dentist profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch dentist profile" },
      { status: 500 }
    );
  }
}

// Update dentist profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to update your profile" },
        { status: 401 }
      );
    }

    // Get update data from request
    const updateData = await request.json();

    // Find the dentist profile
    const dentist = await db.dentist.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!dentist) {
      return NextResponse.json(
        { error: "Dentist profile not found" },
        { status: 404 }
      );
    }

    // Update the dentist profile
    const updatedDentist = await db.dentist.update({
      where: {
        id: dentist.id,
      },
      data: {
        name: updateData.name,
        email: updateData.email,
        phone: updateData.phone,
        gender: updateData.gender,
        speciality: updateData.speciality,
        address: updateData.address,
        city: updateData.city,
        state: updateData.state,
        country: updateData.country,
        zipCode: updateData.zipCode,
        website: updateData.website,
        DegreesID: updateData.DegreesID,
        shortBio: updateData.shortBio,
        experience: updateData.experience,
        image: updateData.image,
      },
    });

    return NextResponse.json(updatedDentist);
  } catch (error) {
    console.error("Error updating dentist profile:", error);
    return NextResponse.json(
      { error: "Failed to update dentist profile" },
      { status: 500 }
    );
  }
}
