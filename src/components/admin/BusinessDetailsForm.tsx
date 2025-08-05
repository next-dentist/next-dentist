'use client';

import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  useAdminDentistFetch,
  useUpdateDentist,
} from '@/hooks/useAdminDentistEdit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dentist } from '@prisma/client';
import { Info, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import LoadingSpinner from '../LoadingSpinner';

const BusinessDetailsFormSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  website: z.string().optional(),
  acceptsInsurance: z.boolean().optional(),
  hasVideoCall: z.boolean().optional(),
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
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      website: '',
      acceptsInsurance: false,
      hasVideoCall: false,
    },
  });

  useEffect(() => {
    if (dentist) {
      form.reset({
        address: dentist.address || '',
        city: dentist.city || '',
        state: dentist.state || '',
        country: dentist.country || '',
        zipCode: dentist.zipCode || '',
        website: dentist.website || '',
        acceptsInsurance: dentist.acceptsInsurance || false,
        hasVideoCall: dentist.hasVideoCall || false,
      });
    }
  }, [dentist, form]);

  const onSubmit = async (values: BusinessDetailsForm) => {
    if (dentistId) {
      const payload: Partial<Dentist> = {
        ...values,
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
            toast.success('Business details updated successfully.');
          },
          onError: error => {
            console.error('Business Details Update Error:', error);
            toast.error(`Failed to update business details: ${error.message}`);
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter city" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter state" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter country" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter ZIP code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder="Enter website URL"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptsInsurance"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Accepts Insurance</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasVideoCall"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Offers Video Calls</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

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

  const ContentsShowUp = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-start space-x-3">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div>
            <p className="font-semibold">Address</p>
            <p className="text-gray-600">
              {dentist?.address || 'Not specified'}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div>
            <p className="font-semibold">Location</p>
            <p className="text-gray-600">
              {[
                dentist?.city,
                dentist?.state,
                dentist?.country,
                dentist?.zipCode,
              ]
                .filter(Boolean)
                .join(', ') || 'Not specified'}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div>
            <p className="font-semibold">Website</p>
            <p className="break-all text-gray-600">
              {dentist?.website ? (
                <a
                  href={dentist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {dentist.website}
                </a>
              ) : (
                'Not specified'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div>
            <p className="font-semibold">Insurance</p>
            <p className="text-gray-600">
              {dentist?.acceptsInsurance
                ? 'Accepts Insurance'
                : 'Does not accept Insurance'}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div>
            <p className="font-semibold">Video Consultations</p>
            <p className="text-gray-600">
              {dentist?.hasVideoCall
                ? 'Offers Video Consultations'
                : 'Does not offer Video Consultations'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-bold">Business Details</h1>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Business Details
          </Button>
        </div>

        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Edit Business Details"
          side="right"
          width="w-[600px]"
        >
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Update the business information for this dentist.
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
