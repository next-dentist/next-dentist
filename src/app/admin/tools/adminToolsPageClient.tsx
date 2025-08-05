'use client';
import CategoryManager from '@/components/CategoryManager';
import ReviewComposer from '@/components/ReviewComposer';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const AdminToolsPageClient: React.FC = () => {
  const searchParams = useSearchParams();
  const dentistId = searchParams.get('dentistId');
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        <CategoryManager />
        <ReviewComposer dentistId={dentistId as string} />
      </div>
    </div>
  );
};

export default AdminToolsPageClient;
