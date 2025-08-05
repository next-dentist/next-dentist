# WhatsApp API Documentation

This document describes the WhatsApp API endpoints available in the NextDentist application for sending messages via WhatsApp Business API.

## Overview

The WhatsApp API allows you to send various types of messages to users through WhatsApp Business API. The application supports both template messages and custom text messages.

## Environment Variables

Make sure you have the following environment variables configured:

```env
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
```

## API Endpoints

### 1. Send Template Message

**Endpoint:** `POST /api/whatsapp/send`

**Description:** Sends a predefined template message (hello_world template).

**Request Body:**
```json
{
  "to": "+911234567890"
}
```

**Response:**
```json
{
  "messaging_product": "whatsapp",
  "messages": [
    {
      "id": "message_id"
    }
  ]
}
```

### 2. Send Verification Code (Template)

**Endpoint:** `POST /api/whatsapp/verify`

**Description:** Sends a verification code using a predefined template.

**Request Body:**
```json
{
  "to": "+911234567890",
  "code": "123456"
}
```

**Response:**
```json
{
  "messaging_product": "whatsapp",
  "messages": [
    {
      "id": "message_id"
    }
  ]
}
```

### 3. Send Verification Code (Plain Text)

**Endpoint:** `POST /api/whatsapp/verify-plain`

**Description:** Sends a verification code as plain text message.

**Request Body:**
```json
{
  "to": "+911234567890",
  "code": "123456"
}
```

**Response:**
```json
{
  "messaging_product": "whatsapp",
  "messages": [
    {
      "id": "message_id"
    }
  ]
}
```

### 4. Send Custom Message ⭐ NEW

**Endpoint:** `POST /api/whatsapp/custom`

**Description:** Sends a custom text message with any content you specify.

**Request Body:**
```json
{
  "to": "+911234567890",
  "message": "Your custom message here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "WhatsApp message sent successfully",
  "data": {
    "messageId": "wamid.xxx",
    "to": "+911234567890",
    "messageLength": 25,
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "whatsappResponse": {
    "messaging_product": "whatsapp",
    "messages": [
      {
        "id": "wamid.xxx"
      }
    ]
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid phone number format",
  "expected": "International format (e.g., +911234567890)",
  "received": "1234567890"
}
```

## Validation Rules

### Phone Number Format
- Must be in international format (e.g., `+911234567890`)
- Must start with `+` followed by country code
- Must be between 7-15 digits total
- Regex pattern: `/^\+[1-9]\d{1,14}$/`

### Message Content
- Maximum length: 1024 characters (WhatsApp API limit for text messages)
- Cannot be empty
- Supports plain text with automatic URL hyperlinking
- URLs are automatically rendered with link previews when possible

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid input (missing fields, wrong format, etc.)
- `500 Internal Server Error`: Server configuration issues or WhatsApp API errors

Common error scenarios:
- Missing required fields (`to`, `message`)
- Invalid phone number format
- Message too long (>1024 characters)
- Missing environment variables
- WhatsApp API errors
- 24-hour messaging window violation
- Recipient hasn't messaged your business number first

## Usage Examples

### JavaScript/TypeScript

```typescript
import { sendCustomWhatsAppMessage } from '@/lib/utils';

// Send custom message
const response = await sendCustomWhatsAppMessage(
  '+911234567890',
  'Hello! Your appointment is confirmed for tomorrow at 2 PM.'
);

if (response.success) {
  console.log('Message sent successfully:', response.data.messageId);
} else {
  console.error('Failed to send message:', response.error);
}
```

### Fetch API

```javascript
const response = await fetch('/api/whatsapp/custom', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: '+911234567890',
    message: 'Your custom message here'
  }),
});

const data = await response.json();
```

### cURL

```bash
curl -X POST http://localhost:3000/api/whatsapp/custom \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+911234567890",
    "message": "Hello from NextDentist!"
  }'
```

## Testing

You can test the WhatsApp API using the provided test pages:

1. **Template Message Test:** `/whatsapp/verify-test`
2. **Custom Message Test:** `/whatsapp/test-custom`

These pages provide a user-friendly interface to test all WhatsApp functionality.

## Rate Limits

Be aware of WhatsApp Business API rate limits:
- Standard rate: 1000 messages per second
- Template messages: 250 messages per second
- Custom messages: Subject to WhatsApp's current limits

## Best Practices

1. **Always validate phone numbers** before sending messages
2. **Handle errors gracefully** and provide meaningful error messages
3. **Respect user privacy** and only send messages to users who have opted in
4. **Use appropriate message content** that complies with WhatsApp's policies
5. **Monitor API responses** for successful delivery
6. **Implement retry logic** for failed messages (with exponential backoff)

## Security Considerations

1. **Environment Variables:** Never expose WhatsApp credentials in client-side code
2. **Input Validation:** Always validate and sanitize user inputs
3. **Rate Limiting:** Implement rate limiting to prevent abuse
4. **Logging:** Log API calls for monitoring and debugging (avoid logging sensitive data)

## Troubleshooting

### Common Issues

1. **"WhatsApp configuration missing"**
   - Check that `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` are set
   - Verify the values are correct in your WhatsApp Business account

2. **"Invalid phone number format"**
   - Ensure phone numbers are in international format
   - Remove any spaces, dashes, or other formatting

3. **"Message too long"**
   - Keep messages under 4096 characters
   - Consider breaking long messages into multiple parts

4. **WhatsApp API errors**
   - Check the WhatsApp Business API documentation
   - Verify your account has the necessary permissions
   - Ensure your templates are approved (for template messages)

### Debug Mode

Enable debug logging by checking the browser console or server logs for detailed error information. 