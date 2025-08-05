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

import ImageUploader from '@/components/ImageUploader';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAdminDentistFetch,
  useUpdateDentist,
} from '@/hooks/useAdminDentistEdit';
import { formatDate } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dentist, DentistStatus } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Info, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import LoadingSpinner from '../LoadingSpinner';

// Define the form schema with Zod
const DentistBasicDetailsFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  status: z.nativeEnum(DentistStatus),
  gender: z.string().optional(),
  dob: z.string().optional(),
  image: z.string().optional(),
});

type DentistBasicDetailsFormValues = z.infer<
  typeof DentistBasicDetailsFormSchema
>;

interface DentistBasicDetailsFormProps {
  dentistId?: string;
}

const DentistBasicDetailsForm: React.FC<DentistBasicDetailsFormProps> = ({
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
  const [specialityOpen, setSpecialityOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<DentistBasicDetailsFormValues>({
    resolver: zodResolver(DentistBasicDetailsFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      country: '',
      status: DentistStatus.pending,
      gender: '',
      dob: '',
      image: '',
    },
  });

  const handleImageUploaded = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    form.setValue('image', imageUrl);
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
    form.setValue('image', '');
  };

  useEffect(() => {
    if (dentist) {
      // Convert gender to uppercase if it exists
      const genderValue = dentist.gender ? dentist.gender.toUpperCase() : '';

      // Format the date for the date input (YYYY-MM-DD)
      let formattedDob = '';
      if (dentist.dob) {
        try {
          const date = new Date(dentist.dob);
          formattedDob = date.toISOString().split('T')[0];
        } catch (e) {
          console.error('Error formatting date:', e);
          formattedDob = dentist.dob;
        }
      }

      form.reset({
        name: dentist.name || '',
        email: dentist.email || '',
        phone: dentist.phone || '',
        city: dentist.city || '',
        state: dentist.state || '',
        country: dentist.country || '',
        status: dentist.status,
        gender: genderValue,
        dob: formattedDob,
        image: dentist.image || '',
      });
      setUploadedImageUrl(dentist.image);
    }
  }, [dentist, form]);

  const onSubmit = async (values: DentistBasicDetailsFormValues) => {
    if (dentistId) {
      // Create a copy of values to avoid mutating the original
      const dataToSend = { ...values };

      // Ensure DOB is in the correct format if it exists
      if (dataToSend.dob && dataToSend.dob.trim() !== '') {
        try {
          // Make sure it's a valid date string
          const date = new Date(dataToSend.dob);
          if (!isNaN(date.getTime())) {
            // Keep the date in YYYY-MM-DD format for the API
            dataToSend.dob = date.toISOString().split('T')[0];
          }
        } catch (e) {
          console.error('Error formatting date for submission:', e);
        }
      }

      updateDentist(
        {
          id: dentistId,
          data: dataToSend as Partial<Dentist>,
        },
        {
          onSuccess: () => {
            setIsOpen(false); // Close drawer after successful submission
            refetch();
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
        <span className="text-sm font-medium text-gray-500">
          Upload Profile Image
        </span>
        <div className="space-y-6">
          <div className="relative mb-6">
            <ImageUploader
              onImageUploaded={handleImageUploaded}
              onImageRemoved={handleRemoveImage}
              initialImageUrl={uploadedImageUrl}
              dentistId={dentistId}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
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
                  <Input {...field} />
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
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter state or province" />
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
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input
                  type="hidden"
                  {...field}
                  value={uploadedImageUrl || ''}
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

  const ContentsShowUp = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
            <Avatar className="h-24 w-24">
              <AvatarImage src={dentist.image || ''} className="rounded-full" />
              <AvatarFallback>{dentist.name?.[0] || '?'}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Info className="mt-1 h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="font-semibold">Name</span>
              <span className="text-gray-600">
                {dentist.name || 'Not specified'}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Info className="mt-1 h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="font-semibold">Email</span>
              <span className="text-gray-600">
                {dentist.email || 'Not specified'}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Info className="mt-1 h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="font-semibold">Gender</span>
              <span className="text-gray-600 capitalize">
                {dentist.gender
                  ? dentist.gender.toLowerCase()
                  : 'Not specified'}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Info className="mt-1 h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="font-semibold">Date of Birth</span>
              <span className="text-gray-600">
                {dentist.dob ? formatDate(dentist.dob) : 'Not specified'}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Info className="mt-1 h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="font-semibold">Phone</span>
              <span className="text-gray-600">
                {dentist.phone || 'Not specified'}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Info className="mt-1 h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="font-semibold">Address</span>
              <span className="text-gray-600">
                {[dentist.city, dentist.state, dentist.country]
                  .filter(Boolean)
                  .join(', ') || 'Not specified'}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Info className="mt-1 h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="font-semibold">Status</span>
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm ${
                  dentist.status === DentistStatus.verified
                    ? 'bg-green-100 text-green-800'
                    : dentist.status === DentistStatus.rejected
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {dentist.status || 'Not specified'}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Info className="mt-1 h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="font-semibold">Speciality</span>
              <span className="text-gray-600">
                {dentist.speciality || 'Not specified'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-bold">Dentist Profile</h1>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Basic Details
          </Button>
        </div>

        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Edit Basic Details"
          side="right"
          width="w-[600px]"
        >
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Make changes to the dentist information here. Click save when
              you're done.
            </p>
            <FormContent />
          </div>
        </Drawer>

        <ContentsShowUp />
      </div>
    </div>
  );
};

export default DentistBasicDetailsForm;
