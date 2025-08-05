'use client';

import DentistAppointmentManager from '@/components/dentist/DentistAppointmentManager';
import { useParams } from 'next/navigation';
import React from 'react';

const AllAppointments: React.FC = () => {
  const params = useParams();
  const dentistId = params.id as string;

  if (!dentistId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Invalid Dentist ID
          </h2>
          <p className="text-gray-600">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <DentistAppointmentManager
          dentistId={dentistId}
          viewType="all"
          showHeader={true}
        />
      </div>
    </div>
  );
};

export default AllAppointments;
