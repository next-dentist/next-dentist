'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCostFAQ, useDeleteCostFAQ } from '@/hooks/cost/useCostFAQ';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CostPageFAQForm from './CostPageFAQForm';

interface CostPageFAQCardProps {
  costPageId: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  costPageId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function CostPageFAQCard({ costPageId }: CostPageFAQCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  const { data: faqs, isLoading, refetch } = useCostFAQ(costPageId);
  const { mutate: deleteCostFAQ, isPending: isDeleting } =
    useDeleteCostFAQ(costPageId);

  // Handle dialog state changes
  const handleDialogStateChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedFAQ(null); // Reset selection when dialog closes
    }
  };

  const handleAddNew = () => {
    setSelectedFAQ(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCostFAQ(id, {
      onError: error => {
        console.error('Error deleting FAQ:', error);
        // Toast error is handled by the hook
      },
    });
  };

  // Called by the form upon successful submission
  const handleFormSuccess = () => {
    setIsDialogOpen(false); // Close dialog on form success
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>FAQs</CardTitle>
          <CardDescription>Loading FAQs...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>FAQs</CardTitle>
          <CardDescription>
            Manage your frequently asked questions
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogStateChange}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[600px] p-6">
            <DialogTitle className="sr-only">FAQ Form</DialogTitle>
            <CostPageFAQForm
              costPageId={costPageId}
              selectedFAQ={selectedFAQ}
              onSubmit={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs?.map((faq: FAQ) => (
              <TableRow key={faq.id}>
                <TableCell className="font-medium">{faq.question}</TableCell>
                <TableCell className="max-w-md truncate">
                  {faq.answer}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(faq)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(faq.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!faqs || faqs.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-muted-foreground text-center"
                >
                  No FAQs found. Add your first FAQ!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
