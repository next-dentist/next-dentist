'use client';

import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import {
  useAdminTreatments,
  useDeleteTreatmentInstruction,
} from '@/hooks/useAdminTreatments';
import { Instruction } from '@prisma/client';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { InstructionForm } from './InstructionForm';
import { InstructionItem } from './InstructionItem';

interface EditTreatmentInstructionsProps {
  treatmentId: string;
}

export default function EditTreatmentInstructions({
  treatmentId,
}: EditTreatmentInstructionsProps) {
  const { data: treatment, isLoading, error } = useAdminTreatments(treatmentId);
  const { mutate: deleteInstruction, isPending: isDeleting } =
    useDeleteTreatmentInstruction();

  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  const handleDelete = (instructionId: string, instructionTitle: string) => {
    toast.warning(
      `Are you sure you want to delete the instruction "${instructionTitle}"?`,
      {
        action: {
          label: 'Delete',
          onClick: () => deleteInstruction({ treatmentId, instructionId }),
        },
        cancel: {
          label: 'Cancel',
          onClick: () => {},
        },
        duration: 10000,
      }
    );
  };

  if (isLoading) return <div>Loading treatment instructions...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;
  if (!treatment) return <div>No treatment data found.</div>;

  const instructions: Instruction[] = treatment.instructions || [];

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Treatment Instructions</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddDrawerOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Instruction
        </Button>
      </div>

      {instructions.length > 0 ? (
        <div className="space-y-3">
          {instructions.map(instruction => (
            <InstructionItem
              key={instruction.id}
              instruction={instruction}
              treatmentId={treatmentId}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No instructions associated with this treatment yet. Click "Add
          Instruction" to add one.
        </p>
      )}

      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Add New Instruction"
        side="right"
        width="w-[800px]"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Enter the details for the new instruction item.
          </p>
          <InstructionForm
            treatmentId={treatmentId}
            onClose={() => setIsAddDrawerOpen(false)}
          />
        </div>
      </Drawer>
    </div>
  );
}
