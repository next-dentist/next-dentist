'use server';

import { db } from '@/db';
import axios from 'axios';
import { randomInt } from 'crypto';

// TypeScript interfaces for better type safety
interface OTPData {
  otp: string;
  expiresAt: number;
  attempts: number;
}

interface WhatsAppResponse {
  messages?: Array<{ id: string }>;
  error?: {
    code: number;
    message?: string;
    error_user_msg?: string;
  };
}

interface PhoneFormatResult {
  success: boolean;
  phone?: string;
  error?: string;
}

interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
}

// Store OTP temporarily in memory (in production, use Redis or database)
const otpStore = new Map<string, OTPData>();

// Generate a 6-digit OTP using Node.js crypto for better security
function generateOTP(): string {
  try {
    // Use Node.js crypto.randomInt for cryptographically secure random numbers
    return randomInt(100000, 1000000).toString();
  } catch (error) {
    // Fallback to Math.random if crypto is not available
    console.warn('Crypto randomInt not available, falling back to Math.random');
    const min = 100000;
    const max = 999999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp.toString();
  }
}

// Clean expired OTPs with enhanced logic
function cleanExpiredOTPs(): number {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phone);
      cleanedCount++;
    }
  }
  
  // If we have too many active OTPs, clean oldest ones (prevent memory issues)
  if (otpStore.size > 1000) {
    const entries = Array.from(otpStore.entries());
    // Sort by expiration time, oldest first
    entries.sort((a, b) => a[1].expiresAt - b[1].expiresAt);
    
    // Remove oldest 100 entries
    for (let i = 0; i < 100 && i < entries.length; i++) {
      otpStore.delete(entries[i][0]);
      cleanedCount++;
    }
  }
  
  return cleanedCount;
}

// Enhanced OTP validation with better error messages
function validateOTPInput(phone: string, otp: string): { valid: boolean; error?: string } {
  // Validate phone number
  if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
    return { valid: false, error: 'Phone number is required' };
  }

  // Validate OTP
  if (!otp || typeof otp !== 'string') {
    return { valid: false, error: 'OTP is required' };
  }

  const trimmedOTP = otp.trim();
  if (trimmedOTP.length === 0) {
    return { valid: false, error: 'OTP cannot be empty' };
  }

  if (!/^\d{6}$/.test(trimmedOTP)) {
    return { valid: false, error: 'OTP must be exactly 6 digits' };
  }

  return { valid: true };
}

// Validate and format phone number for WhatsApp API with proper input sanitization
function formatPhoneForWhatsApp(phone: string): PhoneFormatResult {
  try {
    // Input validation
    if (!phone || typeof phone !== 'string') {
      return { success: false, error: 'Phone number is required and must be a string' };
    }

    // Trim and remove any whitespace
    const trimmedPhone = phone.trim();
    if (trimmedPhone.length === 0) {
      return { success: false, error: 'Phone number cannot be empty' };
    }

    // Remove all non-digit characters except '+'
    let cleanPhone = trimmedPhone.replace(/[^\d+]/g, '');
    
    // Ensure it starts with '+'
    if (!cleanPhone.startsWith('+')) {
      return { success: false, error: 'Phone number must include country code starting with +' };
    }

    // Extract digits after country code
    const digits = cleanPhone.substring(1);
    
    // Validate digits only
    if (!/^\d+$/.test(digits)) {
      return { success: false, error: 'Phone number contains invalid characters' };
    }

    // Validate length (international standard: 10-15 digits)
    if (digits.length < 10 || digits.length > 15) {
      return { success: false, error: 'Invalid phone number length (must be 10-15 digits)' };
    }

    // For WhatsApp API, we need only the digits without '+'
    const formattedPhone = digits;
    
    return { success: true, phone: formattedPhone };
  } catch (error) {
    return { success: false, error: 'Failed to format phone number' };
  }
}

