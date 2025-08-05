'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCostPage } from '@/hooks/cost/useCostPage';
import { useParams } from 'next/navigation';
import MultiImageUploader from './MultiImageUploader';
import VideoLinkUploader from './VideoLinkUploader';

export default function EditCostPageClient() {
  const params = useParams();
  const costPageId = params.id as string;
  const { costPages, isLoadingCostPages } = useCostPage();

  if (isLoadingCostPages) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!costPages) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Cost Page Not Found</h2>
          <p className="text-muted-foreground">
            The cost page you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Cost Page: {costPages.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <MultiImageUploader costPageId={costPageId} />
              <VideoLinkUploader costPageId={costPageId} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
