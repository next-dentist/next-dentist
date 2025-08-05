'use client';

import PersonalDetailsForm from '@/components/admin/PersonalDetailsForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

export default function DentistPersonalDetails() {
  const { id } = useParams();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <PersonalDetailsForm dentistId={id as string} />
    </Suspense>
  );
}
