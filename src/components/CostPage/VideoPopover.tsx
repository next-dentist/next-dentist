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

interface Props {
  videoId: string;
  currentAlt: string;
  onUpdate: (videoId: string, newAlt: string) => void;
  isUpdating: boolean;
}

export default function VideoPopover({
  videoId,
  currentAlt,
  onUpdate,
  isUpdating,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [altText, setAltText] = useState(currentAlt);

  const handleSave = () => {
    onUpdate(videoId, altText);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setAltText(currentAlt);
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
          <h4 className="font-medium">Edit Video Description</h4>
          <Input
            value={altText}
            onChange={e => setAltText(e.target.value)}
            placeholder="Enter video description"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
