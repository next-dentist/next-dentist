'use client';

import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useAdminDentistFetch,
  useCreateDentistKnowsAbout,
  useDeleteDentistKnowsAbout,
} from '@/hooks/useAdminDentistEdit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

const knowsAboutSchema = z.object({
  knowsAbout: z.array(
    z.object({
      '@type': z.literal('Thing'),
      name: z.string().min(1, 'Specialty name is required'),
      description: z.string().min(1, 'Description is required'),
    })
  ),
});

type KnowsAboutFormValues = z.infer<typeof knowsAboutSchema>;

interface AdminKnowsAboutFormProps {
  dentistId: string;
}

export function AdminKnowsAboutForm({ dentistId }: AdminKnowsAboutFormProps) {
  const { data: dentist, isLoading } = useAdminDentistFetch(dentistId);
  const createMutation = useCreateDentistKnowsAbout();
  const deleteMutation = useDeleteDentistKnowsAbout();
  const [isOpen, setIsOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<KnowsAboutFormValues>({
    resolver: zodResolver(knowsAboutSchema),
    defaultValues: {
      knowsAbout: [{ '@type': 'Thing', name: '', description: '' }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'knowsAbout',
  });

  interface KnowsAboutItem {
    '@type': string;
    name: string;
    description: string;
  }

  // Parse knowsAbout data from knowsAbout property
  const knowsAbout: KnowsAboutItem[] = dentist?.knowsAbout
    ? typeof dentist.knowsAbout === 'string'
      ? JSON.parse(dentist.knowsAbout)
      : Array.isArray(dentist.knowsAbout)
        ? (dentist.knowsAbout as unknown as KnowsAboutItem[])
        : []
    : [];

  // Function to open drawer and populate form with existing specialties
  const handleOpenDrawer = () => {
    // If there are existing specialties, populate the form with all of them
    if (knowsAbout.length > 0) {
      // Ensure @type is properly typed for the form
      const formattedKnowsAbout = knowsAbout.map(item => ({
        '@type': 'Thing' as const,
        name: item.name,
        description: item.description,
      }));
      replace(formattedKnowsAbout);
    } else {
      // If no existing specialties, start with one empty field
      replace([{ '@type': 'Thing', name: '', description: '' }]);
    }

    setIsOpen(true);
  };

  const onSubmit = async (data: KnowsAboutFormValues) => {
    try {
      setSubmitError(null);

      // Validate that all required fields are filled
      const invalidItems = data.knowsAbout.filter(
        item => !item.name.trim() || !item.description.trim()
      );

      if (invalidItems.length > 0) {
        setSubmitError(
          'Please fill in all required fields (Specialty Name and Description)'
        );
        return;
      }

      const knowsAboutData = {
        dentistId,
        knowsAbout: data.knowsAbout,
      };

      const result = await createMutation.mutateAsync(knowsAboutData);

      setIsOpen(false);
      form.reset();
      toast.success('Specialties saved successfully');
    } catch (error) {
      console.error('Error saving specialties:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmitError(errorMessage);
      toast.error(`Failed to save specialties: ${errorMessage}`);
    }
  };

  const handleDelete = async (specialtyName: string) => {
    if (window.confirm('Are you sure you want to delete this specialty?')) {
      try {
        const currentKnowsAbout = Array.isArray(dentist?.knowsAbout)
          ? (dentist.knowsAbout as unknown as KnowsAboutItem[])
          : typeof dentist?.knowsAbout === 'string'
            ? JSON.parse(dentist.knowsAbout)
            : [];

        const updatedKnowsAbout = currentKnowsAbout.filter(
          (item: KnowsAboutItem) => item.name !== specialtyName
        );

        await createMutation.mutateAsync({
          dentistId,
          knowsAbout: updatedKnowsAbout,
        });

        toast.success('Specialty deleted successfully');
      } catch (error) {
        console.error('Error deleting specialty:', error);
        toast.error('Failed to delete specialty');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-10">
        {submitError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        {/* Show existing specialties info */}
        {knowsAbout.length > 0 && (
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h4 className="mb-2 font-medium text-purple-900">
              Current Specialties ({knowsAbout.length})
            </h4>
            <div className="space-y-1">
              {knowsAbout.map((specialty, idx) => (
                <div key={idx} className="text-sm text-purple-700">
                  <span className="font-medium">{specialty.name}</span>
                  <p className="mt-1 truncate text-xs text-purple-600">
                    {specialty.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-purple-600">
              You can edit existing specialties below or add new ones.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-start gap-4 rounded-lg border p-4"
            >
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name={`knowsAbout.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Orthodontics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`knowsAbout.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your expertise in this area..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="mt-8"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({ '@type': 'Thing', name: '', description: '' })
          }
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Specialty
        </Button>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setSubmitError(null);
              form.reset();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save All Specialties'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  const SpecialtiesList = () => {
    if (!knowsAbout || knowsAbout.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          No specialties added yet
        </div>
      );
    }

    return (
      <div className="w-full space-y-4">
        {knowsAbout.map(specialty => (
          <div
            key={specialty.name}
            className="flex items-start justify-between rounded-lg border p-4"
          >
            <div className="flex items-start space-x-4">
              <Brain className="mt-1 h-6 w-6 text-purple-500" />
              <div className="flex flex-col">
                <span className="font-medium">{specialty.name}</span>
                <p className="mt-1 text-sm text-gray-600">
                  {specialty.description}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(specialty.name)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Specialties & Expertise</CardTitle>
          <CardDescription>
            Manage your areas of expertise and specializations
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleOpenDrawer}>
          <Plus className="mr-2 h-4 w-4" />
          Manage Specialties
        </Button>
      </CardHeader>
      <CardContent>
        <SpecialtiesList />
      </CardContent>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Manage Specialties & Expertise"
        side="right"
        width="w-[600px]"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Manage all your areas of expertise and specializations. You can edit
            existing specialties or add new ones.
          </p>
          <FormContent />
        </div>
      </Drawer>
    </Card>
  );
}
