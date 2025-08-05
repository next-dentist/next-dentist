'use client';

import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  useCreateDentistAward,
  useDeleteDentistAward,
} from '@/hooks/useAdminDentistEdit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const awardSchema = z.object({
  awards: z.array(
    z.object({
      name: z.string().min(1, 'Award name is required'),
      dateAwarded: z.string().min(1, 'Date is required'),
    })
  ),
});

type AwardFormValues = z.infer<typeof awardSchema>;

interface Award {
  name: string;
  dateAwarded: string;
}

interface AdminAwardFormProps {
  dentistId: string;
}

export function AdminAwardForm({ dentistId }: AdminAwardFormProps) {
  const { data: dentist, isLoading } = useAdminDentistFetch(dentistId);
  const createMutation = useCreateDentistAward();
  const deleteMutation = useDeleteDentistAward();
  const [isOpen, setIsOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<AwardFormValues>({
    resolver: zodResolver(awardSchema),
    defaultValues: {
      awards: [{ name: '', dateAwarded: '' }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'awards',
  });

  // Parse awards data from awards property
  const awards: Award[] = dentist?.awards
    ? typeof dentist.awards === 'string'
      ? JSON.parse(dentist.awards)
      : Array.isArray(dentist.awards)
        ? (dentist.awards as unknown as Award[])
        : []
    : [];

  // Function to open drawer and populate form with existing awards
  const handleOpenDrawer = () => {
    // If there are existing awards, populate the form with all of them
    if (awards.length > 0) {
      replace(awards);
    } else {
      // If no existing awards, start with one empty field
      replace([{ name: '', dateAwarded: '' }]);
    }

    setIsOpen(true);
  };

  const onSubmit = async (data: AwardFormValues) => {
    try {
      setSubmitError(null);

      // Validate that all required fields are filled
      const invalidItems = data.awards.filter(
        award => !award.name.trim() || !award.dateAwarded.trim()
      );

      if (invalidItems.length > 0) {
        setSubmitError(
          'Please fill in all required fields (Award Name and Date Awarded)'
        );
        return;
      }

      const awardData = {
        dentistId,
        awards: data.awards,
      };

      const result = await createMutation.mutateAsync(awardData);
      setIsOpen(false);
      form.reset();
      toast.success('Awards saved successfully');
    } catch (error) {
      console.error('Error saving awards:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmitError(errorMessage);
      toast.error(`Failed to save awards: ${errorMessage}`);
    }
  };

  const handleDelete = async (awardName: string) => {
    if (window.confirm('Are you sure you want to delete this award?')) {
      try {
        const currentAwards = Array.isArray(dentist?.awards)
          ? (dentist.awards as unknown as Award[])
          : typeof dentist?.awards === 'string'
            ? JSON.parse(dentist.awards)
            : [];

        const updatedAwards = currentAwards.filter(
          (award: Award) => award.name !== awardName
        );

        await createMutation.mutateAsync({
          dentistId,
          awards: updatedAwards,
        });

        toast.success('Award deleted successfully');
      } catch (error) {
        console.error('Error deleting award:', error);
        toast.error('Failed to delete award');
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

        {/* Show existing awards info */}
        {awards.length > 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h4 className="mb-2 font-medium text-yellow-900">
              Current Awards ({awards.length})
            </h4>
            <div className="space-y-1">
              {awards.map((award, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-yellow-700"
                >
                  <span className="font-medium">{award.name}</span>
                  <span className="text-yellow-600">
                    ({new Date(award.dateAwarded).toLocaleDateString()})
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-yellow-600">
              You can edit existing awards below or add new ones.
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
                  name={`awards.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Award Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter award name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`awards.${index}.dateAwarded`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Awarded</FormLabel>
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
          onClick={() => append({ name: '', dateAwarded: '' })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Award
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
              'Save All Awards'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  const AwardsList = () => {
    if (!awards || awards.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          No awards added yet
        </div>
      );
    }

    return (
      <div className="w-full space-y-4">
        {awards.map(award => (
          <div
            key={award.name}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center space-x-4">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <div className="flex flex-col">
                <span className="font-medium">{award.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(award.dateAwarded).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(award.name)}
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
          <CardTitle>Awards & Recognition</CardTitle>
          <CardDescription>
            Manage your professional awards and achievements
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleOpenDrawer}>
          <Plus className="mr-2 h-4 w-4" />
          Manage Awards
        </Button>
      </CardHeader>
      <CardContent>
        <AwardsList />
      </CardContent>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Manage Awards & Recognition"
        side="right"
        width="w-[600px]"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Manage all your professional awards and achievements. You can edit
            existing awards or add new ones.
          </p>
          <FormContent />
        </div>
      </Drawer>
    </Card>
  );
}
