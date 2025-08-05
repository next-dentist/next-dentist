'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  CheckCircle,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface DebugInfo {
  timestamp: string;
  environment: string;
  config: {
    hasAccessToken: boolean;
    hasPhoneNumberId: boolean;
    accessTokenLength: number;
    phoneNumberId: string;
    accessTokenPreview: string;
  };
  apiTest: {
    success: boolean;
    status?: number;
    data?: any;
    error?: string;
  } | null;
  recommendations: string[];
}

export default function WhatsAppDebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testLoading, setTestLoading] = useState(false);

  // Check if in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!isDevelopment) {
    return (
      <div className="container mx-auto max-w-2xl p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h1 className="mt-4 text-2xl font-bold">Debug Page Not Available</h1>
          <p className="mt-2 text-gray-600">
            This debug page is only available in development mode.
          </p>
        </div>
      </div>
    );
  }

  const fetchDebugInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/whatsapp');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      toast.error('Failed to fetch debug info');
      console.error('Debug fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestMessage = async () => {
    if (!testPhone) {
      toast.error('Please enter a phone number');
      return;
    }

    setTestLoading(true);
    try {
      const response = await fetch('/api/debug/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: testPhone }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Test message sent successfully!');
      } else {
        toast.error('Test message failed', {
          description: data.response?.error?.message || 'Unknown error',
        });
      }

      console.log('Test message result:', data);
    } catch (error) {
      toast.error('Failed to send test message');
      console.error('Test message error:', error);
    } finally {
      setTestLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugInfo();
  }, []);

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="space-y-6">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="mt-4 text-3xl font-bold">
            WhatsApp API Debug Console
          </h1>
          <p className="mt-2 text-gray-600">
            Diagnose and test your WhatsApp Business API configuration
          </p>
        </div>

        <div className="flex justify-center">
          <Button onClick={fetchDebugInfo} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </>
            )}
          </Button>
        </div>

        {debugInfo && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Configuration Status */}
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Configuration Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Access Token:</span>
                  <div className="flex items-center gap-2">
                    {debugInfo.config.hasAccessToken ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      {debugInfo.config.accessTokenLength} chars
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phone Number ID:</span>
                  <div className="flex items-center gap-2">
                    {debugInfo.config.hasPhoneNumberId ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      {debugInfo.config.phoneNumberId}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Token Preview: {debugInfo.config.accessTokenPreview}
                </div>
              </div>
            </div>

            {/* API Connectivity */}
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">API Connectivity</h2>
              {debugInfo.apiTest ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {debugInfo.apiTest.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>
                      {debugInfo.apiTest.success ? 'Connected' : 'Failed'}
                    </span>
                  </div>

                  {debugInfo.apiTest.status && (
                    <div className="text-sm text-gray-600">
                      HTTP Status: {debugInfo.apiTest.status}
                    </div>
                  )}

                  {debugInfo.apiTest.data && (
                    <div className="text-sm">
                      <div className="font-medium">Phone Details:</div>
                      <div className="text-gray-600">
                        Display: {debugInfo.apiTest.data.display_phone_number}
                      </div>
                      <div className="text-gray-600">
                        Name: {debugInfo.apiTest.data.verified_name}
                      </div>
                    </div>
                  )}

                  {debugInfo.apiTest.error && (
                    <div className="text-sm text-red-600">
                      Error: {debugInfo.apiTest.error}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">
                  Cannot test - missing configuration
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {debugInfo && debugInfo.recommendations.length > 0 && (
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Recommendations</h2>
            <ul className="space-y-2">
              {debugInfo.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  {rec.startsWith('✅') ? (
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm">{rec.replace('✅ ', '')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        {/* Test Message Section */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Send Test Message</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testPhone">
                Phone Number (with country code)
              </Label>
              <Input
                id="testPhone"
                type="tel"
                placeholder="+1234567890"
                value={testPhone}
                onChange={e => setTestPhone(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Enter a phone number with country code (e.g., +1234567890) to
                test message delivery
              </p>
            </div>
            <Button
              onClick={sendTestMessage}
              disabled={testLoading || !testPhone}
              className="w-full"
            >
              {testLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending Test Message...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Test Message
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Debug Info JSON */}
        {debugInfo && (
          <details className="rounded-lg border p-6">
            <summary className="cursor-pointer text-lg font-semibold">
              Raw Debug Data
            </summary>
            <pre className="mt-4 overflow-auto rounded bg-gray-100 p-4 text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
