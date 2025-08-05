// components/MediaPicker.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReactNode, useState } from 'react';
import MediaManager from './MediaManager';
import { Button } from './ui/button';

type Props = {
  /** Called when the user clicks an image or selects multiple images. */
  onSelect: (fileUrl: string | string[]) => void;
  /** Whatever should open the modal (Button, icon, etc.). */
  trigger: ReactNode;
  /** Allow multiple selection? default ➜ false */
  multiple?: boolean;
  /** Dialog title */
  title?: string;
  /** Dialog description */
  description?: string;
};

export default function MediaPicker({
  onSelect,
  trigger,
  multiple = false,
  title = 'Choose Media From Library',
  description = 'Select media files from your library to use in your project.',
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  const handleSelect = (url: string | string[]) => {
    if (multiple) {
      // For multiple selection, keep track of selected items
      const urls = Array.isArray(url) ? url : [url];
      setSelectedUrls(urls);
    } else {
      // For single selection, close immediately
      onSelect(Array.isArray(url) ? url[0] : url);
      setOpen(false);
    }
  };

  const handleConfirm = () => {
    if (multiple && selectedUrls.length > 0) {
      onSelect(selectedUrls);
      setOpen(false);
      setSelectedUrls([]);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedUrls([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="flex max-h-[90vh] max-w-6xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📁 {title}
          </DialogTitle>
          <DialogDescription>
            {description}
            {multiple && (
              <span className="mt-1 block text-sm text-blue-600">
                Multiple selection enabled - choose several files and click
                "Select Files" when done.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <MediaManager onSelect={handleSelect} multiple={multiple} />
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {multiple && selectedUrls.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedUrls.length} file{selectedUrls.length > 1 ? 's' : ''}{' '}
                selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            {multiple && (
              <Button
                onClick={handleConfirm}
                disabled={selectedUrls.length === 0}
              >
                Select{' '}
                {selectedUrls.length > 0 ? `${selectedUrls.length} ` : ''}File
                {selectedUrls.length !== 1 ? 's' : ''}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
