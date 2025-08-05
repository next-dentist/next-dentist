import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { to, message } = body; // Expected: { to: "+91xxxxxxxxxx", message: "Your custom message" }

    // Validate required fields
    if (!to || !message) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          required: ['to', 'message'],
          received: Object.keys(body)
        },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to)) {
      return NextResponse.json(
        { 
          error: 'Invalid phone number format', 
          expected: 'International format (e.g., +911234567890)',
          received: to
        },
        { status: 400 }
      );
    }

    // Validate message length (WhatsApp has limits - 1024 characters for text messages)
    if (message.length > 1024) {
      return NextResponse.json(
        { 
          error: 'Message too long', 
          maxLength: 1024,
          currentLength: message.length,
          note: 'WhatsApp text messages have a maximum of 1024 characters'
        },
        { status: 400 }
      );
    }

    // Check if required environment variables are set
    if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
      return NextResponse.json(
        { 
          error: 'WhatsApp configuration missing',
          missing: [
            !process.env.WHATSAPP_ACCESS_TOKEN && 'WHATSAPP_ACCESS_TOKEN',
            !process.env.WHATSAPP_PHONE_NUMBER_ID && 'WHATSAPP_PHONE_NUMBER_ID'
          ].filter(Boolean)
        },
        { status: 500 }
      );
    }

    // Log the request for debugging
    console.log('WhatsApp Custom Message Request:', {
      to,
      messageLength: message.length,
      timestamp: new Date().toISOString()
    });

    // Prepare the WhatsApp API request according to official documentation
    const whatsappPayload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: true, // Enable link preview for URLs
        body: message,
      },
    };

    console.log('WhatsApp API Payload:', JSON.stringify(whatsappPayload, null, 2));

    // Send custom text message via WhatsApp API using latest API version
    const response = await fetch(
      `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whatsappPayload),
      }
    );

    const data = await response.json();

    // Log the response for debugging
    console.log('WhatsApp API Response Status:', response.status);
    console.log('WhatsApp API Response Data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('WhatsApp API Error:', data);
      
      // Handle specific WhatsApp API errors
      let errorMessage = 'Failed to send WhatsApp message';
      let troubleshootingTips: string[] = [];

      if (data.error) {
        errorMessage = data.error.message || data.error.error_user_msg || errorMessage;
        
        // Common WhatsApp API error handling
        if (data.error.code === 131000) {
          troubleshootingTips.push('Recipient phone number is not a valid WhatsApp number');
        } else if (data.error.code === 131005) {
          troubleshootingTips.push('Recipient has not accepted our Terms of Service');
        } else if (data.error.code === 131047) {
          troubleshootingTips.push('Re-engagement message - recipient has not messaged you in 24 hours');
          troubleshootingTips.push('Try using a template message instead for initial contact');
        } else if (data.error.code === 131051) {
          troubleshootingTips.push('Unsupported message type or format');
        } else if (data.error.code === 100) {
          troubleshootingTips.push('Invalid access token or permissions');
        }
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          whatsappError: data.error,
          troubleshooting: troubleshootingTips.length > 0 ? troubleshootingTips : [
            'Check that the phone number is a valid WhatsApp number',
            'Ensure the recipient has messaged your WhatsApp Business number within 24 hours',
            'Consider using a template message for initial contact',
            'Verify your WhatsApp Business API credentials and permissions'
          ],
          status: response.status,
          fullResponse: data
        },
        { status: response.status }
      );
    }

    // Success response
    const successResponse = {
      success: true,
      message: 'WhatsApp message sent successfully',
      data: {
        messageId: data.messages?.[0]?.id,
        to,
        messageLength: message.length,
        timestamp: new Date().toISOString()
      },
      whatsappResponse: data
    };

    console.log('WhatsApp Success Response:', JSON.stringify(successResponse, null, 2));
    
    return NextResponse.json(successResponse);

  } catch (error) {
    console.error('WhatsApp Custom Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: (error as Error).message,
        troubleshooting: [
          'Check server logs for detailed error information',
          'Verify network connectivity to WhatsApp API',
          'Ensure environment variables are properly configured'
        ]
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for testing/health check
export async function GET() {
  return NextResponse.json({
    message: 'WhatsApp Custom Message API',
    status: 'active',
    endpoints: {
      POST: {
        description: 'Send custom WhatsApp message',
        body: {
          to: 'string (phone number in international format)',
          message: 'string (custom message text)'
        },
        example: {
          to: '+919979202955',
          message: 'Hello! This is a custom message from NextDentist.'
        }
      }
    },
    importantNotes: [
      'WhatsApp Business API has a 24-hour messaging window for free-form messages',
      'Recipients must have messaged your WhatsApp Business number first',
      'For initial contact, use template messages instead',
      'Ensure the recipient phone number is a valid WhatsApp number'
    ]
  });
}