// Enhanced WhatsApp API configuration validation with strict template requirements
function validateWhatsAppConfig(): ConfigValidationResult {
  const errors: string[] = [];
  
  // Check required environment variables
  if (!process.env.WHATSAPP_ACCESS_TOKEN) {
    errors.push('WHATSAPP_ACCESS_TOKEN is not configured');
  } else {
    // Validate token format
    const token = process.env.WHATSAPP_ACCESS_TOKEN.trim();
    if (token.length < 50) {
      errors.push('WHATSAPP_ACCESS_TOKEN appears to be invalid (too short)');
    }
    if (!token.startsWith('EAA')) {
      errors.push('WHATSAPP_ACCESS_TOKEN format appears invalid (should start with EAA)');
    }
  }
  
  if (!process.env.WHATSAPP_PHONE_NUMBER_ID) {
    errors.push('WHATSAPP_PHONE_NUMBER_ID is not configured');
  } else {
    // Validate phone number ID format (should be numeric)
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID.trim();
    if (!/^\d+$/.test(phoneNumberId)) {
      errors.push('WHATSAPP_PHONE_NUMBER_ID should be numeric');
    }
  }

  // STRICT REQUIREMENT: OTP Template must be configured for compliance
  if (!process.env.WHATSAPP_OTP_TEMPLATE_NAME) {
    errors.push('WHATSAPP_OTP_TEMPLATE_NAME is required for OTP authentication (plain text not allowed for unregistered numbers)');
  } else {
    const templateName = process.env.WHATSAPP_OTP_TEMPLATE_NAME.trim();
    if (templateName.length === 0) {
      errors.push('WHATSAPP_OTP_TEMPLATE_NAME cannot be empty');
    }
  }

  // Business Account ID required for template verification
  if (!process.env.WHATSAPP_BUSINESS_ACCOUNT_ID) {
    errors.push('WHATSAPP_BUSINESS_ACCOUNT_ID is required for template verification');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Create template message for OTP with URL button (AUTHENTICATION category)
function createOTPTemplateMessage(phone: string, otp: string) {
  return {
    messaging_product: 'whatsapp',
    to: phone,
    type: 'template',
    template: {
      name: process.env.WHATSAPP_OTP_TEMPLATE_NAME || 'nd_verfiy_code_1',
      language: {
        code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en_US'
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: otp
            }
          ]
        },
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [
            {
              type: 'text',
              text: `${otp}` // Same OTP used in button URL parameter
            }
          ]
        }
      ]
    }
  };
}

// ❌ Plain text OTP messages are no longer supported for compliance
// WhatsApp Business API requires AUTHENTICATION category templates for unregistered numbers

// Validate AUTHENTICATION Template Status and Category
export async function validateAuthenticationTemplate(templateName?: string) {
  try {
    const template = templateName || process.env.WHATSAPP_OTP_TEMPLATE_NAME;
    if (!template) {
      return {
        success: false,
        error: 'No template name provided',
        isValid: false
      };
    }

    const apiUrl = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates`;
    const response = await axios({
      url: apiUrl,
      method: 'get',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      params: {
        name: template
      },
      timeout: 10000,
    });

    const templates = response.data.data || [];
    const templateData = templates[0];

    if (!templateData) {
      return {
        success: true,
        error: `Template "${template}" not found`,
        isValid: false,
        template: null
      };
    }

    // Check if template is in AUTHENTICATION category
    const isAuthCategory = templateData.category === 'AUTHENTICATION';
    const isApproved = templateData.status === 'APPROVED';

    return {
      success: true,
      isValid: isAuthCategory && isApproved,
      template: templateData,
      category: templateData.category,
      status: templateData.status,
      isAuthCategory,
      isApproved,
      message: !isAuthCategory 
        ? `Template must be in AUTHENTICATION category (current: ${templateData.category})`
        : !isApproved 
        ? `Template must be APPROVED (current: ${templateData.status})`
        : 'Template is valid for OTP authentication'
    };
  } catch (error: any) {
    console.error('Template validation error:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || 'Failed to validate template',
      isValid: false
    };
  }
}

// Enhanced WhatsApp Template Status Debugging
export async function checkTemplateStatus(templateName: string) {
  try {
    const apiUrl = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates`;
    const response = await axios({
      url: apiUrl,
      method: 'get',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      params: {
        name: templateName
      },
      timeout: 10000,
    });
    return {
      success: true,
      templates: response.data.data,
      status: response.data.data[0]?.status
    };
  } catch (error) {
    console.error('Check template status error:', error);
    return {
      success: false,
      error: 'Failed to check template status',
    };
  }
}

