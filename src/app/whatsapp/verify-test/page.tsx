'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle,
  Loader2,
  MessageSquare,
  Phone,
  Send,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface VerificationResponse {
  success?: boolean;
  error?: string;
  details?: string;
  data?: any;
}

export default function WhatsAppVerifyTestPage() {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<VerificationResponse | null>(null);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  const [useTemplate, setUseTemplate] = useState(true);

  const generateRandomCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
  };

  const validatePhoneNumber = (phone: string) => {
    // Basic validation for international phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const formatErrorMessage = (error: string | undefined): string => {
    return error || 'Unknown error occurred';
  };

  const sendVerificationCode = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setResponse({
        success: false,
        error:
          'Invalid phone number format. Please use international format (e.g., +911234567890)',
      });
      return;
    }

    if (!verificationCode || verificationCode.length < 4) {
      setResponse({
        success: false,
        error: 'Verification code must be at least 4 characters long',
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const endpoint = useTemplate
        ? '/api/whatsapp/verify'
        : '/api/whatsapp/verify-plain';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          code: verificationCode,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse({
          success: true,
          data: data,
        });
        setLastSentTime(new Date());
      } else {
        // Handle WhatsApp API error response
        const errorMessage =
          data.error?.message ||
          data.error ||
          'Failed to send verification code';
        setResponse({
          success: false,
          error: errorMessage,
          details: data.error
            ? JSON.stringify(data.error, null, 2)
            : data.details,
        });
      }
    } catch (error) {
      setResponse({
        success: false,
        error: 'Network error occurred',
        details: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setPhoneNumber('+91');
    setVerificationCode('');
    setResponse(null);
    setLastSentTime(null);
    setUseTemplate(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            WhatsApp Verification Test
          </h1>
          <p className="text-gray-600">
            Test the WhatsApp verification code sending functionality
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Test Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Send Verification Code
              </CardTitle>
              <CardDescription>
                Enter a phone number and verification code to test the WhatsApp
                API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number (International Format)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+911234567890"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">
                  Format: +[country code][phone number] (e.g., +911234567890)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomCode}
                    className="shrink-0"
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Message Type</Label>
                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="messageType"
                      checked={useTemplate}
                      onChange={() => setUseTemplate(true)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Template Message</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="messageType"
                      checked={!useTemplate}
                      onChange={() => setUseTemplate(false)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Plain Text Message</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  {useTemplate
                    ? 'Uses template (requires approval) - nd_verify_code_1'
                    : 'Uses plain text (works immediately for testing)'}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={sendVerificationCode}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Code
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearForm}
                  disabled={isLoading}
                >
                  Clear
                </Button>
              </div>

              {lastSentTime && (
                <p className="text-center text-xs text-gray-500">
                  Last sent: {lastSentTime.toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Response Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                API Response
              </CardTitle>
              <CardDescription>
                View the response from the WhatsApp verification API
              </CardDescription>
            </CardHeader>
            <CardContent>
              {response ? (
                <div className="space-y-4">
                  <Alert
                    className={
                      response.success
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }
                  >
                    <div className="flex items-center gap-2">
                      {response.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertDescription
                        className={
                          response.success ? 'text-green-800' : 'text-red-800'
                        }
                      >
                        {response.success
                          ? 'Verification code sent successfully!'
                          : formatErrorMessage(response.error)}
                      </AlertDescription>
                    </div>
                  </Alert>

                  {response.details && (
                    <div className="space-y-2">
                      <Label>Error Details:</Label>
                      <Textarea
                        value={response.details}
                        readOnly
                        className="font-mono text-sm"
                        rows={3}
                      />
                    </div>
                  )}

                  {response.data && (
                    <div className="space-y-2">
                      <Label>Response Data:</Label>
                      <Textarea
                        value={JSON.stringify(response.data, null, 2)}
                        readOnly
                        className="font-mono text-sm"
                        rows={8}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <MessageSquare className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p>
                    No response yet. Send a verification code to see the API
                    response.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold">Template Endpoint:</h4>
                <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                  POST /api/whatsapp/verify
                </code>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Plain Text Endpoint:</h4>
                <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                  POST /api/whatsapp/verify-plain
                </code>
              </div>
            </div>

            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold">Template Used:</h4>
                <code className="rounded bg-gray-100 px-2 py-1">
                  nd_verify_code_1
                </code>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Currently Testing:</h4>
                <code className="rounded bg-gray-100 px-2 py-1">
                  {useTemplate ? 'Template Message' : 'Plain Text Message'}
                </code>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">Expected Request Body:</h4>
              <pre className="overflow-x-auto rounded bg-gray-100 p-3 text-xs">
                {`{
  "to": "+911234567890",
  "code": "123456"
}`}
              </pre>
            </div>

            <div className="rounded bg-blue-50 p-3">
              <h4 className="mb-2 font-semibold text-blue-800">
                Important Notes:
              </h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>
                  • Make sure the WhatsApp template "nd_verify_code_1" exists in
                  your Business account
                </li>
                <li>
                  • Template must be <strong>APPROVED</strong> by WhatsApp
                  before it can be used (not "Quality pending")
                </li>
                <li>
                  • Ensure WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN
                  are set in environment variables
                </li>
                <li>
                  • The phone number must be in international format (including
                  country code)
                </li>
                <li>
                  • Template must be associated with your specific phone number
                  ID
                </li>
              </ul>
            </div>

            <div className="rounded bg-red-50 p-3">
              <h4 className="mb-2 font-semibold text-red-800">
                Template Error 132001 Troubleshooting:
              </h4>
              <ul className="space-y-1 text-sm text-red-700">
                <li>
                  • <strong>Status Check:</strong> Template must be "APPROVED"
                  (not "Quality pending")
                </li>
                <li>
                  • <strong>Name Match:</strong> Verify template name matches
                  exactly (case-sensitive)
                </li>
                <li>
                  • <strong>Phone Number:</strong> Template must be associated
                  with your phone number ID
                </li>
                <li>
                  • <strong>Language:</strong> Template must be available in
                  "en_US" language
                </li>
                <li>
                  • <strong>Wait Time:</strong> Template approval can take 24-48
                  hours
                </li>
              </ul>
            </div>

            <div className="rounded bg-green-50 p-3">
              <h4 className="mb-2 font-semibold text-green-800">
                Solution: Use Plain Text for Testing
              </h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>
                  • <strong>No Approval Needed:</strong> Plain text messages
                  work immediately
                </li>
                <li>
                  • <strong>Same API:</strong> Uses same WhatsApp Business API,
                  just different message type
                </li>
                <li>
                  • <strong>Perfect for Development:</strong> Test your workflow
                  while waiting for template approval
                </li>
                <li>
                  • <strong>Production Ready:</strong> Can be used in production
                  if templates aren't required
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
