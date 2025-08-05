// src/app/api/send-verification-link/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, template_id, variables } = await request.json();

  const url = new URL("https://control.msg91.com/api/v5/email/send");

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    authkey: process.env.MSG91_API_KEY || "",
  };

  const body = {
    recipients: [
      {
        to: [{ email }],
        variables: {
          link: variables.link,
        },
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

  return NextResponse.json(data);
}
