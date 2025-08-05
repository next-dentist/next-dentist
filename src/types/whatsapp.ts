// WhatsApp API Types

export interface WhatsAppCustomMessageRequest {
  to: string; // Phone number in international format (e.g., +911234567890)
  message: string; // Custom message text (max 4096 characters)
}

export interface WhatsAppCustomMessageResponse {
  success: boolean;
  message?: string;
  data?: {
    messageId?: string;
    to: string;
    messageLength: number;
    timestamp: string;
  };
  error?: string;
  details?: string;
  whatsappError?: any;
  whatsappResponse?: any;
}

export interface WhatsAppTemplateMessageRequest {
  to: string;
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
}

export interface WhatsAppTextMessageRequest {
  to: string;
  type: 'text';
  text: {
    body: string;
  };
}

export interface WhatsAppAPIResponse {
  messaging_product: string;
  messages?: Array<{
    id: string;
  }>;
  contacts?: Array<{
    input: string;
    wa_id: string;
  }>;
  error?: {
    message: string;
    type: string;
    code: number;
    error_data?: {
      details: string;
    };
  };
}

// Environment variables interface
export interface WhatsAppConfig {
  WHATSAPP_ACCESS_TOKEN: string;
  WHATSAPP_PHONE_NUMBER_ID: string;
}

// Validation interfaces
export interface ValidationError {
  error: string;
  required?: string[];
  received?: string[];
  expected?: string;
  maxLength?: number;
  currentLength?: number;
  missing?: string[];
} 