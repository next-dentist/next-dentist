'use client';

import {
  createTableSet,
  deleteTableSet,
  updateTableSet,
} from '@/app/actions/CostTableAction';
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
import { useTableSets } from '@/hooks/cost/useCostPageTable'; // Assuming this path is correct
import { generateSlug } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const tableSetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
});

type TableSetFormValues = z.infer<typeof tableSetSchema>;

interface CostTableSetFormProps {
  costPageId: string;
}

interface TableSet extends TableSetFormValues {
  id: string;
}

export default function CostTableSetManager({
  // Renamed for clarity
  costPageId,
}: CostTableSetFormProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTableSet, setEditingTableSet] = useState<TableSet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const { data: tableSets, isLoading, refetch } = useTableSets(costPageId);

  const form = useForm<TableSetFormValues>({
    resolver: zodResolver(tableSetSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  useEffect(() => {
    if (editingTableSet) {
      form.reset(editingTableSet);
    } else {
      form.reset({ name: '', slug: '' });
    }
  }, [editingTableSet, form, isFormOpen]);

  const handleAddNew = () => {
    setEditingTableSet(null);
    form.reset({ name: '', slug: '' });
    setIsFormOpen(true);
  };

  const handleEdit = (tableSet: TableSet) => {
    setEditingTableSet(tableSet);
    form.reset(tableSet);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table set?')) return;
    setIsDeletingId(id);
    try {
      await deleteTableSet(id);
      toast.success('Table set deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting table set:', error);
      toast.error('Failed to delete table set');
    } finally {
      setIsDeletingId(null);
    }
  };

  const onFormSubmit = async (values: TableSetFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingTableSet) {
        await updateTableSet(editingTableSet.id, values);
        toast.success('Table set updated successfully');
      } else {
        await createTableSet({ ...values, costPageId });
        toast.success('Table set created successfully');
      }
      refetch();
      setIsFormOpen(false);
      setEditingTableSet(null);
      form.reset({ name: '', slug: '' });
    } catch (error) {
      console.error('Error saving table set:', error);
      toast.error(editingTableSet ? 'Failed to update' : 'Failed to create');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (name: string) => {
    form.setValue('name', name);
    form.setValue('slug', generateSlug(name));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={handleAddNew} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Table Set
        </Button>
      </div>

      {isFormOpen && (
        <div className="bg-card rounded-lg border p-4 shadow-sm">
          <h3 className="mb-4 text-lg font-medium">
            {editingTableSet ? 'Edit Table Set' : 'Create New Table Set'}
          </h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onFormSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Table Set Name"
                        {...field}
                        onChange={e => handleNameChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
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
                      <Input placeholder="table-set-slug" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingTableSet ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      <div className="space-y-4">
        {tableSets && tableSets.length > 0
          ? tableSets.map(ts => (
              <div
                key={ts.id}
                className="bg-card flex items-center justify-between rounded-lg border p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium">{ts.name}</p>
                  <p className="text-muted-foreground text-sm">
                    Slug: {ts.slug}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(ts as TableSet)}
                    disabled={isDeletingId === ts.id}
                  >
                    <Edit className="mr-1 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(ts.id)}
                    disabled={isDeletingId === ts.id || isSubmitting}
                  >
                    {isDeletingId === ts.id ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-1 h-4 w-4" />
                    )}{' '}
                    Delete
                  </Button>
                </div>
              </div>
            ))
          : !isFormOpen && (
              <p className="text-muted-foreground text-center">
                No table sets found. Click 'Add New Table Set' to create one.
              </p>
            )}
      </div>
    </div>
  );
}
