import { Skeleton } from '@/components/ui/skeleton';
import React, { Suspense } from 'react';
import DentistPersonalDetails from './DentistPersonalDetails';

const PersonalDetailsPage: React.FC = () => {
  return (
    <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
      <DentistPersonalDetails />
    </Suspense>
  );
};

export default PersonalDetailsPage;
