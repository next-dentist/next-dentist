'use client';

import { sendCustomWhatsAppMessage } from '@/lib/utils';
import { useState } from 'react';

interface ResponseData {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
  details?: string;
  troubleshooting?: string[];
  whatsappError?: any;
}

interface DebugData {
  hasAccessToken: boolean;
  hasPhoneNumberId: boolean;
  apiConnectionTest?: {
    status: number | string;
    success: boolean;
    data?: any;
    error?: any;
  };
  recommendations?: string[];
}

export default function WhatsAppCustomTestPage() {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugData | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const loadDebugInfo = async () => {
    try {
      const res = await fetch('/api/whatsapp/debug');
      const data = await res.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Failed to load debug info:', error);
    }
  };

  const sendCustomMessage = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setResponse({
        success: false,
        error:
          'Invalid phone number format. Please use international format (e.g., +911234567890)',
      });
      return;
    }

    if (!message.trim()) {
      setResponse({
        success: false,
        error: 'Message cannot be empty',
      });
      return;
    }

    if (message.length > 1024) {
      setResponse({
        success: false,
        error:
          'Message too long. Maximum 1024 characters allowed for WhatsApp text messages.',
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const data = await sendCustomWhatsAppMessage(phoneNumber, message);

      if (data.success) {
        setResponse({
          success: true,
          message: data.message,
          data: data.data,
        });
        setLastSentTime(new Date());
      } else {
        setResponse({
          success: false,
          error: data.error || 'Failed to send message',
          details: data.details || data.whatsappError,
          troubleshooting: data.troubleshooting,
          whatsappError: data.whatsappError,
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
    setMessage('');
    setResponse(null);
    setLastSentTime(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            WhatsApp Custom Message Test
          </h1>

          {/* Debug Section */}
          <div className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-yellow-900">Debug Information</h3>
              <button
                onClick={() => {
                  setShowDebug(!showDebug);
                  if (!showDebug && !debugInfo) {
                    loadDebugInfo();
                  }
                }}
                className="rounded bg-yellow-100 px-3 py-1 text-sm text-yellow-800 hover:bg-yellow-200"
              >
                {showDebug ? 'Hide' : 'Show'} Debug Info
              </button>
            </div>

            {showDebug && (
              <div className="mt-4 text-sm text-yellow-800">
                {debugInfo ? (
                  <div className="space-y-2">
                    <p>
                      <strong>Configuration:</strong>
                    </p>
                    <ul className="ml-4 list-disc">
                      <li>
                        Access Token:{' '}
                        {debugInfo.hasAccessToken ? '✅ Set' : '❌ Missing'}
                      </li>
                      <li>
                        Phone Number ID:{' '}
                        {debugInfo.hasPhoneNumberId ? '✅ Set' : '❌ Missing'}
                      </li>
                    </ul>

                    {debugInfo.apiConnectionTest && (
                      <div>
                        <p>
                          <strong>API Connection Test:</strong>
                        </p>
                        <ul className="ml-4 list-disc">
                          <li>
                            Status:{' '}
                            {debugInfo.apiConnectionTest.success
                              ? '✅ Connected'
                              : '❌ Failed'}
                          </li>
                          <li>
                            Response: {debugInfo.apiConnectionTest.status}
                          </li>
                        </ul>
                      </div>
                    )}

                    {debugInfo.recommendations &&
                      debugInfo.recommendations.length > 0 && (
                        <div>
                          <p>
                            <strong>Recommendations:</strong>
                          </p>
                          <ul className="ml-4 list-disc">
                            {debugInfo.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ) : (
                  <p>Loading debug information...</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Phone Number (International Format)
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+911234567890"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use international format (e.g., +911234567890)
              </p>
            </div>

            {/* Message Input */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Custom Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Enter your custom message here..."
                rows={4}
                maxLength={1024}
                className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Maximum 1024 characters (WhatsApp limit)
                </p>
                <p className="text-xs text-gray-500">{message.length}/1024</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={sendCustomMessage}
                disabled={isLoading}
                className="flex-1 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Custom Message'}
              </button>
              <button
                onClick={clearForm}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
              >
                Clear
              </button>
            </div>

            {/* Last Sent Time */}
            {lastSentTime && (
              <div className="text-center text-sm text-gray-500">
                Last sent: {lastSentTime.toLocaleString()}
              </div>
            )}
          </div>

          {/* Response Display */}
          {response && (
            <div className="mt-6 rounded-md border p-4">
              {response.success ? (
                <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800">
                  <h3 className="font-medium text-green-900">Success!</h3>
                  <p className="mt-1 text-green-800">{response.message}</p>
                  {response.data && (
                    <div className="mt-2 text-sm">
                      <p>
                        <strong>Message ID:</strong> {response.data.messageId}
                      </p>
                      <p>
                        <strong>To:</strong> {response.data.to}
                      </p>
                      <p>
                        <strong>Length:</strong> {response.data.messageLength}{' '}
                        characters
                      </p>
                      <p>
                        <strong>Timestamp:</strong> {response.data.timestamp}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
                  <h3 className="font-medium text-red-900">Error</h3>
                  <p className="mt-1 text-red-800">{response.error}</p>

                  {response.troubleshooting &&
                    response.troubleshooting.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-medium text-red-900">
                          Troubleshooting Tips:
                        </h4>
                        <ul className="mt-1 ml-4 list-disc text-sm text-red-700">
                          {response.troubleshooting.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {response.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-red-700">
                        View Technical Details
                      </summary>
                      <pre className="mt-1 text-xs whitespace-pre-wrap text-red-600">
                        {typeof response.details === 'string'
                          ? response.details
                          : JSON.stringify(response.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Common Issues Section */}
          <div className="mt-8 rounded-md border border-orange-200 bg-orange-50 p-4">
            <h3 className="mb-3 font-medium text-orange-900">
              Common Issues & Solutions
            </h3>
            <div className="space-y-2 text-sm text-orange-800">
              <div>
                <strong>📱 Not receiving messages?</strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>WhatsApp Business API has a 24-hour messaging window</li>
                  <li>The recipient must message your business number first</li>
                  <li>Use template messages for initial contact</li>
                  <li>Verify the phone number is a valid WhatsApp number</li>
                </ul>
              </div>

              <div>
                <strong>🔧 Configuration Issues?</strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>Check your WhatsApp Business API credentials</li>
                  <li>Verify your access token has the correct permissions</li>
                  <li>Ensure your phone number ID is correct</li>
                  <li>Check the debug information above</li>
                </ul>
              </div>

              <div>
                <strong>💡 Pro Tips:</strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>Test with your own phone number first</li>
                  <li>Send yourself a message to your business number</li>
                  <li>Then try sending a custom message back</li>
                  <li>Check server logs for detailed error information</li>
                </ul>
              </div>
            </div>
          </div>

          {/* API Information */}
          <div className="mt-8 rounded-md border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-medium text-blue-900">API Endpoint</h3>
            <p className="mb-2 text-sm text-blue-800">
              <code className="rounded bg-blue-100 px-2 py-1">
                POST /api/whatsapp/custom
              </code>
            </p>
            <div className="text-sm text-blue-700">
              <p>
                <strong>Request Body:</strong>
              </p>
              <pre className="mt-1 rounded bg-blue-100 p-2 text-xs">
                {`{
  "to": "+911234567890",
  "message": "Your custom message here"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
