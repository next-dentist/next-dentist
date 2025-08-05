'use client';

import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWorkingAt } from '@/hooks/useWorkingAt';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
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

const workingAtSchema = z.object({
  workingAt: z.array(
    z.object({
      '@type': z.literal('Organization'),
      name: z.string().min(1, 'Organization name is required'),
      sameAs: z
        .string()
        .url('Must be a valid URL')
        .min(1, 'Website URL is required'),
      position: z.string().min(1, 'Position is required'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().optional(),
    })
  ),
});

type WorkingAtFormValues = z.infer<typeof workingAtSchema>;

interface AdminWorkingAtFormProps {
  dentistId: string;
}

export function AdminWorkingAtForm({ dentistId }: AdminWorkingAtFormProps) {
  const { workingAt, isLoading, createMutation, deleteMutation } =
    useWorkingAt(dentistId);
  const [isOpen, setIsOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<WorkingAtFormValues>({
    resolver: zodResolver(workingAtSchema),
    defaultValues: {
      workingAt: [
        {
          '@type': 'Organization',
          name: '',
          sameAs: '',
          position: '',
          startDate: '',
          endDate: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'workingAt',
  });

  useEffect(() => {
    if (workingAt && workingAt.length > 0) {
      form.reset({
        workingAt: workingAt.map(item => ({
          '@type': 'Organization' as const,
          name: item.name || '',
          sameAs: item.sameAs || '',
          position: item.position || '',
          startDate: item.startDate || '',
          endDate: item.endDate || '',
        })),
      });
    }
  }, [workingAt, form]);

  const onSubmit = async (data: WorkingAtFormValues) => {
    try {
      setSubmitError(null);

      // Validate that all required fields are filled
      const invalidItems = data.workingAt.filter(
        item =>
          !item.name.trim() ||
          !item.sameAs.trim() ||
          !item.position.trim() ||
          !item.startDate.trim()
      );

      if (invalidItems.length > 0) {
        setSubmitError(
          'Please fill in all required fields (Name, Website, Position, and Start Date)'
        );
        return;
      }

      await createMutation.mutateAsync(data.workingAt);
      setIsOpen(false);
      form.reset();
      toast.success('Organizations saved successfully');
    } catch (error) {
      console.error('Error saving organizations:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmitError(errorMessage);
      toast.error(`Failed to save organizations: ${errorMessage}`);
    }
  };

  const handleDelete = async (organizationName: string) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await deleteMutation.mutateAsync(organizationName);
        toast.success('Organization deleted successfully');
      } catch (error) {
        console.error('Error deleting organization:', error);
        toast.error('Failed to delete organization');
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
        <div className="space-y-4">
          {submitError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-start gap-4 rounded-lg border p-4"
            >
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name={`workingAt.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., City Dental Clinic"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`workingAt.${index}.sameAs`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., https://citydentalclinic.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`workingAt.${index}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Senior Dentist" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`workingAt.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`workingAt.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
            append({
              '@type': 'Organization',
              name: '',
              sameAs: '',
              position: '',
              startDate: '',
              endDate: '',
            })
          }
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Organization
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
              'Save Organizations'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  const OrganizationsList = () => {
    if (!workingAt || workingAt.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          No organizations added yet
        </div>
      );
    }

    return (
      <div className="w-full space-y-4">
        {workingAt.map(organization => (
          <div
            key={organization.name}
            className="flex items-start justify-between rounded-lg border p-4"
          >
            <div className="flex items-start space-x-4">
              <Building2 className="mt-1 h-6 w-6 text-green-500" />
              <div className="flex flex-col">
                <span className="font-medium">{organization.name}</span>
                <p className="mt-1 text-sm text-gray-600">
                  Position: {organization.position}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(organization.name)}
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
          <CardTitle>Work Organizations</CardTitle>
          <CardDescription>
            Manage the organizations and clinics where you work
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Organizations
        </Button>
      </CardHeader>
      <CardContent>
        <OrganizationsList />
      </CardContent>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Work Organizations"
        side="right"
        width="w-[600px]"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Add organizations, clinics, and hospitals where you work
          </p>
          <FormContent />
        </div>
      </Drawer>
    </Card>
  );
}
