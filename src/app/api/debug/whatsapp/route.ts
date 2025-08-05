import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if this is development environment
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Debug endpoint only available in development' }, { status: 403 });
    }

    // Check environment variables
    const config = {
      hasAccessToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
      hasPhoneNumberId: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
      accessTokenLength: process.env.WHATSAPP_ACCESS_TOKEN?.length || 0,
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || 'NOT_SET',
      accessTokenPreview: process.env.WHATSAPP_ACCESS_TOKEN?.substring(0, 20) + '...' || 'NOT_SET'
    };

    // Test WhatsApp API connectivity
    let apiTest: { success: boolean; status?: number; data?: any; error?: string } | null = null;
    if (config.hasAccessToken && config.hasPhoneNumberId) {
      try {
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}?fields=id,display_phone_number,verified_name`,
          {
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            },
          }
        );

        const data = await response.json();
        apiTest = {
          success: response.ok,
          status: response.status,
          data: data
        };
      } catch (error) {
        apiTest = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      config,
      apiTest,
      recommendations: generateRecommendations(config, apiTest)
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Debug endpoint failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function generateRecommendations(config: any, apiTest: any): string[] {
  const recommendations: string[] = [];

  if (!config.hasAccessToken) {
    recommendations.push('Set WHATSAPP_ACCESS_TOKEN environment variable');
  }

  if (!config.hasPhoneNumberId) {
    recommendations.push('Set WHATSAPP_PHONE_NUMBER_ID environment variable');
  }

  if (config.accessTokenLength > 0 && config.accessTokenLength < 50) {
    recommendations.push('WHATSAPP_ACCESS_TOKEN appears too short - verify it\'s correct');
  }

  if (apiTest && !apiTest.success) {
    if (apiTest.data?.error?.code === 190) {
      recommendations.push('Access token is invalid or expired - regenerate in Meta Business Manager');
    } else if (apiTest.data?.error?.code === 100) {
      recommendations.push('Phone number ID is invalid - verify in WhatsApp Business API settings');
    } else {
      recommendations.push('WhatsApp API connectivity failed - check your Business Manager setup');
    }
  }

  if (apiTest && apiTest.success) {
    recommendations.push('✅ WhatsApp API is properly configured and accessible');
  }

  return recommendations;
}

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Debug endpoint only available in development' }, { status: 403 });
    }

    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    // Test sending a message to the specified phone number
    const testMessage = {
      messaging_product: 'whatsapp',
      to: phone.replace('+', ''),
      type: 'text',
      text: {
        body: 'Test message from NextDentist WhatsApp API. If you receive this, the integration is working correctly.'
      }
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testMessage),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      response: data,
      sentTo: phone
    });

  } catch (error) {
    console.error('Debug test message error:', error);
    return NextResponse.json(
      { error: 'Test message failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 