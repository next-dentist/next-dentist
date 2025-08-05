'use client';

import { fetchCostPageBySlug } from '@/app/actions/costPagesAction';
import CostPageFAQCard from '@/components/CostPage/CostPageFAQCard';
import CostPageTableView from '@/components/CostPage/CostPageTableView';
import EditCostPage from '@/components/CostPage/EditCostPage';
import MultiImageUploader from '@/components/CostPage/MultiImageUploader';
import SectionTableView from '@/components/CostPage/SectionTableView';
import VideoLinkUploader from '@/components/CostPage/VideoLinkUploader';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
// tanstack query
import { useQuery } from '@tanstack/react-query';

const EditCostPageClient: React.FC = () => {
  const { id } = useParams();
  const costPageId = useMemo(() => id as string, [id]);
  const router = useRouter();

  const { data: costPage } = useQuery({
    queryKey: ['costPage', costPageId],
    queryFn: () => fetchCostPageBySlug(costPageId),
  });

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex justify-end">
        <Button
          variant="default"
          onClick={() => {
            // new tab
            window.open(`/cost/${costPage?.slug}`, '_blank');
          }}
          className="bg-secondary text-white"
        >
          View Cost Page
        </Button>
      </div>
      <div className="flex w-full flex-col gap-6 md:flex-row md:space-y-0">
        <div className="w-full md:w-3/12">
          <EditCostPage id={costPageId} />
        </div>
        <div className="flex w-full flex-col gap-6 md:w-9/12">
          <CostPageTableView costPageId={costPageId} />
          <SectionTableView costPageId={costPageId} />
          <MultiImageUploader costPageId={costPageId} />
          <VideoLinkUploader costPageId={costPageId} />
          <CostPageFAQCard costPageId={costPageId} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditCostPageClient);
