import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const hasAccessToken = !!process.env.WHATSAPP_ACCESS_TOKEN;
    const hasPhoneNumberId = !!process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    const config = {
      hasAccessToken,
      hasPhoneNumberId,
      accessTokenLength: hasAccessToken ? process.env.WHATSAPP_ACCESS_TOKEN!.length : 0,
      phoneNumberId: hasPhoneNumberId ? process.env.WHATSAPP_PHONE_NUMBER_ID : 'Not set',
      accessTokenPreview: hasAccessToken ? 
        `${process.env.WHATSAPP_ACCESS_TOKEN!.substring(0, 10)}...` : 'Not set'
    };

    // Test WhatsApp API connection
    let apiConnectionTest: {
      status: number | string;
      success: boolean;
      data?: any;
      error?: any;
    } | null = null;
    
    if (hasAccessToken && hasPhoneNumberId) {
      try {
        const response = await fetch(
          `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            },
          }
        );

        const data = await response.json();
        
        apiConnectionTest = {
          status: response.status,
          success: response.ok,
          data: response.ok ? data : undefined,
          error: !response.ok ? data : undefined
        };
      } catch (error) {
        apiConnectionTest = {
          status: 'Connection Error',
          success: false,
          error: (error as Error).message
        };
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      configuration: config,
      apiConnectionTest,
      recommendations: [
        !hasAccessToken && 'Set WHATSAPP_ACCESS_TOKEN environment variable',
        !hasPhoneNumberId && 'Set WHATSAPP_PHONE_NUMBER_ID environment variable',
        apiConnectionTest && !apiConnectionTest.success && 'Check WhatsApp API credentials and permissions',
        'Ensure your WhatsApp Business account is properly configured',
        'Verify that your phone number is registered with WhatsApp Business API'
      ].filter(Boolean),
      troubleshootingSteps: [
        '1. Verify WhatsApp Business API setup in Meta Business Manager',
        '2. Check that your access token has the correct permissions',
        '3. Ensure your phone number ID is correct',
        '4. Test with a phone number that has messaged your WhatsApp Business number recently',
        '5. Check WhatsApp Business API webhook configuration if using webhooks'
      ]
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Debug endpoint error',
        details: (error as Error).message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 