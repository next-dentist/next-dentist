'use client';

import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  useAdminDentistFetch,
  useUpdateDentist,
} from '@/hooks/useAdminDentistEdit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dentist } from '@prisma/client';
import { Pencil } from 'lucide-react';
import React, { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import BusinessHoursPicker from '../BusinessHours';
import LoadingSpinner from '../LoadingSpinner';
import AdminTimeZoneSelectForm from './AdminTimeZoneSelectForm';

type BusinessHours = {
  [key: string]: {
    Name: string;
    Closed: boolean;
    Hours: { from: string; to: string }[];
  };
};

const BusinessHoursSchema = z.any();

const BusinessDetailsFormSchema = z.object({
  businessHours: BusinessHoursSchema.optional(),
});

type BusinessDetailsForm = z.infer<typeof BusinessDetailsFormSchema>;

interface BusinessDetailsFormProps {
  dentistId?: string;
}

const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({
  dentistId,
}) => {
  const { mutate: updateDentist, isPending: isUpdating } = useUpdateDentist();
  const {
    data: dentist,
    isLoading,
    error,
    refetch,
  } = useAdminDentistFetch(dentistId || '');
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<BusinessDetailsForm>({
    resolver: zodResolver(BusinessDetailsFormSchema),
    defaultValues: {
      businessHours: {},
    },
  });

  useEffect(() => {
    if (dentist) {
      let parsedBusinessHours = {};
      if (dentist.businessHours) {
        if (typeof dentist.businessHours === 'string') {
          try {
            parsedBusinessHours = JSON.parse(dentist.businessHours);
          } catch (e) {
            console.error('Failed to parse businessHours JSON:', e);
          }
        } else if (typeof dentist.businessHours === 'object') {
          parsedBusinessHours = dentist.businessHours;
        }
      }

      form.reset({
        businessHours: parsedBusinessHours,
      });
    }
  }, [dentist, form]);

  const onSubmit = async (values: BusinessDetailsForm) => {
    if (dentistId) {
      const payload: Partial<Dentist> = {
        ...values,
        businessHours: values.businessHours
          ? JSON.stringify(values.businessHours)
          : null,
      };

      updateDentist(
        {
          id: dentistId,
          data: payload,
        },
        {
          onSuccess: () => {
            setIsOpen(false);
            refetch();
            toast.success('Business hours updated successfully.');
          },
          onError: error => {
            console.error('Business Hours Update Error:', error);
            toast.error(`Failed to update business hours: ${error.message}`);
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">Error loading dentist: {error.message}</div>
    );
  }

  if (!dentist) {
    return <div>No dentist found</div>;
  }

  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="businessHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Hours</FormLabel>
              <FormControl>
                <BusinessHoursPicker
                  current={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );

  const ContentsShowUp = () => {
    const businessHours = form.getValues('businessHours') as BusinessHours;

    return (
      <div className="mt-4">
        <span className="text-md font-semibold">Current Business Hours:</span>
        <div className="space-y-4">
          {Object.entries(businessHours).map(([day, details]) => (
            <div key={day} className="rounded-md border p-4">
              <h3 className="font-bold">
                {details.Name} ({day})
              </h3>
              {details.Closed ? (
                <p className="text-red-500">Closed</p>
              ) : (
                <ul>
                  {details.Hours.map((hour, index) => (
                    <li key={index}>
                      {hour.from} - {hour.to}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6">
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            <AdminTimeZoneSelectForm dentistId={dentistId as string} />
          </Suspense>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-bold">Business Hours</h1>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Business Hours
          </Button>
        </div>

        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Edit Business Hours"
          side="right"
          width="w-[600px]"
        >
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Update the business hours for this dentist.
            </p>
            <FormContent />
          </div>
        </Drawer>

        <ContentsShowUp />
      </div>
    </div>
  );
};

export default BusinessDetailsForm;