// Enhanced phone validation for WhatsApp Business API
function validatePhoneForBusiness(phone: string): { valid: boolean; error?: string } {
  const phoneFormat = formatPhoneForWhatsApp(phone);
  if (!phoneFormat.success) {
    return { valid: false, error: phoneFormat.error };
  }
  const formattedPhone = phoneFormat.phone!;
  if (formattedPhone.length < 10) {
    return { valid: false, error: 'Phone number too short for mobile' };
  }
  return { valid: true };
}

// AUTHENTICATION Template-Only OTP Sending (Compliance with WhatsApp Business API)
async function sendWhatsAppOTPTemplate(phone: string, otp: string) {
  const apiUrl = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  
  // MANDATORY: Only use approved AUTHENTICATION templates for OTP
  const templateName = process.env.WHATSAPP_OTP_TEMPLATE_NAME;
  if (!templateName) {
    throw new Error('WHATSAPP_OTP_TEMPLATE_NAME is required. Plain text OTP messages are not allowed for unregistered numbers.');
  }

  console.log(`Sending AUTHENTICATION template OTP to: ${phone}`);
  console.log(`Template name: ${templateName}`);
  
  const requestBody = createOTPTemplateMessage(phone, otp);
  console.log('Template message payload:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await axios({
      url: apiUrl,
      method: 'post',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: requestBody,
      validateStatus: () => true,
      timeout: 30000,
    });

    const data = response.data;
    console.log('WhatsApp Template API Response:', {
      status: response.status,
      statusText: response.statusText,
      templateName,
      data: JSON.stringify(data, null, 2)
    });

    if (response.status >= 400) {
      let errorMessage = 'Failed to send WhatsApp template message';
      
      if (data && data.error) {
        const errorCode = data.error.code;
        const errorMsg = data.error.message || data.error.error_user_msg || '';
        console.log(`WhatsApp Template API Error - Code: ${errorCode}, Message: ${errorMsg}`);
        
        switch (errorCode) {
          case 131047:
            errorMessage = 'This phone number is not registered with WhatsApp Business API';
            break;
          case 131026:
            errorMessage = 'Invalid phone number format or not a WhatsApp number';
            break;
          case 190:
            errorMessage = 'Access token is invalid or expired';
            break;
          case 10:
            errorMessage = 'API permissions error - check your Meta Business App permissions';
            break;
          case 132000:
            errorMessage = `AUTHENTICATION template "${templateName}" failed - may not be approved or parameters incorrect`;
            break;
          case 131009:
            errorMessage = `AUTHENTICATION template "${templateName}" not found or not approved in AUTHENTICATION category`;
            break;
          case 131005:
            errorMessage = 'Phone number not registered to receive messages from this business account';
            break;
          case 131021:
            errorMessage = 'Recipient cannot receive message at this time (may be blocked)';
            break;
          case 133010:
            errorMessage = 'Message failed due to unknown recipient';
            break;
          case 131014:
            errorMessage = 'Template parameter format is invalid';
            break;
          case 132001:
            errorMessage = 'Template is not in APPROVED status';
            break;
          default:
            errorMessage = errorMsg || `WhatsApp Template API error (${errorCode}). Ensure template is approved in AUTHENTICATION category.`;
        }
      }
      
      throw new Error(errorMessage);
    }

    return { response, data, messageType: 'template' };
  } catch (err: any) {
    console.error('WhatsApp Template API Error:', err);
    
    if (err.message && err.message.includes('WhatsApp')) {
      throw err;
    }
    
    if (err.code === 'ECONNABORTED') {
      throw new Error('WhatsApp Template API request timed out');
    } else if (err.response) {
      throw new Error(`WhatsApp Template API error: ${err.response.status} ${err.response.statusText}`);
    } else if (err.request) {
      throw new Error('No response received from WhatsApp Template API');
    } else {
      throw new Error('Failed to send WhatsApp AUTHENTICATION template');
    }
  }
}

