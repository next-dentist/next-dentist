'use client';

import { Button } from '@/components/ui/button';
import { useTimeZone } from '@/hooks/useTimeZone';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import TimezoneSelect from 'react-timezone-select';
import { toast } from 'sonner';
import { z } from 'zod';

interface AdminTimeZoneSelectFormProps {
  dentistId: string;
}

const timezoneSchema = z.object({
  value: z.string().min(1, 'Timezone is required'),
});

export function AdminTimeZoneSelectForm({
  dentistId,
}: AdminTimeZoneSelectFormProps) {
  const { timezone, isLoading, updateMutation } = useTimeZone(dentistId);
  const [selectedTimezone, setSelectedTimezone] = useState<any>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => {
    if (timezone) {
      setSelectedTimezone({ value: timezone });
    }
  }, [timezone]);

  const handleChange = (zone: any) => {
    setSelectedTimezone(zone);
  };

  const handleSave = async () => {
    try {
      const result = timezoneSchema.safeParse(selectedTimezone);

      if (!result.success) {
        toast.error('Please select a valid timezone');
        return;
      }

      await updateMutation.mutateAsync(selectedTimezone.value);
    } catch (error) {
      console.error('Error saving timezone:', error);
      // Error handling is done in the mutation
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">
            Select Your Time Zone:
          </label>
          <TimezoneSelect
            value={selectedTimezone}
            onChange={handleChange}
            isClearable={false}
            className="w-full"
          />
        </div>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="h-[42px]"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </div>
  );
}

export default AdminTimeZoneSelectForm;
