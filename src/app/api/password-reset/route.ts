// src/app/api/password-reset/route.ts
import { db } from "@/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const passwordResetSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email using zod schema
    const validationResult = passwordResetSchema.safeParse({ email });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user exists with this email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    // Generate a unique reset token
    const resetToken = uuidv4();

    // Store the reset token in the database
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken,
        resetTokenExpires: new Date(Date.now() + 3600000), // 1 hour from now
      },
    });

    // Create reset password link
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://nextdentist.com";
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    try {
      // Send password reset email
      const emailResponse = await fetch(`${baseUrl}/api/password-reset-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: user.name || "User",
          template_id: process.env.PASSWORD_RESET_TEMPLATE,
          variables: {
            name: user.name || "User",
            link: resetLink,
          },
        }),
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        console.error("Email API error:", emailData);
        return NextResponse.json(
          {
            error: "Failed to send password reset email",
            details: emailData,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          message: "Password reset email has been sent",
          success: true,
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        {
          error: "Error sending password reset email",
          details:
            emailError instanceof Error
              ? emailError.message
              : String(emailError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
