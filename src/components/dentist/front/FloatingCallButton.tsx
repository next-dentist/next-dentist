'use client';

import { Phone } from 'lucide-react';

interface FloatingCallButtonProps {
  phone?: string;
}

export const FloatingCallButton: React.FC<FloatingCallButtonProps> = ({
  phone,
}) => {
  if (!phone) return null;

  return (
    <div className="fixed right-6 bottom-6 z-40">
      <button
        onClick={() => (window.location.href = `tel:${phone}`)}
        className="transform rounded-full bg-[#df9d7c] p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#df9d7c]/90"
      >
        <Phone className="h-6 w-6" />
      </button>
    </div>
  );
};
