'use client';

import Drawer from '@/components/Drawer';
import Editor from '@/components/Editor';
import {
  useAdminTreatments,
  useCreateTreatmentCost,
  useDeleteTreatmentCost,
  useUpdateTreatmentCost,
} from '@/hooks/useAdminTreatments';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cost } from '@prisma/client';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

const costFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priceMin: z.string().nullable().optional(),
  priceMax: z.string().nullable().optional(),
  priceSuffix: z.string().nullable().optional(),
  pricePrefix: z.string().nullable().optional(),
});

type CostFormValues = z.infer<typeof costFormSchema>;

interface EditTreatmentCostProps {
  treatmentId: string;
}

function CostForm({
  treatmentId,
  initialData,
  onClose,
}: {
  treatmentId: string;
  initialData?: Cost | null;
  onClose: () => void;
}) {
  const form = useForm<CostFormValues>({
    resolver: zodResolver(costFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priceMin: initialData?.priceMin || null,
      priceMax: initialData?.priceMax || null,
      priceSuffix: initialData?.priceSuffix || null,
      pricePrefix: initialData?.pricePrefix || null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description,
        priceMin: initialData.priceMin,
        priceMax: initialData.priceMax,
        priceSuffix: initialData.priceSuffix,
        pricePrefix: initialData.pricePrefix,
      });
    }
  }, [initialData, form]);

  const { mutate: createCost, isPending: isCreating } =
    useCreateTreatmentCost();
  const { mutate: updateCost, isPending: isUpdating } =
    useUpdateTreatmentCost();
  const isPending = isCreating || isUpdating;

  const onSubmit: SubmitHandler<CostFormValues> = values => {
    if (initialData) {
      updateCost(
        { treatmentId, costId: initialData.id, data: values },
        { onSuccess: onClose }
      );
    } else {
      createCost({ treatmentId, data: values }, { onSuccess: onClose });
    }
  };

  const getFieldValue = (value: string | null | undefined): string => {
    return value || '';
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div className="col-span-full space-y-4 rounded-lg border p-4 md:col-span-1 md:p-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={getFieldValue(field.value)}
                    placeholder="Cost title"
                  />
                </FormControl>
                <FormMessage />
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
                  <Editor
                    value={field.value}
                    onChange={newContent =>
                      form.setValue('description', newContent)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-full space-y-4 rounded-lg border p-4 md:col-span-1 md:p-2">
          <FormField
            control={form.control}
            name="pricePrefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prefix (e.g., $, Starts at)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={getFieldValue(field.value)}
                    placeholder="Price prefix"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceSuffix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suffix (e.g., /session, onwards)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={getFieldValue(field.value)}
                    placeholder="Price suffix"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Price (e.g., 1000)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={getFieldValue(field.value)}
                    placeholder="Minimum price"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Price (e.g., 5000)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={getFieldValue(field.value)}
                    placeholder="Maximum price"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-full flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? 'Saving...'
              : initialData
                ? 'Save Changes'
                : 'Add Cost'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function EditTreatmentCost({
  treatmentId,
}: EditTreatmentCostProps) {
  const { data: treatment, isLoading, error } = useAdminTreatments(treatmentId);
  const { mutate: deleteCost, isPending: isDeleting } =
    useDeleteTreatmentCost();
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<Cost | null>(null);

  const handleDelete = (costId: string) => {
    if (window.confirm('Are you sure you want to delete this cost item?')) {
      deleteCost({ treatmentId, costId });
    }
  };

  if (isLoading) return <div>Loading treatment costs...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;
  if (!treatment) return <div>No treatment data found.</div>;

  const costs: Cost[] = treatment.costs || [];

  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Treatment Costs</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddDrawerOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Cost
        </Button>
      </div>

      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        side="right"
        width="w-[80%] md:w-[40%]"
        title="Add New Cost"
      >
        <CostForm
          treatmentId={treatmentId}
          onClose={() => setIsAddDrawerOpen(false)}
        />
      </Drawer>

      {costs.length > 0 ? (
        <div className="space-y-3">
          {costs.map(cost => (
            <div
              key={cost.id}
              className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50"
            >
              <div>
                <span className="font-medium">{cost.title}</span>
                <p className="text-xs text-gray-500">{cost.description}</p>
                <p className="mt-1 text-xs text-gray-700">
                  {cost.pricePrefix || cost.currency || ''}
                  {cost.priceMin}
                  {cost.priceMax && cost.priceMin ? ' - ' : ''}
                  {cost.priceMax}
                  {cost.priceSuffix ? ` ${cost.priceSuffix}` : ''}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingCost(cost)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Drawer
                  isOpen={editingCost?.id === cost.id}
                  onClose={() => setEditingCost(null)}
                  side="right"
                  width="w-[80%] md:w-[40%]"
                  title={`Edit Cost: ${cost.title}`}
                >
                  <CostForm
                    treatmentId={treatmentId}
                    initialData={editingCost}
                    onClose={() => setEditingCost(null)}
                  />
                </Drawer>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(cost.id)}
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No costs associated with this treatment yet. Click "Add Cost" to add
          one.
        </p>
      )}
    </div>
  );
}
