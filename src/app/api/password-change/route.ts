// src/app/api/password-change/route.ts

import { db } from "@/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Enhanced password validation
const passwordChangeSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input data
    const validatedData = passwordChangeSchema.safeParse(body);

    if (!validatedData.success) {
      const errorMessage = validatedData.error.errors[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { token, password } = validatedData.data;

    // Check if token exists and is not expired
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Invalid or expired reset link. Please request a new password reset.",
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12); // Increased from 10 to 12 for better security

    // Update user record
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    // Log the successful password change (for security monitoring)
    console.info(`Password successfully changed for user ID: ${user.id}`);

    return NextResponse.json(
      {
        message: "Password updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Failed to update password. Please try again later." },
      { status: 500 }
    );
  }
}
