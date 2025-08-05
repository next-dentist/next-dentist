import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * Reusable sidebar drawer component
 * ---------------------------------
 * Props:
 * - isOpen: boolean – control drawer visibility.
 * - onClose: () => void – callback when the drawer should close (overlay click, ⎋ key, or close button).
 * - title?: string – optional header title.
 * - side?: "left" | "right" – which side the drawer slides from (default "left").
 * - width?: string – Tailwind width utility class, e.g. "w-64", "w-80" (default "w-80").
 * - children: React.ReactNode – drawer body content.
 *
 * The component disables body scrolling while open and restores it on unmount.
 * Requires Tailwind CSS and lucide-react (for the X icon).
 */
export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: 'left' | 'right';
  width?: string;
  children: React.ReactNode;
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  side = 'left',
  width = 'w-[80%]',
  children,
}: DrawerProps) {
  const startX = useRef<number | null>(null);

  // Close on Esc key & lock scroll
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current !== null) {
      const currentX = e.touches[0].clientX;
      const diffX = startX.current - currentX;

      if (side === 'left' && diffX > 50) {
        onClose();
      } else if (side === 'right' && diffX < -50) {
        onClose();
      }
    }
  };

  const handleTouchEnd = () => {
    startX.current = null;
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} h-full bg-white ${side === 'left' ? 'shadow-xl' : ''} ${width} z-50 transform transition-transform duration-300 max-md:w-[90%] ${
          isOpen
            ? 'translate-x-0'
            : side === 'left'
              ? '-translate-x-full'
              : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 p-4">
          {title && (
            <p className="mr-2 truncate text-sm font-semibold">{title}</p>
          )}
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="focus:ring-primary absolute top-4 right-4 rounded p-2 hover:bg-gray-100 focus:ring-2 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Body */}
        <div className="h-[calc(100%-3.5rem)] overflow-y-auto p-4 md:p-12">
          {children}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="focus:ring-primary absolute right-4 bottom-4 rounded-full bg-gray-200 p-2 shadow-md hover:bg-gray-300 focus:ring-2 focus:outline-none"
          aria-label="Close drawer"
        >
          Close
        </button>
      </aside>
    </>
  );
}
