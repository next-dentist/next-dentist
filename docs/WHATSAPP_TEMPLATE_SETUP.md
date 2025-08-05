# WhatsApp AUTHENTICATION Template Setup Guide

⚠️ **CRITICAL COMPLIANCE NOTICE**: WhatsApp Business API **requires** approved AUTHENTICATION category templates for OTP messages to unregistered numbers. Plain text messages will be **rejected** and are **not supported**.

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# WhatsApp Business API Configuration (REQUIRED)
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id_here

# AUTHENTICATION Template Configuration (MANDATORY for OTP)
WHATSAPP_OTP_TEMPLATE_NAME=nd_verfiy_code_1
WHATSAPP_TEMPLATE_LANGUAGE=en_US

# Webhook configuration (optional - for message status tracking)
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token_here
```

## 🚨 Mandatory Template Requirements

### AUTHENTICATION Template Setup (REQUIRED)

1. **Create an OTP Template in Meta Business Manager:**
   - Go to Meta Business Manager > WhatsApp Manager
   - Select your Business Account > Message Templates
   - Create a new template with these **exact** details:
     - **Name**: `nd_verfiy_code_1` (or set your custom name in env)
     - **Category**: `AUTHENTICATION` ⚠️ **MANDATORY** (This is the ONLY valid category for OTP)
     - **Language**: `English (US)`
     - **Header**: None
     - **Body**: `Your NextDentist verification code is: {{1}}. This code will expire in 5 minutes. Please do not share this code with anyone.`
     - **Footer**: None
     - **Buttons**: 
       - **Type**: `Call to Action`
       - **Button Type**: `Visit Website`
       - **Button Text**: `Verify Now`
       - **Website URL**: `https://nextdentist.com/verify-whatsapp-otp?code={{1}}` ({{1}} will be replaced with `verify-{OTP}`)

2. **Wait for Approval** (usually takes 24-48 hours)
   - Status must be `APPROVED` before use
   - Template must pass Meta's AUTHENTICATION category review

3. **Set Environment Variables:**
   ```bash
   WHATSAPP_OTP_TEMPLATE_NAME=nd_verfiy_code_1
   WHATSAPP_TEMPLATE_LANGUAGE=en_US
   WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
   ```

## ❌ What's No Longer Supported

- **Plain Text Messages**: Removed for compliance
- **Text Message Fallback**: Disabled to prevent policy violations
- **Optional Templates**: Templates are now **mandatory** for OTP

## Testing

### Test Template Message (if configured):
```bash
curl -i -X POST \
  "https://graph.facebook.com/v22.0/$WHATSAPP_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "919979202955",
    "type": "template",
    "template": {
      "name": "otp_verification",
      "language": {
        "code": "en_US"
      },
      "components": [
        {
          "type": "body",
          "parameters": [
            {
              "type": "text",
              "text": "123456"
            }
          ]
        }
      ]
    }
  }'
```

### Test Text Message (fallback):
```bash
curl -i -X POST \
  "https://graph.facebook.com/v22.0/$WHATSAPP_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "919979202955",
    "type": "text",
    "text": {
      "body": "Your NextDentist verification code is: 123456\n\nThis code will expire in 5 minutes. Please do not share this code with anyone."
    }
  }'
```

## How the Updated Code Works

1. **Template First**: If `WHATSAPP_OTP_TEMPLATE_NAME` is set, it tries to send a template message
2. **Automatic Fallback**: If template fails, it automatically tries a text message
3. **Enhanced Logging**: Shows which message type was used and why
4. **Better Error Handling**: Specific error messages for template vs text message failures

## Common Error Codes

- **131009**: Template not found (check template name and approval status)
- **132000**: Template parameter error (check parameter format)
- **131047**: Invalid WhatsApp number
- **190**: Invalid access token
- **10**: Permission error (check Meta Business App permissions)

## Enhanced Features

### 🔒 **Strict AUTHENTICATION Template Enforcement**
- Only approved AUTHENTICATION templates are used
- No fallback to plain text (compliance requirement)
- Template validation before sending

### 🔒 **Improved Security**
- Uses `crypto.randomInt()` for OTP generation when available
- Enhanced error handling with timeout protection
- Request validation and sanitization

### 📊 **Message Status Tracking**
- Webhook endpoint: `/api/whatsapp/status`
- Tracks delivery, read, and failed status
- Future support for two-way messaging

### 📱 **Media Message Support**
- `sendMediaMessage()` function for images, documents, audio, video
- Based on WhatsApp Business API media patterns
- Ready for future features like appointment confirmations with images

### ⚡ **Performance Improvements**
- 30-second timeout protection
- Enhanced axios configuration following reference patterns
- Better error categorization and handling

## Webhook Setup (Optional)

1. **Configure Webhook URL** in Meta Business Manager:
   ```
   https://your-domain.com/api/whatsapp/status
   ```

2. **Set Verify Token** in environment:
   ```bash
   WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_unique_token_here
   ```

3. **Subscribe to Events**:
   - messages
   - message_deliveries
   - message_reads

## New API Functions

```typescript
// Validate AUTHENTICATION template (IMPORTANT!)
const validation = await validateAuthenticationTemplate();
console.log(validation.isValid); // true/false
console.log(validation.category); // Should be "AUTHENTICATION"
console.log(validation.status); // Should be "APPROVED"

// Check message delivery status
const status = await checkMessageStatus(messageId);

// Send media messages (future use)
const result = await sendMediaMessage(
  "+919979202955",
  "image", 
  "media_id_here",
  "Caption text"
);
```

## Template Validation Script

Add this to test your template setup:

```javascript
// Test your AUTHENTICATION template
import { validateAuthenticationTemplate } from '@/app/actions/whatsapp-auth';

const testTemplate = async () => {
  const result = await validateAuthenticationTemplate();
  
  if (result.isValid) {
    console.log('✅ Template is ready for OTP authentication');
  } else {
    console.error('❌ Template validation failed:', result.message);
  }
};
```

## Troubleshooting

1. **Template Not Working**: Ensure template is approved in Meta Business Manager
2. **Text Message Blocked**: Some WhatsApp Business accounts require templates for certain message types
3. **Permission Errors**: Check your Meta Business App has WhatsApp Business API permissions
4. **Rate Limiting**: The code includes built-in rate limiting (4-minute intervals)
5. **Timeout Errors**: Requests timeout after 30 seconds with detailed error messages
6. **Webhook Issues**: Verify webhook URL is accessible and verify token matches