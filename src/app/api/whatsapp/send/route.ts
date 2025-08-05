// app/api/whatsapp/send/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  const { to } = body; // Expected: +91xxxxxxxxxx

  const response = await fetch(`https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: 'hello_world',
        language: { code: 'en_US' },
      },
    }),
  });

  const data = await response.json();

  return NextResponse.json(data);
}