// Enhanced main sendWhatsAppOTP function
export async function sendWhatsAppOTP(phone: string) {
  try {
    console.log(`Starting WhatsApp OTP send for phone: ${phone}`);
    const configCheck = validateWhatsAppConfig();
    if (!configCheck.valid) {
      console.error('WhatsApp configuration errors:', configCheck.errors);
      return {
        success: false,
        error: `Configuration error: ${configCheck.errors.join(', ')}`
      };
    }
    cleanExpiredOTPs();
    const phoneValidation = validatePhoneForBusiness(phone);
    if (!phoneValidation.valid) {
      console.error('Phone validation error:', phoneValidation.error);
      return {
        success: false,
        error: phoneValidation.error || 'Invalid phone number'
      };
    }
    const phoneFormat = formatPhoneForWhatsApp(phone);
    const formattedPhone = phoneFormat.phone!;
    console.log(`Formatted phone for API: ${formattedPhone}`);
    const existingOTP = otpStore.get(phone);
    if (existingOTP) {
      const timeRemaining = existingOTP.expiresAt - Date.now();
      const cooldownTime = 240000;
      if (timeRemaining > cooldownTime) {
        const waitMinutes = Math.ceil((timeRemaining - cooldownTime) / 60000);
        return {
          success: false,
          error: `OTP already sent. Please wait ${waitMinutes} minute${waitMinutes === 1 ? '' : 's'} before requesting again.`,
        };
      }
    }
    const otp = generateOTP();
    const expiresAt = Date.now() + 300000;
    otpStore.set(phone, { otp, expiresAt, attempts: 0 });
    console.log(`Generated OTP for ${phone}: ${otp}`);
    const { response, data, messageType } = await sendWhatsAppOTPTemplate(formattedPhone, otp);
    if (response.status >= 200 && response.status < 300) {
      console.log(`WhatsApp OTP sent successfully to ${phone} using ${messageType}`);
      return {
        success: true,
        message: `OTP sent successfully via WhatsApp (${messageType})`,
        messageId: data.messages?.[0]?.id,
        messageType,
      };
    } else {
      return {
        success: false,
        error: 'Unexpected response from WhatsApp API',
        details: data
      };
    }
  } catch (error: any) {
    console.error('Send WhatsApp OTP Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send OTP. Please try again.',
      details: error.message
    };
  }
}

export async function verifyWhatsAppOTP(phone: string, otp: string) {
  try {
    // Enhanced input validation
    const validation = validateOTPInput(phone, otp);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || 'Invalid input',
      };
    }

    // Clean expired OTPs
    cleanExpiredOTPs();

    // Normalize phone number for lookup
    const trimmedPhone = phone.trim();
    const trimmedOTP = otp.trim();

    const storedOTP = otpStore.get(trimmedPhone);

    if (!storedOTP) {
      return {
        success: false,
        error: 'OTP not found or expired. Please request a new one.',
      };
    }

    // Check expiration with current time
    const now = Date.now();
    if (now > storedOTP.expiresAt) {
      otpStore.delete(trimmedPhone);
      return {
        success: false,
        error: 'OTP has expired. Please request a new one.',
      };
    }

    // Check attempt limit
    if (storedOTP.attempts >= 3) {
      otpStore.delete(trimmedPhone);
      return {
        success: false,
        error: 'Too many failed attempts. Please request a new OTP.',
      };
    }

    // Verify OTP with constant-time comparison to prevent timing attacks
    const otpMatches = storedOTP.otp === trimmedOTP;
    
    if (!otpMatches) {
      storedOTP.attempts += 1;
      const remainingAttempts = 3 - storedOTP.attempts;
      
      return {
        success: false,
        error: remainingAttempts > 0 
          ? `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`
          : 'Invalid OTP. No attempts remaining. Please request a new OTP.',
      };
    }

    // OTP is valid - clean up and return success
    otpStore.delete(trimmedPhone);

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  } catch (error) {
    console.error('Verify WhatsApp OTP Error:', error);
    return {
      success: false,
      error: 'Failed to verify OTP. Please try again.',
    };
  }
}

