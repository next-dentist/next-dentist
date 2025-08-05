'use client';
import { Calendar1Icon, Video } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

interface StaticContactFooterProps {
  dentistId: string;
}

const StaticContactFooter: React.FC<StaticContactFooterProps> = ({
  dentistId,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full text-sm transition-all duration-300 hover:scale-105"
        size="lg"
        onClick={() => {
          window.location.href = `/dentists/${dentistId}/book-appointment`;
        }}
      >
        <Calendar1Icon className="h-4 w-4" /> Book Appointment
      </Button>
      <Button
        variant="outline"
        className="bg-tertiary text-primary-foreground hover:bg-tertiary/90 w-full text-sm transition-all duration-300 hover:scale-105"
        size="lg"
        onClick={() => {
          window.location.href = `/dentists/${dentistId}/video-call`;
        }}
      >
        <Video className="h-4 w-4" /> Video Call
      </Button>
    </div>
  );
};

export default StaticContactFooter;
