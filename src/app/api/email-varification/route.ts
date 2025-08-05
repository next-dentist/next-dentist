// src/app/api/email-varification/route.ts
import { db } from "@/db";

import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const emailVerificationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const validationResult = emailVerificationSchema.safeParse({
      email,
      password,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if the email is already registered
    const existingUser = await db.user.findUnique({
      where: { email: validationResult.data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { available: false, message: "Email is already registered" },
        { status: 200 }
      );
    }

    const existingDentist = await db.dentist.findUnique({
      where: { email: validationResult.data.email },
    });

    if (existingDentist) {
      return NextResponse.json(
        { available: false, message: "Email is already registered" },
        { status: 200 }
      );
    }

    // Generate verification token
    const verificationToken = uuidv4();
    const tokenExpiration = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a temporary user record with verification token
    const tempUser = await db.user.create({
      data: {
        email: validationResult.data.email,
        resetToken: verificationToken,
        resetTokenExpires: tokenExpiration,
        password: hashedPassword,
        // Mark as unverified
        emailVerified: false,
      },
    });

    // Generate verification link
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

    // Use MSG91 API route to send the verification email
    try {
      // Call your existing email API route with an absolute URL
      const emailVerificationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/send-verification-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            template_id: process.env.VERIFICATION_TEMPLATE,
            variables: { link: verificationLink },
          }),
        }
      );

      if (!emailVerificationResponse.ok) {
        // If email sending fails, delete the temporary user
        await db.user.delete({
          where: { id: tempUser.id },
        });

        return NextResponse.json(
          { error: "Failed to send verification email" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "Verification link sent to your email. Please check your inbox.",
        },
        { status: 200 }
      );
    } catch (emailError) {
      // If email sending fails, delete the temporary user and return error
      await db.user.delete({
        where: { id: tempUser.id },
      });

      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to process email verification request" },
      { status: 500 }
    );
  }
}
