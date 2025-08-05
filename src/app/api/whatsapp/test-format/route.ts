import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, message } = body;

    // Validate required fields
    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, message' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length > 1024) {
      return NextResponse.json(
        { error: 'Message too long. Maximum 1024 characters.' },
        { status: 400 }
      );
    }

    // Create the exact payload that would be sent to WhatsApp API
    const whatsappPayload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: true,
        body: message,
      },
    };

    // Return the payload without sending it
    return NextResponse.json({
      success: true,
      message: 'Payload format validated successfully',
      payload: whatsappPayload,
      apiEndpoint: `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID || 'YOUR_PHONE_NUMBER_ID'}/messages`,
      officialDocumentation: 'https://developers.facebook.com/docs/whatsapp/cloud-api/messages/text-messages',
      notes: [
        'This endpoint validates the payload format without sending the message',
        'The payload follows the official WhatsApp Cloud API specification',
        'Text messages are limited to 1024 characters',
        'URLs in the message body are automatically hyperlinked',
        'Link previews are enabled by default'
      ]
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'WhatsApp API Format Test Endpoint',
    description: 'Test the WhatsApp API payload format without sending messages',
    usage: {
      method: 'POST',
      body: {
        to: '+1234567890',
        message: 'Your test message here'
      }
    },
    officialSpec: 'https://developers.facebook.com/docs/whatsapp/cloud-api/messages/text-messages'
  });
} 