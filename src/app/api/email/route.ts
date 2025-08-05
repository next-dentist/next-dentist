// src/app/api/email/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, name, template_id } = await request.json();

    const url = new URL("https://control.msg91.com/api/v5/email/send");

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      authkey: process.env.MSG91_API_KEY || "",
    };

    const body = {
      recipients: [
        {
          to: [
            {
              email: email,
              name: name,
            },
          ],
        },
      ],
      from: {
        email: `no-reply@${process.env.DOMAIN}`,
      },
      domain: process.env.DOMAIN,
      template_id: template_id,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        message: "Email sent successfully",
        data: data,
      });
    } else {
      return NextResponse.json(
        {
          message: "Failed to send email",
          error: data,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
