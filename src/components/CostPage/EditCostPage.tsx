'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config';
import { useCostPage } from '@/hooks/cost/useCostPage';
import { JsonValue } from '@prisma/client/runtime/library';
import { Edit } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Drawer from '../Drawer';
import CostPageForm from './CostPageForm';
// Helper function to check if value is string array
const isStringArray = (value: JsonValue | null): value is string[] => {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
};

export default function EditCostPage({ id }: { id: string }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const { useFetchCostPageById } = useCostPage();
  const { data: costPage, isLoading, refetch } = useFetchCostPageById(id);

  useEffect(() => {
    if (!isDrawerOpen) {
      // Only refetch if the drawer was previously open
      const timeoutId = setTimeout(() => {
        refetch();
      }, 100); // Small delay to ensure state updates are complete
      return () => clearTimeout(timeoutId);
    }
  }, [isDrawerOpen, refetch]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            <div className="h-4 w-2/3 rounded bg-gray-200"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!costPage || 'error' in costPage) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <p className="text-red-500">Error loading cost page details</p>
        </CardContent>
      </Card>
    );
  }

  const relatedKeysArray = isStringArray(costPage.relatedKeys)
    ? costPage.relatedKeys
    : [];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{costPage.title}</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsDrawerOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <CostPageForm costPageId={id} />
        </Drawer>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Details */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold">Slug</h3>
            <p className="text-muted-foreground">{costPage.slug}</p>
          </div>
          <div>
            <h3 className="font-semibold">Last Updated</h3>
            <p className="text-muted-foreground">
              {costPage.updatedDateAndTime
                ? new Date(costPage.updatedDateAndTime).toLocaleDateString()
                : 'Not updated'}
            </p>
          </div>
        </div>

        {/* Content Section */}
        {costPage.content && (
          <div>
            <h3 className="font-semibold">Content</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {costPage.content}
            </p>
          </div>
        )}

        {/* Image Section */}
        {costPage.image && (
          <div>
            <h3 className="font-semibold">Image</h3>
            <div className="relative h-48 w-full overflow-hidden rounded-lg">
              <Image
                src={costPage.image}
                alt={costPage.imageAlt || costPage.title}
                fill
                className="object-cover"
              />
            </div>
            {costPage.imageAlt && (
              <p className="text-muted-foreground mt-2 text-sm">
                Alt: {costPage.imageAlt}
              </p>
            )}
          </div>
        )}

        {/* SEO Section */}
        <div className="space-y-2">
          <h3 className="font-semibold">SEO Details</h3>
          {costPage.seoTitle && (
            <div>
              <p className="text-sm font-medium">Title</p>
              <p className="text-muted-foreground">{costPage.seoTitle}</p>
            </div>
          )}
          {costPage.seoDescription && (
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-muted-foreground">{costPage.seoDescription}</p>
            </div>
          )}
          {costPage.seoExtra && (
            <div>
              <p className="text-sm font-medium">Extra SEO Data</p>
              <pre className="mt-1 rounded bg-gray-50 p-2 text-sm">
                {JSON.stringify(costPage.seoExtra, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* City Section */}
        <div>
          <h3 className="font-semibold">City</h3>
          <p className="text-muted-foreground">
            {
              siteConfig.cities.find(
                city => city.id.toString() === costPage.city
              )?.name
            }
          </p>
        </div>

        {/* Related Keys Section */}
        {relatedKeysArray.length > 0 && (
          <div>
            <h3 className="font-semibold">Related Keys</h3>
            <div className="flex flex-wrap gap-2">
              {relatedKeysArray.map((key, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
