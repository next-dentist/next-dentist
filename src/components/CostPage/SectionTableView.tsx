'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useCostPageSection,
  useCostPageSectionById,
} from '@/hooks/cost/useCostPageSection';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import Drawer from '../Drawer';
import CostSectionForm from './CostSectionForm';

interface SectionTableViewProps {
  costPageId: string;
}

export default function SectionTableView({
  costPageId,
}: SectionTableViewProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const {
    data: costSections,
    isLoading,
    refetch,
  } = useCostPageSectionById(costPageId);
  const { delete: deleteSection, isDeleting } = useCostPageSection(costPageId);

  const handleDelete = async (id: string) => {
    try {
      await deleteSection(id);
      toast.success('Cost section deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting cost section:', error);
      toast.error('Failed to delete cost section');
    }
  };

  const handleEdit = (id: string) => {
    setSelectedSection(id);
    setIsDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Cost Sections</CardTitle>
        <Button
          onClick={() => {
            setSelectedSection(null);
            setIsDrawerOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Section
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedSection(null);
          }}
          title="Add/Edit Cost Section"
          side="right"
          width="w-[80%]"
        >
          <CostSectionForm
            costPageId={costPageId}
            selectedSection={
              selectedSection
                ? costSections?.find(section => section.id === selectedSection)
                : null
            }
            isDrawerOpen={isDrawerOpen}
            onSubmit={() => {
              setIsDrawerOpen(false);
              setSelectedSection(null);
              refetch();
            }}
          />
        </Drawer>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costSections?.map(section => (
                <TableRow key={section.id}>
                  <TableCell>
                    {section.image ? (
                      <Image
                        src={section.image}
                        alt={section.imageAlt || 'Section Image'}
                        className="h-16 w-16 object-cover"
                        width={64}
                        height={64}
                      />
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{section.title}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(section.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(section.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
