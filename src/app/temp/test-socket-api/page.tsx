'use client';

import { useEffect, useState } from 'react';

interface SocketServerInfo {
  success: boolean;
  timestamp: string;
  server: {
    serverUrl: string;
    port: string;
    environment: string;
    corsOrigin: string;
    status: string;
    version: string;
    transports: string[];
    features: string[];
    info: {
      sid: string;
      upgrades: string[];
      pingInterval: number;
      pingTimeout: number;
    } | null;
  };
  connection: {
    clientSetup: {
      install: string;
      import: string;
      connect: string;
    };
    events: Record<string, string>;
    actions: Record<string, string>;
  };
  message: string;
  note: string;
}

export default function TestSocketApiPage() {
  const [serverInfo, setServerInfo] = useState<SocketServerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);

  const fetchServerInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/socket');
      const data = await response.json();

      if (data.success) {
        setServerInfo(data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch server info');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch('/api/socket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test_connection' }),
      });

      const data = await response.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({
        success: false,
        error: err instanceof Error ? err.message : 'Test failed',
      });
    }
  };

  useEffect(() => {
    fetchServerInfo();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">
            Loading Socket.IO server information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h1 className="mb-2 text-xl font-bold text-red-800">Error</h1>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchServerInfo}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Socket.IO API Test</h1>

      {serverInfo && (
        <div className="space-y-6">
          {/* Server Status */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Server Status</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <span className="font-medium">Status:</span>
                <span
                  className={`ml-2 rounded px-2 py-1 text-sm ${
                    serverInfo.server.status === 'online'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {serverInfo.server.status}
                </span>
              </div>
              <div>
                <span className="font-medium">Server URL:</span>
                <span className="ml-2 text-blue-600">
                  {serverInfo.server.serverUrl}
                </span>
              </div>
              <div>
                <span className="font-medium">Port:</span>
                <span className="ml-2">{serverInfo.server.port}</span>
              </div>
              <div>
                <span className="font-medium">Environment:</span>
                <span className="ml-2">{serverInfo.server.environment}</span>
              </div>
              <div>
                <span className="font-medium">Version:</span>
                <span className="ml-2">{serverInfo.server.version}</span>
              </div>
              <div>
                <span className="font-medium">CORS Origin:</span>
                <span className="ml-2">{serverInfo.server.corsOrigin}</span>
              </div>
            </div>
          </div>

          {/* Server Info */}
          {serverInfo.server.info && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold">Connection Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <span className="font-medium">Session ID:</span>
                  <span className="ml-2">{serverInfo.server.info.sid}</span>
                </div>
                <div>
                  <span className="font-medium">Ping Interval:</span>
                  <span className="ml-2">
                    {serverInfo.server.info.pingInterval}ms
                  </span>
                </div>
                <div>
                  <span className="font-medium">Ping Timeout:</span>
                  <span className="ml-2">
                    {serverInfo.server.info.pingTimeout}ms
                  </span>
                </div>
                <div>
                  <span className="font-medium">Upgrades:</span>
                  <span className="ml-2">
                    {serverInfo.server.info.upgrades.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Features</h2>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {serverInfo.server.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Guide */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Connection Guide</h2>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Installation</h3>
                <code className="block rounded bg-gray-100 p-2 text-sm">
                  {serverInfo.connection.clientSetup.install}
                </code>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Import</h3>
                <code className="block rounded bg-gray-100 p-2 text-sm">
                  {serverInfo.connection.clientSetup.import}
                </code>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Connection</h3>
                <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-sm">
                  {serverInfo.connection.clientSetup.connect}
                </pre>
              </div>
            </div>
          </div>

          {/* Test Connection */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Test Connection</h2>
            <button
              onClick={testConnection}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Test Socket.IO Connection
            </button>

            {testResult && (
              <div className="mt-4 rounded bg-gray-50 p-4">
                <h3 className="mb-2 font-medium">Test Result:</h3>
                <pre className="overflow-x-auto text-sm">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Refresh */}
          <div className="text-center">
            <button
              onClick={fetchServerInfo}
              className="rounded bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
            >
              Refresh Server Info
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Last updated: {new Date(serverInfo.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
