'use client';

import ImageUploader from '@/components/ImageUploader';
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
import { siteConfig } from '@/config';
import { useAddDentist } from '@/hooks/useDentists';
import { slugify } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Briefcase,
  Camera,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  User,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import BusinessHoursPicker from './BusinessHours';
import { ReusableCombobox } from './ReUsableCombo';
import { Card } from './ui/card';

interface BusinessHour {
  from: string;
  to: string;
}

interface DayBusinessHours {
  Name: string;
  Hours: BusinessHour[];
  Closed: boolean;
}

interface BusinessHours {
  [key: string]: DayBusinessHours;
}

// Updated validation schema with new fields
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  address: z.string().min(5, { message: 'Address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  zipCode: z.string().min(5, { message: 'Valid ZIP code is required' }),
  country: z.string().min(2, { message: 'Country is required' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    message: 'Please select a gender',
  }),
  image: z
    .string()
    .url({ message: 'If provided, image must be a valid URL' })
    .optional(),
  speciality: z.string().min(2, { message: 'Speciality is required' }),
});

export default function AddDentistForm() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const addDentistMutation = useAddDentist();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours>({});

  const handleImageUploaded = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    form.setValue('image', imageUrl);
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
    form.setValue('image', '');
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      gender: 'MALE',
      image: '',
      speciality: '',
    },
  });

  const handleBusinessHoursChange = (hours: BusinessHours) => {
    setBusinessHours(hours);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    form.setValue(name as keyof z.infer<typeof formSchema>, value);
  };

  const { data: session } = useSession();

  const onSubmit = form.handleSubmit(async validData => {
    setIsSubmitting(true);

    try {
      // Generate a slug from the name
      const slug = slugify(validData.name);

      // Create the final data object including business hours
      const dentistData = {
        ...validData,
        // If image is undefined, set it to empty string
        image: validData.image || '',
        slug,
        user: {
          connect: {
            id: session?.user?.id || 'cm227scs00000o1e91ffssejg',
          },
        },
        businessHours: businessHours,
      };

      // Use the mutation
      addDentistMutation.mutate(dentistData, {
        onSuccess: data => {
          form.reset();
          toast.success('Dentist added successfully!');
          router.push('/dentists');
        },
        onError: (error: Error) => {
          // Display the error message from the API in a toast
          toast.error(error.message || 'Failed to add dentist');

          // If we have duplicate field errors, we can highlight those fields
          if (error.message.includes('email already exists')) {
            form.setError('email', {
              type: 'manual',
              message: 'This email is already in use',
            });
          } else if (error.message.includes('phone already exists')) {
            form.setError('phone', {
              type: 'manual',
              message: 'This phone number is already in use',
            });
          } else if (error.message.includes('name already exists')) {
            form.setError('name', {
              type: 'manual',
              message: 'A dentist with this name already exists',
            });
          }
        },
      });
    } catch (error) {
      // This will catch any other errors that aren't from the mutation
      toast.error(
        error instanceof Error ? error.message : 'Failed to add dentist'
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card className="">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/search')}
            className="border-primary/20 text-primary hover:bg-primary mb-6 flex items-center gap-2 bg-white/80 shadow-lg transition-all duration-300 hover:text-white hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dentists
          </Button>

          <div className="space-y-2 text-center">
            <h1 className="text-primary text-3xl font-bold sm:text-4xl">
              Add New Dentist
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Complete the form below to add a new dental professional to the
              platform
            </p>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="mx-auto max-w-4xl">
          <div className="border-primary/10 overflow-hidden rounded-2xl border bg-white/90 backdrop-blur-sm">
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-0">
                {/* Profile Image Section */}
                <div className="text-primary p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <Camera className="h-6 w-6" />
                    <h2 className="text-xl font-semibold">Profile Image</h2>
                  </div>

                  <div className="flex flex-col items-center">
                    {!uploadedImageUrl ? (
                      <div className="w-full max-w-md">
                        <ImageUploader onImageUploaded={handleImageUploaded} />
                        {form.formState.errors.image && (
                          <p className="mt-2 text-center text-sm text-red-200">
                            {form.formState.errors.image.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-green-200">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">
                            Upload Successful!
                          </span>
                        </div>

                        <div className="group relative">
                          <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-white/20 shadow-2xl">
                            <Image
                              src={uploadedImageUrl}
                              alt="Uploaded avatar"
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>

                          <div className="absolute inset-0 mx-auto flex h-40 w-40 items-center justify-center gap-3 rounded-full bg-black/60 opacity-0 transition-all duration-300 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => setUploadedImageUrl(null)}
                              className="rounded-full bg-blue-500 p-3 text-white transition-all hover:scale-105 hover:bg-blue-600"
                              title="Change image"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="rounded-full bg-red-500 p-3 text-white transition-all hover:scale-105 hover:bg-red-600"
                              title="Remove image"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Sections */}
                <div className="space-y-8 p-8">
                  {/* Basic Information Section */}
                  <div className="rounded-xl border p-6">
                    <div className="mb-6 flex items-center gap-3">
                      <User className="text-primary h-6 w-6" />
                      <h3 className="text-primary text-xl font-semibold">
                        Basic Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">
                              Full Name*
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Dr. John Doe"
                                {...field}
                                className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/80 backdrop-blur-sm transition-all duration-300"
                              />
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
                            <FormLabel className="text-foreground flex items-center gap-2 font-medium">
                              <Mail className="h-4 w-4" />
                              Email*
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="doctor@example.com"
                                {...field}
                                className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/80 backdrop-blur-sm transition-all duration-300"
                              />
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
                            <FormLabel className="text-foreground flex items-center gap-2 font-medium">
                              <Phone className="h-4 w-4" />
                              Phone*
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+1 234 567 8900"
                                {...field}
                                className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/80 backdrop-blur-sm transition-all duration-300"
                              />
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
                            <FormLabel className="text-foreground font-medium">
                              Gender*
                            </FormLabel>
                            <FormControl>
                              <ReusableCombobox
                                options={[
                                  { label: 'Male', value: 'MALE' },
                                  { label: 'Female', value: 'FEMALE' },
                                  { label: 'Other', value: 'OTHER' },
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select Gender"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="sm:col-span-2">
                        <FormField
                          control={form.control}
                          name="speciality"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground flex items-center gap-2 font-medium">
                                <Briefcase className="h-4 w-4" />
                                Speciality*
                              </FormLabel>
                              <FormControl>
                                <ReusableCombobox
                                  options={siteConfig.specialities.map(
                                    speciality => ({
                                      label: speciality.name,
                                      value: speciality.value,
                                    })
                                  )}
                                  onChange={field.onChange}
                                  value={field.value}
                                  placeholder="Select Speciality"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Hours Section */}
                  <div className="rounded-xl border p-6">
                    <div className="mb-6 flex items-center gap-3">
                      <Clock className="text-primary h-6 w-6" />
                      <h3 className="text-primary text-xl font-semibold">
                        Business Hours
                      </h3>
                    </div>
                    <BusinessHoursPicker
                      onChange={handleBusinessHoursChange}
                      current={businessHours}
                    />
                  </div>

                  {/* Location Information Section */}
                  <div className="rounded-xl border border-orange-100 p-6">
                    <div className="mb-6 flex items-center gap-3">
                      <MapPin className="text-primary h-6 w-6" />
                      <h3 className="text-primary text-xl font-semibold">
                        Location Information
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">
                              Street Address*
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main St, Suite 100"
                                {...field}
                                className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/80 backdrop-blur-sm transition-all duration-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">
                                City*
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="New York"
                                  {...field}
                                  className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/80 backdrop-blur-sm transition-all duration-300"
                                />
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
                              <FormLabel className="text-foreground font-medium">
                                State*
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="NY"
                                  {...field}
                                  className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/80 backdrop-blur-sm transition-all duration-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">
                                ZIP Code*
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="10001"
                                  {...field}
                                  className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/80 backdrop-blur-sm transition-all duration-300"
                                />
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
                              <FormLabel className="text-foreground font-medium">
                                Country*
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="USA"
                                  {...field}
                                  className="border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/80 backdrop-blur-sm transition-all duration-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hidden Image Field */}
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

                  {/* Submit Button */}
                  <div className="border-primary/10 border-t pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 h-12 w-full transform bg-gradient-to-r text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                          Adding Dentist...
                        </div>
                      ) : (
                        'Add Dentist'
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Card>
  );
}
