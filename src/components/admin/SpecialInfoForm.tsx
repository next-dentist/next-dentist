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
import { Input } from '@/components/ui/input';
import { currencyConfig } from '@/config';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

const SpecialInfoFormSchema = z.object({
  experience: z.string().optional(),
  priceStart: z.string().optional(),
  treatmentCompleted: z.string().optional(),
  patientsServed: z.string().optional(),
  specialLineOneTitle: z.string().max(15).optional(),
  specialLineOne: z.string().max(20).optional(),
  specialLineTwoTitle: z.string().max(15).optional(),
  specialLineTwo: z.string().max(20).optional(),
  specialLineThreeTitle: z.string().max(15).optional(),
  specialLineThree: z.string().max(20).optional(),
  currency: z.string().optional(),
});

type SpecialInfoForm = z.infer<typeof SpecialInfoFormSchema>;

interface SpecialInfoFormProps {
  dentistId?: string;
}

const SpecialInfoForm: React.FC<SpecialInfoFormProps> = ({ dentistId }) => {
  const { mutate: updateDentist, isPending: isUpdating } = useUpdateDentist();
  const {
    data: dentist,
    isLoading,
    error,
    refetch,
  } = useAdminDentistFetch(dentistId || '');
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState(currencyConfig.list[0]);

  const form = useForm<SpecialInfoForm>({
    resolver: zodResolver(SpecialInfoFormSchema),
    defaultValues: {
      experience: '',
      treatmentCompleted: '',
      patientsServed: '',
      specialLineOneTitle: '',
      specialLineOne: '',
      specialLineTwoTitle: '',
      specialLineTwo: '',
      specialLineThreeTitle: '',
      specialLineThree: '',
      currency: '',
      priceStart: '',
    },
  });

  useEffect(() => {
    if (dentist) {
      form.reset({
        experience: dentist.experience || '',
        priceStart: dentist.priceStart || '',
        treatmentCompleted: dentist.treatmentCompleted?.toString() || '',
        patientsServed: dentist.patientsServed?.toString() || '',
        specialLineOneTitle: dentist.specialLineOneTitle || '',
        specialLineOne: dentist.specialLineOne || '',
        specialLineTwoTitle: dentist.specialLineTwoTitle || '',
        specialLineTwo: dentist.specialLineTwo || '',
        specialLineThreeTitle: dentist.specialLineThreeTitle || '',
        specialLineThree: dentist.specialLineThree || '',
        currency: dentist.currency || '',
      });

      // Set currency state if available
      if (dentist.currency) {
        const currencyObj =
          currencyConfig.list.find(c => c.id === dentist.currency) ||
          currencyConfig.list[0];
        setCurrency(currencyObj as any);
      }
    }
  }, [dentist, form]);

  const onSubmit = async (values: SpecialInfoForm) => {
    if (dentistId) {
      const dataToSend = {
        ...values,
        treatmentCompleted: values.treatmentCompleted || undefined,
        patientsServed: values.patientsServed || undefined,
      };

      updateDentist(
        {
          id: dentistId,
          data: dataToSend as Partial<Dentist>,
        },
        {
          onSuccess: () => {
            setIsOpen(false);
            refetch();
            toast.success('Special info updated successfully.');
          },
          onError: error => {
            console.error('Special Info Update Error:', error);
            toast.error(`Failed to update special info: ${error.message}`);
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
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., 10+ Years"
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="treatmentCompleted"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treatments Completed</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="e.g., 500"
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="patientsServed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patients Served</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="e.g., 1000"
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priceStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting Price</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., 100"
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={value => {
                    field.onChange(value);
                    const selectedCurrency = currencyConfig.list.find(
                      c => c.id === value
                    );
                    if (selectedCurrency) {
                      setCurrency(selectedCurrency as any);
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencyConfig.list.map(curr => (
                      <SelectItem key={curr.id} value={curr.id}>
                        {curr.name} ({curr.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialLineOneTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Line One Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Experience"
                    value={field.value ?? ''}
                    maxLength={15}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialLineOne"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Line One Detail</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g., 15+ Years in Dentistry"
                    value={field.value ?? ''}
                    maxLength={20}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialLineTwoTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Line Two Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Technology"
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialLineTwo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Line Two Detail</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g., Uses Laser Dentistry"
                    value={field.value ?? ''}
                    maxLength={100}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialLineThreeTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Line Three Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Certification"
                    value={field.value ?? ''}
                    maxLength={100}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialLineThree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Line Three Detail</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g., Certified Invisalign Provider"
                    value={field.value ?? ''}
                    maxLength={100}
                  />
                </FormControl>
                <FormMessage />
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
            <p className="font-semibold">Experience</p>
            <p className="text-gray-600">
              {dentist.experience || 'Not specified'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div>
            <p className="font-semibold">Treatments Completed</p>
            <p className="text-gray-600">
              {dentist.treatmentCompleted?.toLocaleString() ?? 'Not specified'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div>
            <p className="font-semibold">Patients Served</p>
            <p className="text-gray-600">
              {dentist.patientsServed?.toLocaleString() ?? 'Not specified'}
            </p>
          </div>
        </div>
        {/* priceStart */}
        <div className="flex items-start space-x-3">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div>
            <p className="font-semibold">Price Start</p>
            <p className="text-gray-600">
              {dentist.priceStart || 'Not specified'}
            </p>
          </div>
        </div>
        {/* currency */}
        <div className="flex items-start space-x-3">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div>
            <p className="font-semibold">Currency</p>
            <p className="text-gray-600">
              {dentist.currency || currencyConfig.list[0].symbol}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 md:col-span-2">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div>
            <p className="font-semibold">
              {dentist.specialLineOneTitle || 'Special Info 1'}
            </p>
            <p className="text-gray-600">
              {dentist.specialLineOne || 'Not specified'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 md:col-span-2">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div>
            <p className="font-semibold">
              {dentist.specialLineTwoTitle || 'Special Info 2'}
            </p>
            <p className="text-gray-600">
              {dentist.specialLineTwo || 'Not specified'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 md:col-span-2">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
          <div>
            <p className="font-semibold">
              {dentist.specialLineThreeTitle || 'Special Info 3'}
            </p>
            <p className="text-gray-600">
              {dentist.specialLineThree || 'Not specified'}
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
          <h1 className="text-lg font-bold">Special Information</h1>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Special Info
          </Button>
        </div>

        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Edit Special Information"
          side="right"
          width="w-[600px]"
        >
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Update experience, stats, and special highlights. Click save when
              done.
            </p>
            <FormContent />
          </div>
        </Drawer>

        <ContentsShowUp />
      </div>
    </div>
  );
};

export default SpecialInfoForm;
