'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAdminTreatmentsManage } from '@/hooks/useAdminTreatmentsManage';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Simple form values type without zod
interface TreatmentFormValues {
  name: string;
  description?: string;
  image?: string;
  price?: string;
  minPrice?: string;
  maxPrice?: string;
  currency?: string;
  duration?: string;
  slug?: string;
}

interface TreatmentEditFormByIdProps {
  treatmentId?: string;
  dentistId: string;
  isMetaTemplate?: boolean;
  onSuccess?: () => void;
}

const TreatmentEditFormById: React.FC<TreatmentEditFormByIdProps> = ({
  treatmentId,
  dentistId,
  isMetaTemplate = false,
  onSuccess,
}) => {
  // Use createTreatment and updateTreatment from the hook
  const {
    createTreatment,
    updateTreatment,
    isCreatingTreatment,
    isUpdatingTreatment,
  } = useAdminTreatmentsManage();

  // Initialize the form without zod resolver
  const form = useForm<TreatmentFormValues>({
    defaultValues: {
      name: '',
      description: '',
      image: '',
      price: '',
      minPrice: '',
      maxPrice: '',
      currency: '₹',
      duration: '',
      slug: '',
    },
    mode: 'onChange',
  });

  // Fetch treatment data - choose the right API endpoint based on whether we're editing
  // a dentist's treatment or a template
  const { data: treatment, isLoading } = useQuery({
    queryKey: ['treatment', treatmentId, dentistId, isMetaTemplate],
    queryFn: async () => {
      if (!treatmentId) return null;

      let endpoint;
      if (isMetaTemplate) {
        // Fetch treatment meta template
        endpoint = `/api/admin/treatments/${treatmentId}`;
      } else {
        // Fetch dentist-specific treatment
        endpoint = `/api/admin/dentists/${dentistId}/treatments/${treatmentId}`;
      }

      const response = await axios.get(endpoint);
      return isMetaTemplate ? response.data.treatment : response.data;
    },
    enabled: !!treatmentId,
  });

  // Update form with existing treatment data when fetched
  useEffect(() => {
    if (treatment) {
      form.reset({
        name: treatment.name || '',
        description: treatment.description || '',
        image: treatment.image || '',
        price: treatment.price ? String(treatment.price) : '',
        minPrice: treatment.minPrice ? String(treatment.minPrice) : '',
        maxPrice: treatment.maxPrice ? String(treatment.maxPrice) : '',
        currency: treatment.currency || '₹',
        duration: treatment.duration || '',
        slug: treatment.slug || '',
      });
    }
  }, [treatment, form]);

  // Handle form submission
  const onSubmit = async (values: TreatmentFormValues) => {
    const isPending = isCreatingTreatment || isUpdatingTreatment;
    if (isPending) return;

    // Basic validation
    if (!values.name || values.name.trim().length === 0) {
      toast.error('Treatment name is required');
      return;
    }

    try {
      if (isMetaTemplate) {
        // Creating a new treatment from template - adds to dentist's treatments table
        await createTreatment(
          {
            dentistId,
            ...values, // Include all values including slug
            // Include the meta ID reference to link back to the template
            TreatmentMetaId: treatment?.id,
          },
          {
            onSuccess: () => {
              toast.success('Treatment added to dentist successfully');
              if (onSuccess) onSuccess();
            },
          }
        );
      } else {
        // Updating an existing treatment - include the slug in the update
        await updateTreatment(
          {
            treatmentId: treatmentId!,
            dentistId,
            treatmentData: values, // Use the complete values object with slug
          },
          {
            onSuccess: () => {
              toast.success("Dentist's treatment updated successfully");
              if (onSuccess) onSuccess();
            },
          }
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(`Failed to ${isMetaTemplate ? 'add' : 'update'} treatment`);
    }
  };

  const isPending = isCreatingTreatment || isUpdatingTreatment || isLoading;

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Treatment name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Enter description"
                    value={field.value || ''}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Treatment slug" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://example.com/image.jpg"
                    value={field.value || ''}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="e.g., 150.00"
                      value={field.value || ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., ₹, $" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="Optional min price"
                      value={field.value || ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="Optional max price"
                      value={field.value || ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., 30 minutes, 1 hour"
                    value={field.value || ''}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isMetaTemplate ? 'Creating...' : 'Updating...'}
                </>
              ) : isMetaTemplate ? (
                'Create Treatment'
              ) : (
                'Update Treatment'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TreatmentEditFormById;
