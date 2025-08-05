import { createCategory } from '@/app/(actions)/ratings/createCategory';
import { deleteCategory } from '@/app/(actions)/ratings/deleteCategory';
import { updateCategory } from '@/app/(actions)/ratings/updateCategory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useRatingsCategory = () => {
  const qc = useQueryClient();

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: { name: string; label: string }) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v));
      return createCategory(null, fd);
    },
    onSuccess: () => {
      toast.success('Category created successfully');
      qc.invalidateQueries({ queryKey: ['ratingCategories'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string; label: string }) => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v));
      return updateCategory(null, fd);
    },
    onSuccess: () => {
      toast.success('Category updated successfully');
      qc.invalidateQueries({ queryKey: ['ratingCategories'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update category');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      toast.success('Category deleted successfully');
      qc.invalidateQueries({ queryKey: ['ratingCategories'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  };
};
