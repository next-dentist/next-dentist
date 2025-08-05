import { NextResponse } from 'next/server';

// Webhook verification (required by WhatsApp)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  
  // Verify webhook token (set this in your environment variables)
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'your_verify_token';
  
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified successfully');
    return new Response(challenge);
  }
  
  return NextResponse.json({ error: 'Webhook verification failed' }, { status: 403 });
}

// Handle incoming webhook events
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('WhatsApp Webhook Event:', JSON.stringify(body, null, 2));
    
    // Check if this is a message status update
    if (body.entry && body.entry[0] && body.entry[0].changes) {
      const changes = body.entry[0].changes;
      
      for (const change of changes) {
        if (change.field === 'messages') {
          const value = change.value;
          
          // Handle message status updates
          if (value.statuses) {
            for (const status of value.statuses) {
              console.log('Message Status Update:', {
                messageId: status.id,
                status: status.status,
                timestamp: status.timestamp,
                recipientId: status.recipient_id,
                errors: status.errors
              });
              
              // Log delivery failures
              if (status.status === 'failed') {
                console.error('Message Delivery Failed:', {
                  messageId: status.id,
                  errors: status.errors,
                  timestamp: new Date(parseInt(status.timestamp) * 1000).toISOString()
                });
              }
            }
          }
          
          // Handle incoming messages
          if (value.messages) {
            for (const message of value.messages) {
              console.log('Incoming Message:', {
                messageId: message.id,
                from: message.from,
                type: message.type,
                timestamp: message.timestamp,
                text: message.text?.body
              });
            }
          }
        }
      }
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
} 