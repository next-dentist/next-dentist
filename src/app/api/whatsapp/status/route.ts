import { NextRequest, NextResponse } from 'next/server';

// WhatsApp webhook handler for message status updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('WhatsApp Webhook received:', JSON.stringify(body, null, 2));

    // Verify webhook (WhatsApp sends this to verify the webhook URL)
    if (body.object === 'whatsapp_business_account') {
      // Process status updates
      if (body.entry && body.entry.length > 0) {
        for (const entry of body.entry) {
          if (entry.changes && entry.changes.length > 0) {
            for (const change of entry.changes) {
              if (change.field === 'messages') {
                const value = change.value;
                
                // Handle message status updates
                if (value.statuses && value.statuses.length > 0) {
                  for (const status of value.statuses) {
                    console.log('Message status update:', {
                      messageId: status.id,
                      status: status.status,
                      timestamp: status.timestamp,
                      recipientId: status.recipient_id,
                      conversation: status.conversation,
                      pricing: status.pricing
                    });
                    
                    // Here you can update your database with the message status
                    // await updateMessageStatus(status.id, status.status);
                  }
                }
                
                // Handle incoming messages (for future two-way communication)
                if (value.messages && value.messages.length > 0) {
                  for (const message of value.messages) {
                    console.log('Incoming message:', {
                      messageId: message.id,
                      from: message.from,
                      timestamp: message.timestamp,
                      type: message.type,
                      text: message.text?.body
                    });
                    
                    // Here you can handle incoming messages
                    // await handleIncomingMessage(message);
                  }
                }
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle webhook verification
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  console.log('WhatsApp webhook verification:', { mode, token, challenge });

  // Verify the webhook
  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.error('Webhook verification failed');
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 403 }
    );
  }
}