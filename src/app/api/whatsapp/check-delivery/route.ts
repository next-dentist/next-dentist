import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Check if required environment variables are set
    if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
      return NextResponse.json(
        { error: 'WhatsApp configuration missing' },
        { status: 500 }
      );
    }

    // Try to get message status from WhatsApp API
    const response = await fetch(
      `https://graph.facebook.com/v23.0/${messageId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: 'Failed to check message status',
        details: data,
        troubleshooting: [
          'Message ID might be invalid or expired',
          'Check if the message was sent recently',
          'Verify your access token has the correct permissions'
        ]
      });
    }

    return NextResponse.json({
      success: true,
      messageId,
      status: data,
      timestamp: new Date().toISOString()
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
    message: 'WhatsApp Message Delivery Check',
    description: 'Check the delivery status of a WhatsApp message',
    usage: {
      method: 'POST',
      body: {
        messageId: 'wamid.HBgMOTE5OTc5MjAyOTU1FQIAERgSNkNFMUE4MzBDNDZEOURFM0Y0AA=='
      }
    },
    note: 'Use the message ID returned from the send message API'
  });
} 