'use client';

import { Button } from '@/components/ui/button';
import { useClientLocation } from '@/hooks/useClientLocation';
import { MapPin } from 'lucide-react';

export function LocationPrompt() {
  const { isLocating, error } = useClientLocation();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-primary/10 mb-4 rounded-full p-3">
        <MapPin className="text-primary h-6 w-6" />
      </div>

      <h2 className="mb-2 text-xl font-semibold">Share your location</h2>

      <p className="text-muted-foreground mb-6 max-w-md">
        To find dentists near you, we need your location. We'll only use it to
        show you relevant results.
      </p>

      {isLocating ? (
        <div className="text-muted-foreground text-sm">
          Getting your location...
        </div>
      ) : error ? (
        <div className="text-destructive mb-4 text-sm">{error}</div>
      ) : (
        <Button onClick={() => window.location.reload()} className="px-6">
          Share Location
        </Button>
      )}
    </div>
  );
}
