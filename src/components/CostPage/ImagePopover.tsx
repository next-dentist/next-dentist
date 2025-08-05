'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

interface ImagePopoverProps {
  imageId: string;
  currentAlt: string;
  onUpdate: (imageId: string, newAlt: string) => void;
  isUpdating: boolean;
}

export default function ImagePopover({
  imageId,
  currentAlt,
  onUpdate,
  isUpdating,
}: ImagePopoverProps) {
  const [alt, setAlt] = useState(currentAlt);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onUpdate(imageId, alt);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Edit Image Alt Text</h4>
          <Input
            value={alt}
            onChange={e => setAlt(e.target.value)}
            placeholder="Enter alt text"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
