'use client';

import { useState } from 'react';

export default function WhatsAppAuthProductionDebug() {
  const [debugResults, setDebugResults] = useState<Record<string, any>>({});
  const [phone] = useState('+919979202955');
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const runDebugCheck = async (
    checkName: string,
    checkFunction: () => Promise<any>
  ) => {
    setLoading(prev => ({ ...prev, [checkName]: true }));
    try {
      const result = await checkFunction();
      setDebugResults(prev => ({
        ...prev,
        [checkName]: {
          timestamp: new Date().toISOString(),
          status: 'success',
          ...result,
        },
      }));
    } catch (error) {
      setDebugResults(prev => ({
        ...prev,
        [checkName]: {
          timestamp: new Date().toISOString(),
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
      }));
    } finally {
      setLoading(prev => ({ ...prev, [checkName]: false }));
    }
  };

  // Environment Variables Check
  const checkEnvironmentVariables = async () => {
    return {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
      hasWhatsAppToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
      hasWhatsAppPhoneId: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
      userAgent:
        typeof window !== 'undefined' ? navigator.userAgent : 'server-side',
      origin:
        typeof window !== 'undefined' ? window.location.origin : 'unknown',
      hostname:
        typeof window !== 'undefined' ? window.location.hostname : 'unknown',
    };
  };

  // WhatsApp API Configuration Test
  const testWhatsAppConfig = async () => {
    try {
      const response = await fetch('/api/debug/whatsapp-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ debug: true }),
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to test WhatsApp config: ${error}`);
    }
  };

  // Test Server Actions Directly
  const testServerActions = async () => {
    try {
      // Import the WhatsApp auth functions
      const { checkPhoneAvailability } = await import(
        '@/app/actions/whatsapp-auth'
      );

      const result = await checkPhoneAvailability(phone);
      return {
        serverActionResult: result,
        canImportActions: true,
      };
    } catch (error) {
      return {
        canImportActions: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  // Test WhatsApp API Connectivity
  const testWhatsAppConnectivity = async () => {
    try {
      const response = await fetch('/api/debug/whatsapp-connectivity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone }),
      });

      return await response.json();
    } catch (error) {
      throw new Error(`WhatsApp connectivity test failed: ${error}`);
    }
  };

  // Test Production Build Detection
  const testProductionBuild = async () => {
    return {
      isClient: typeof window !== 'undefined',
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
      buildTime: process.env.BUILD_TIME || 'unknown',
      nextVersion: process.env.NEXT_VERSION || 'unknown',
      runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        hasNextAuth: !!process.env.AUTH_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      },
    };
  };

  const DebugResultCard = ({
    title,
    result,
    severity = 'info',
  }: {
    title: string;
    result: any;
    severity?: 'success' | 'error' | 'warning' | 'info';
  }) => {
    const colorClasses = {
      success: 'bg-green-50 border-green-200',
      error: 'bg-red-50 border-red-200',
      warning: 'bg-yellow-50 border-yellow-200',
      info: 'bg-blue-50 border-blue-200',
    };

    const getSeverity = () => {
      if (!result) return 'info';
      if (result.status === 'error') return 'error';
      if (result.error) return 'error';
      if (
        result.hasWhatsAppToken === false ||
        result.hasWhatsAppPhoneId === false
      )
        return 'error';
      if (result.canImportActions === false) return 'error';
      return 'success';
    };

    const actualSeverity = getSeverity();

    return (
      <div className={`rounded-lg border p-4 ${colorClasses[actualSeverity]}`}>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        {result ? (
          <div>
            <div className="mb-2 text-xs text-gray-500">{result.timestamp}</div>
            <pre className="max-h-60 overflow-auto rounded bg-white p-3 text-sm whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="text-gray-400 italic">No result yet</div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        WhatsApp Auth Production Debug
      </h1>

      <div className="mb-6 rounded-lg border border-orange-300 bg-orange-100 p-4">
        <h2 className="mb-2 font-semibold">🔍 Production Debugging Tool</h2>
        <p className="text-sm">
          This page helps diagnose why WhatsApp authentication works in
          development but fails in production. Run each diagnostic test to
          identify the root cause.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Diagnostic Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Diagnostic Tests</h2>

          <div className="space-y-3">
            <button
              onClick={() =>
                runDebugCheck('envVars', checkEnvironmentVariables)
              }
              disabled={loading.envVars}
              className="w-full rounded bg-blue-500 px-4 py-3 text-left text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading.envVars
                ? '🔄 Checking...'
                : '🔧 Check Environment Variables'}
            </button>

            <button
              onClick={() =>
                runDebugCheck('whatsappConfig', testWhatsAppConfig)
              }
              disabled={loading.whatsappConfig}
              className="w-full rounded bg-green-500 px-4 py-3 text-left text-white hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading.whatsappConfig
                ? '🔄 Testing...'
                : '📱 Test WhatsApp API Config'}
            </button>

            <button
              onClick={() => runDebugCheck('serverActions', testServerActions)}
              disabled={loading.serverActions}
              className="w-full rounded bg-purple-500 px-4 py-3 text-left text-white hover:bg-purple-600 disabled:bg-gray-400"
            >
              {loading.serverActions
                ? '🔄 Testing...'
                : '⚡ Test Server Actions'}
            </button>

            <button
              onClick={() =>
                runDebugCheck('connectivity', testWhatsAppConnectivity)
              }
              disabled={loading.connectivity}
              className="w-full rounded bg-orange-500 px-4 py-3 text-left text-white hover:bg-orange-600 disabled:bg-gray-400"
            >
              {loading.connectivity
                ? '🔄 Testing...'
                : '🌐 Test WhatsApp Connectivity'}
            </button>

            <button
              onClick={() => runDebugCheck('buildInfo', testProductionBuild)}
              disabled={loading.buildInfo}
              className="w-full rounded bg-indigo-500 px-4 py-3 text-left text-white hover:bg-indigo-600 disabled:bg-gray-400"
            >
              {loading.buildInfo
                ? '🔄 Checking...'
                : '🏗️ Check Production Build Info'}
            </button>

            <button
              onClick={() => setDebugResults({})}
              className="w-full rounded bg-red-500 px-4 py-3 text-white hover:bg-red-600"
            >
              🧹 Clear All Results
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Diagnostic Results</h2>

          <div className="space-y-4">
            <DebugResultCard
              title="Environment Variables"
              result={debugResults.envVars}
            />

            <DebugResultCard
              title="WhatsApp API Configuration"
              result={debugResults.whatsappConfig}
            />

            <DebugResultCard
              title="Server Actions Test"
              result={debugResults.serverActions}
            />

            <DebugResultCard
              title="WhatsApp Connectivity"
              result={debugResults.connectivity}
            />

            <DebugResultCard
              title="Production Build Info"
              result={debugResults.buildInfo}
            />
          </div>
        </div>
      </div>

      {/* Common Issues and Solutions */}
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-semibold">
          Common Production Issues & Solutions
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="mb-2 font-semibold text-red-800">
              ❌ Environment Variables Missing
            </h3>
            <p className="mb-2 text-sm text-red-700">
              WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set in
              production
            </p>
            <div className="rounded bg-red-100 p-2 text-xs">
              <strong>Solution:</strong> Add environment variables to your
              production server/hosting platform
            </div>
          </div>

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <h3 className="mb-2 font-semibold text-orange-800">
              ⚠️ Server Actions Not Working
            </h3>
            <p className="mb-2 text-sm text-orange-700">
              Next.js server actions may need explicit configuration in
              production
            </p>
            <div className="rounded bg-orange-100 p-2 text-xs">
              <strong>Solution:</strong> Check next.config.ts and ensure proper
              server action setup
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="mb-2 font-semibold text-yellow-800">
              🔒 CORS Issues
            </h3>
            <p className="mb-2 text-sm text-yellow-700">
              WhatsApp API may reject requests from production domain
            </p>
            <div className="rounded bg-yellow-100 p-2 text-xs">
              <strong>Solution:</strong> Ensure production domain is whitelisted
              in Meta Business settings
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-800">
              🌐 Network/Firewall Issues
            </h3>
            <p className="mb-2 text-sm text-blue-700">
              Production server may block outgoing HTTPS requests to WhatsApp
              API
            </p>
            <div className="rounded bg-blue-100 p-2 text-xs">
              <strong>Solution:</strong> Check firewall settings and allow
              outgoing connections to graph.facebook.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
