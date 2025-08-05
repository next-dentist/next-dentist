'use client';

import { getDentistById } from '@/app/actions/fetchDentists';
import LoadingSpinner from '@/components/LoadingSpinner';
import DentistDashboardOverview from '@/components/dentist/DentistDashboardOverview';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function Dashboard() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['dentist', id],
    queryFn: () => getDentistById(id as string),
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  return <DentistDashboardOverview dentistId={id as string} />;
}
