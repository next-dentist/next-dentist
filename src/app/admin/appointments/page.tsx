'use client';

import AdminAppointmentManager from '@/components/admin/AdminAppointmentManager';

export default function AdminAppointmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Appointment Management Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage and track all dental appointments, patient information, and
            appointment statuses.
          </p>
        </div>
        <AdminAppointmentManager />
      </div>
    </div>
  );
}
