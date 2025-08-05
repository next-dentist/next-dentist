// app/api/whatsapp/verify/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { to, code } = body; // Expected: { to: "+91xxxxxxxxxx", code: "123456" }

    if (!to || !code) {
      return NextResponse.json(
        { error: 'Missing required fields: to, code' },
        { status: 400 }
      );
    }

    // You should have a WhatsApp template for verification, e.g., "verification_code"
    // and it should accept a parameter for the code.
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
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
            name: 'nd_verify_code_1', // Make sure this template exists in your WhatsApp Business account

            language: { code: 'en_US' },
            components: [
              {
                type: 'body',
                parameters: [
                  {
                    type: 'text',
                    text: code,
                  },
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to send verification code' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
