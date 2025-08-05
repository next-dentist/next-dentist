import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if we're in debug mode (for security)
    const body = await request.json();
    if (!body.debug) {
      return NextResponse.json({ error: 'Debug mode required' }, { status: 400 });
    }

    // Gather configuration information
    const config = {
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        isProduction: process.env.NODE_ENV === 'production',
        isDevelopment: process.env.NODE_ENV === 'development',
      },
      whatsappConfig: {
        hasAccessToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
        hasPhoneNumberId: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
        accessTokenLength: process.env.WHATSAPP_ACCESS_TOKEN?.length || 0,
        phoneNumberIdLength: process.env.WHATSAPP_PHONE_NUMBER_ID?.length || 0,
        // Show partial token for debugging (first 20 chars)
        accessTokenPreview: process.env.WHATSAPP_ACCESS_TOKEN?.substring(0, 20) + '...' || 'NOT_SET',
        phoneNumberIdPreview: process.env.WHATSAPP_PHONE_NUMBER_ID?.substring(0, 10) + '...' || 'NOT_SET',
      },
      serverInfo: {
        timestamp: new Date().toISOString(),
        requestOrigin: request.headers.get('origin'),
        requestHost: request.headers.get('host'),
        userAgent: request.headers.get('user-agent')?.substring(0, 100),
      },
      validation: {
        configErrors: [] as string[],
        recommendations: [] as string[]
      }
    };

    // Validate configuration
    if (!process.env.WHATSAPP_ACCESS_TOKEN) {
      config.validation.configErrors.push('WHATSAPP_ACCESS_TOKEN is not set');
      config.validation.recommendations.push('Add WHATSAPP_ACCESS_TOKEN to your environment variables');
    } else if (process.env.WHATSAPP_ACCESS_TOKEN.length < 50) {
      config.validation.configErrors.push('WHATSAPP_ACCESS_TOKEN appears to be too short');
      config.validation.recommendations.push('Verify your WhatsApp access token is complete');
    }

    if (!process.env.WHATSAPP_PHONE_NUMBER_ID) {
      config.validation.configErrors.push('WHATSAPP_PHONE_NUMBER_ID is not set');
      config.validation.recommendations.push('Add WHATSAPP_PHONE_NUMBER_ID to your environment variables');
    }

    if (process.env.NODE_ENV === 'production' && request.headers.get('origin')?.includes('localhost')) {
      config.validation.recommendations.push('You appear to be testing production from localhost - ensure actual production environment is configured');
    }

    // Return configuration analysis
    return NextResponse.json({
      success: true,
      ...config,
      configurationValid: config.validation.configErrors.length === 0
    });

  } catch (error) {
    console.error('WhatsApp config check error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check WhatsApp configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 