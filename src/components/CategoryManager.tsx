'use client';

import { listCategories } from '@/app/(actions)/ratings/listCategories';
import { Button } from '@/components/ui/button';
import { useRatingsCategory } from '@/hooks/ratings/useRatingsCategory';
import {
  RatingCategoryInput,
  ratingCategorySchema,
} from '@/lib/validators/ratingCategory';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Edit3, Plus, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Category = {
  id: string;
  name: string;
  label: string;
};

export default function CategoryManager() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', label: '' });

  // Fetch existing categories
  const { data: categories = [] } = useQuery({
    queryKey: ['ratingCategories'],
    queryFn: listCategories,
    staleTime: Infinity,
  });

  // CRUD operations
  const { create, update, delete: deleteCategory } = useRatingsCategory();

  // Add form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RatingCategoryInput>({
    resolver: zodResolver(ratingCategorySchema),
  });

  // Handle create
  const handleCreate = (data: RatingCategoryInput) => {
    create.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  // Handle edit start
  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm({ name: category.name, label: category.label });
  };

  // Handle edit save
  const saveEdit = () => {
    if (!editingId) return;

    update.mutate(
      { id: editingId, ...editForm },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditForm({ name: '', label: '' });
        },
      }
    );
  };

  // Handle edit cancel
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', label: '' });
  };

  // Handle delete with confirmation
  const handleDelete = (category: Category) => {
    if (
      window.confirm(
        `Are you sure you want to delete the category "${category.label}"? This action cannot be undone.`
      )
    ) {
      deleteCategory.mutate(category.id);
    }
  };

  return (
    <section className="space-y-8">
      {/* Add Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Add New Category
        </h3>
        <form
          onSubmit={handleSubmit(handleCreate)}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Internal Name *
            </label>
            <input
              {...register('name')}
              placeholder="WAITING_TIME"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              disabled={create.isPending}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Public Label *
            </label>
            <input
              {...register('label')}
              placeholder="Waiting Time"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              disabled={create.isPending}
            />
            {errors.label && (
              <p className="mt-1 text-xs text-red-600">
                {errors.label.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={create.isPending}
            className="gap-2 px-6"
          >
            <Plus size={16} />
            {create.isPending ? 'Adding...' : 'Add Category'}
          </Button>
        </form>
      </div>

      {/* Categories List */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Rating Categories ({categories.length})
          </h3>
        </div>

        {categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              No categories found. Add your first category above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-900">
              <div className="col-span-4">Internal Name</div>
              <div className="col-span-5">Public Label</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {/* Rows */}
            {categories.map((category: Category) => (
              <div
                key={category.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50"
              >
                {editingId === category.id ? (
                  // Edit Mode
                  <>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={e =>
                          setEditForm(prev => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                        disabled={update.isPending}
                      />
                    </div>
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={editForm.label}
                        onChange={e =>
                          setEditForm(prev => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                        disabled={update.isPending}
                      />
                    </div>
                    <div className="col-span-3 flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={saveEdit}
                        disabled={
                          update.isPending || !editForm.name || !editForm.label
                        }
                        className="gap-1"
                      >
                        <Save size={14} />
                        {update.isPending ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={update.isPending}
                        className="gap-1"
                      >
                        <X size={14} />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  // View Mode
                  <>
                    <div className="col-span-4">
                      <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-800">
                        {category.name}
                      </code>
                    </div>
                    <div className="col-span-5">
                      <span className="text-sm text-gray-900">
                        {category.label}
                      </span>
                    </div>
                    <div className="col-span-3 flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(category)}
                        disabled={editingId !== null}
                        className="gap-1 text-blue-600 hover:text-blue-700"
                      >
                        <Edit3 size={14} />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(category)}
                        disabled={
                          deleteCategory.isPending || editingId !== null
                        }
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                        {deleteCategory.isPending ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
