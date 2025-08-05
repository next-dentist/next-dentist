'use client';

import {
  checkPhoneAvailability,
  loginWithWhatsApp,
  registerWithWhatsApp,
  sendWhatsAppOTP,
  verifyWhatsAppOTP,
} from '@/app/actions/whatsapp-auth';
import { useState } from 'react';

export default function WhatsAppAuthTestPage() {
  const [phone] = useState('+919979202955');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('Test User');
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleAction = async (
    actionName: string,
    action: () => Promise<any>
  ) => {
    setLoading(prev => ({ ...prev, [actionName]: true }));
    try {
      const result = await action();
      setResults(prev => ({
        ...prev,
        [actionName]: {
          timestamp: new Date().toISOString(),
          ...result,
        },
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [actionName]: {
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      }));
    } finally {
      setLoading(prev => ({ ...prev, [actionName]: false }));
    }
  };

  const testSendOTP = () => {
    handleAction('sendOTP', () => sendWhatsAppOTP(phone));
  };

  const testVerifyOTP = () => {
    if (!otp) {
      alert('Please enter OTP');
      return;
    }
    handleAction('verifyOTP', () => verifyWhatsAppOTP(phone, otp));
  };

  const testRegister = () => {
    handleAction('register', () => registerWithWhatsApp(phone, name));
  };

  const testLogin = () => {
    handleAction('login', () => loginWithWhatsApp(phone));
  };

  const testCheckAvailability = () => {
    handleAction('checkAvailability', () => checkPhoneAvailability(phone));
  };

  const ResultDisplay = ({ title, result }: { title: string; result: any }) => (
    <div className="rounded-lg bg-gray-50 p-4">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {result ? (
        <div>
          <div className="mb-2 text-xs text-gray-500">{result.timestamp}</div>
          <pre className="max-h-40 overflow-auto rounded bg-white p-3 text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="text-gray-400 italic">No result yet</div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">WhatsApp Auth API Test</h1>

      <div className="mb-6 rounded-lg bg-blue-50 p-4">
        <h2 className="mb-2 font-semibold">Test Configuration</h2>
        <p>
          <strong>Phone Number:</strong> {phone}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          This page tests all WhatsApp authentication functions for the
          specified phone number.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Test Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Actions</h2>

          {/* Check Phone Availability */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 font-medium">1. Check Phone Availability</h3>
            <button
              onClick={testCheckAvailability}
              disabled={loading.checkAvailability}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading.checkAvailability ? 'Checking...' : 'Check Availability'}
            </button>
          </div>

          {/* Send OTP */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 font-medium">2. Send WhatsApp OTP</h3>
            <button
              onClick={testSendOTP}
              disabled={loading.sendOTP}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading.sendOTP ? 'Sending...' : 'Send OTP'}
            </button>
          </div>

          {/* Verify OTP */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 font-medium">3. Verify OTP</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full rounded border p-2"
                maxLength={6}
              />
              <button
                onClick={testVerifyOTP}
                disabled={loading.verifyOTP}
                className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 disabled:bg-gray-400"
              >
                {loading.verifyOTP ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </div>

          {/* Register */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 font-medium">4. Register with WhatsApp</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter name (optional)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded border p-2"
              />
              <button
                onClick={testRegister}
                disabled={loading.register}
                className="rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 disabled:bg-gray-400"
              >
                {loading.register ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>

          {/* Login */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 font-medium">5. Login with WhatsApp</h3>
            <button
              onClick={testLogin}
              disabled={loading.login}
              className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:bg-gray-400"
            >
              {loading.login ? 'Logging in...' : 'Login'}
            </button>
          </div>

          {/* Clear Results */}
          <div className="rounded-lg border bg-white p-4">
            <button
              onClick={() => setResults({})}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Clear All Results
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Results</h2>

          <ResultDisplay
            title="Check Phone Availability"
            result={results.checkAvailability}
          />

          <ResultDisplay title="Send OTP" result={results.sendOTP} />

          <ResultDisplay title="Verify OTP" result={results.verifyOTP} />

          <ResultDisplay title="Register" result={results.register} />

          <ResultDisplay title="Login" result={results.login} />
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 rounded-lg bg-yellow-50 p-4">
        <h3 className="mb-2 font-semibold">Testing Instructions</h3>
        <ol className="list-inside list-decimal space-y-1 text-sm">
          <li>
            First, check phone availability to see if the number is already
            registered
          </li>
          <li>Send WhatsApp OTP to receive the verification code</li>
          <li>Enter the received OTP and verify it</li>
          <li>If phone is available, register a new account</li>
          <li>If phone is already registered, test login functionality</li>
          <li>Check the results panel for detailed API responses</li>
        </ol>
        <div className="mt-3 rounded bg-red-100 p-3 text-sm">
          <strong>Note:</strong> Make sure WhatsApp Business API is properly
          configured with valid WHATSAPP_ACCESS_TOKEN and
          WHATSAPP_PHONE_NUMBER_ID environment variables.
        </div>
      </div>
    </div>
  );
}
