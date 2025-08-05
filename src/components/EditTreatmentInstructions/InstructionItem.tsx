import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import { Instruction } from '@prisma/client';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { InstructionForm } from './InstructionForm';

interface InstructionItemProps {
  instruction: Instruction;
  treatmentId: string;
  onDelete: (instructionId: string, instructionTitle: string) => void;
  isDeleting: boolean;
}

export function InstructionItem({
  instruction,
  treatmentId,
  onDelete,
  isDeleting,
}: InstructionItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex items-start justify-between rounded-md border p-3 hover:bg-gray-50">
      <div className="mr-4 flex-1">
        <span className="font-medium">{instruction.title}</span>
        {instruction.type && (
          <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
            {instruction.type}
          </span>
        )}
        <p className="mt-1 text-sm whitespace-pre-wrap text-gray-600">
          {instruction.content}
        </p>
        {instruction.buttonText && instruction.buttonLink && (
          <Button variant="link" size="sm" asChild className="mt-1 h-auto p-0">
            <a
              href={instruction.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {instruction.buttonText}
            </a>
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(true)}
          className="hover:bg-gray-200"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Drawer
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          title={`Edit Instruction: ${instruction.title}`}
          side="right"
          width="w-[800px]"
        >
          <div className="space-y-4">
            <InstructionForm
              treatmentId={treatmentId}
              initialData={instruction}
              onClose={() => setIsEditing(false)}
            />
          </div>
        </Drawer>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(instruction.id, instruction.title)}
          disabled={isDeleting}
          className="text-red-500 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
