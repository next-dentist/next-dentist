'use client';

import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAlumni } from '@/hooks/useAlumni';
import { zodResolver } from '@hookform/resolvers/zod';
import { GraduationCap, Loader2, Plus, Trash2 } from 'lucide-react';
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

const alumniSchema = z.object({
  alumni: z.array(
    z.object({
      '@type': z.literal('CollegeOrUniversity'),
      name: z.string().min(1, 'Institution name is required'),
      sameAs: z.string().url('Must be a valid URL').min(1, 'URL is required'),
    })
  ),
});

type AlumniFormValues = z.infer<typeof alumniSchema>;

interface AdminAlumniOfFormProps {
  dentistId: string;
}

export function AdminAlumniOfForm({ dentistId }: AdminAlumniOfFormProps) {
  const { alumni, isLoading, createMutation, deleteMutation } =
    useAlumni(dentistId);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<AlumniFormValues>({
    resolver: zodResolver(alumniSchema),
    defaultValues: {
      alumni: [{ '@type': 'CollegeOrUniversity', name: '', sameAs: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'alumni',
  });

  useEffect(() => {
    if (alumni && alumni.length > 0) {
      form.reset({
        alumni: alumni.map(item => ({
          '@type': 'CollegeOrUniversity',
          name: item.name,
          sameAs: item.sameAs,
        })),
      });
    }
  }, [alumni, form]);

  const onSubmit = async (data: AlumniFormValues) => {
    try {
      await createMutation.mutateAsync(data.alumni);
      setIsOpen(false);
      form.reset();
      toast.success('Institutions saved successfully');
    } catch (error) {
      console.error('Error saving institutions:', error);
      toast.error('Failed to save institutions');
    }
  };

  const handleDelete = async (institutionName: string) => {
    if (window.confirm('Are you sure you want to delete this institution?')) {
      try {
        await deleteMutation.mutateAsync(institutionName);
        toast.success('Institution deleted successfully');
      } catch (error) {
        console.error('Error deleting institution:', error);
        toast.error('Failed to delete institution');
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
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-start gap-4 rounded-lg border p-4"
            >
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name={`alumni.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Harvard University"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`alumni.${index}.sameAs`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., https://www.harvard.edu"
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
            append({ '@type': 'CollegeOrUniversity', name: '', sameAs: '' })
          }
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Institution
        </Button>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false);
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
              'Save Institutions'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  const AlumniList = () => {
    if (!alumni || alumni.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          No institutions added yet
        </div>
      );
    }

    return (
      <div className="w-full space-y-4">
        {alumni.map(institution => (
          <div
            key={institution.name}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-6 w-6 text-blue-500" />
              <div className="flex flex-col">
                <span className="font-medium">{institution.name}</span>
                <a
                  href={institution.sameAs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {institution.sameAs}
                </a>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(institution.name)}
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
          <CardTitle>Education & Alumni</CardTitle>
          <CardDescription>
            Manage your educational background and institutions
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Institutions
        </Button>
      </CardHeader>
      <CardContent>
        <AlumniList />
      </CardContent>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add Educational Institutions"
        side="right"
        width="w-[600px]"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Add colleges, universities, and other educational institutions
          </p>
          <FormContent />
        </div>
      </Drawer>
    </Card>
  );
}