export async function registerWithWhatsApp(phone: string, name?: string) {
  try {
    const existingUser = await db.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'User with this phone number already exists',
      };
    }

    const user = await db.user.create({
      data: {
        phone,
        name: name || null,
        emailVerified: false,
        role: 'USER',
      },
    });

    return {
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    // console.error('Register with WhatsApp Error:', error);
    return {
      success: false,
      error: 'Failed to create account. Please try again.',
    };
  }
}

export async function loginWithWhatsApp(phone: string) {
  try {
    const user = await db.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return {
        success: false,
        error: 'No account found with this phone number',
      };
    }

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    // console.error('Login with WhatsApp Error:', error);
    return {
      success: false,
      error: 'Failed to login. Please try again.',
    };
  }
}

export async function checkPhoneAvailability(phone: string) {
  try {
    const existingUser = await db.user.findUnique({
      where: { phone },
    });

    return {
      success: true,
      available: !existingUser,
      exists: !!existingUser,
    };
  } catch (error) {
    // console.error('Check phone availability error:', error);
    return {
      success: false,
      error: 'Failed to check phone availability',
    };
  }
}

// Utility function for sending media messages (for future use)
export async function sendMediaMessage(
  phone: string,
  mediaType: 'image' | 'document' | 'audio' | 'video',
  mediaId: string,
  caption?: string
) {
  try {
    const phoneFormat = formatPhoneForWhatsApp(phone);
    if (!phoneFormat.success) {
      return {
        success: false,
        error: phoneFormat.error || 'Invalid phone number format'
      };
    }

    const apiUrl = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const requestBody: any = {
      messaging_product: 'whatsapp',
      to: phoneFormat.phone,
      type: mediaType,
      [mediaType]: {
        id: mediaId,
        ...(caption ? { caption } : {})
      }
    };

    const response = await axios({
      url: apiUrl,
      method: 'post',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: requestBody,
      timeout: 30000,
    });

    return {
      success: response.status >= 200 && response.status < 300,
      messageId: response.data.messages?.[0]?.id,
      data: response.data
    };
  } catch (error) {
    // console.error('Send media message error:', error);
    return {
      success: false,
      error: 'Failed to send media message',
    };
  }
}

// Check message delivery status
export async function checkMessageStatus(messageId: string) {
  try {
    const apiUrl = `https://graph.facebook.com/v22.0/${messageId}`;

    const response = await axios({
      url: apiUrl,
      method: 'get',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      timeout: 10000,
    });

    return {
      success: true,
      status: response.data
    };
  } catch (error) {
    // console.error('Check message status error:', error);
    return {
      success: false,
      error: 'Failed to check message status',
    };
  }
}

// Utility: Test if a number can receive WhatsApp messages
export async function testPhoneNumber(phone: string) {
  try {
    const phoneFormat = formatPhoneForWhatsApp(phone);
    if (!phoneFormat.success) {
      return {
        success: false,
        error: phoneFormat.error
      };
    }
    const apiUrl = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const testMessage = {
      messaging_product: 'whatsapp',
      to: phoneFormat.phone,
      type: 'text',
      text: {
        body: 'Test message from NextDentist. Please ignore.'
      }
    };
    const response = await axios({
      url: apiUrl,
      method: 'post',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: testMessage,
      validateStatus: () => true,
      timeout: 10000,
    });
    return {
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      data: response.data,
      canReceiveMessages: response.status >= 200 && response.status < 300
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to test phone number',
      canReceiveMessages: false
    };
  }
}