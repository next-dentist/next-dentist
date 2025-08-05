'use client';

import AdminAppointmentManager from '@/components/admin/AdminAppointmentManager';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function TestAppointmentsPage() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Appointment Manager Test
            </h1>
            <p className="mt-2 text-gray-600">
              This is a test page for the AdminAppointmentManager component.
            </p>
          </div>
          <AdminAppointmentManager />
        </div>
      </div>
    </QueryClientProvider>
  );
}
