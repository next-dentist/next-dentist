'use client';
// Admin cost page List with shadcn table, status change, edit, and image preview

import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCostPage } from '@/hooks/cost/useCostPage';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import CreateCostPage from '../../../components/CostPage/CreateCostPage';

export default function CostPageList(props: any) {
  // Added type for props
  const { costPages, isLoadingCostPages, deleteCostPage } = useCostPage();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteCostPage(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  if (isLoadingCostPages) {
    return <div className="p-4 text-center">Loading cost pages...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Cost Pages</h2>
        <Button
          size="sm"
          variant="default"
          onClick={() => setIsDrawerOpen(true)}
        >
          + New Cost Page
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-[150px]">Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(costPages) && costPages.length > 0 ? (
              costPages.map((page: any) => (
                <TableRow key={page.id}>
                  <TableCell>
                    {page.image ? (
                      <Image
                        src={page.image}
                        alt={page.imageAlt || page.title}
                        width={60}
                        height={40}
                        className="rounded object-cover"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">No image</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500">{page.slug}</span>
                  </TableCell>
                  <TableCell>
                    {page.updatedDateAndTime
                      ? new Date(page.updatedDateAndTime).toLocaleString()
                      : '-'}
                  </TableCell>
                  <TableCell className="flex justify-end space-x-2">
                    {page.slug && (
                      <Link
                        href={`/cost/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    )}
                    <Link href={`/admin/cost-pages/${page.id}/edit`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(page.id)}
                      disabled={deletingId === page.id}
                    >
                      {deletingId === page.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500"
                >
                  No cost pages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Create New Cost Page"
      >
        <CreateCostPage />
      </Drawer>
    </div>
  );
}
