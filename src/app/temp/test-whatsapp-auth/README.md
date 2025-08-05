# WhatsApp Authentication API Test Page

This test page allows you to test all WhatsApp authentication functions for the phone number `+919979202955`.

## Features

### Available Test Functions:
1. **Check Phone Availability** - Checks if the phone number is already registered
2. **Send WhatsApp OTP** - Sends a 6-digit OTP via WhatsApp
3. **Verify OTP** - Verifies the received OTP
4. **Register with WhatsApp** - Creates a new user account
5. **Login with WhatsApp** - Authenticates an existing user

## Usage

1. Navigate to `/temp/test-whatsapp-auth` in your browser
2. Follow the testing instructions on the page:
   - Start by checking phone availability
   - Send WhatsApp OTP
   - Enter and verify the received OTP
   - Register (if new) or Login (if existing)
3. Check the results panel for detailed API responses

## Prerequisites

Ensure the following environment variables are set:
- `WHATSAPP_ACCESS_TOKEN` - Your WhatsApp Business API access token
- `WHATSAPP_PHONE_NUMBER_ID` - Your WhatsApp Business phone number ID

## API Routes Tested

All functions from `src/app/actions/whatsapp-auth.ts`:
- `sendWhatsAppOTP()`
- `verifyWhatsAppOTP()`
- `registerWithWhatsApp()`
- `loginWithWhatsApp()`
- `checkPhoneAvailability()`

## Phone Number

The test is configured for: **+919979202955**

This number is hardcoded in the test page for consistent testing. 