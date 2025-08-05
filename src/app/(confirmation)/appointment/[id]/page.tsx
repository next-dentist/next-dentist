import AppointmentConfirmation from '@/components/AppointmentConfirmation';
import React from 'react';

interface ConfirmationPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = async ({
  params,
}) => {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <AppointmentConfirmation id={id} />
      </div>
    </div>
  );
};

export default ConfirmationPage;
