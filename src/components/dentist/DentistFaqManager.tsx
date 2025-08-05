'use client';

import {
  createFaq,
  deleteFaq,
  listFaqs,
  moveFaq,
  updateFaq,
} from '@/app/(actions)/faqs/index';
import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import {
  FaqCreateInput,
  faqCreateSchema,
  FaqUpdateInput,
  faqUpdateSchema,
} from '@/lib/validators/faq';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

export default function DentistFaqManager({
  dentistId,
}: {
  dentistId: string;
}) {
  const qc = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);

  /* -------------------------------- data ------------------------------ */
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['faqs', dentistId],
    queryFn: () => listFaqs(dentistId),
  });

  /* --------------------------- create form ---------------------------- */
  const createForm = useForm<FaqCreateInput>({
    resolver: zodResolver(faqCreateSchema),
    defaultValues: { dentistId, question: '', answer: '' },
  });

  const createMut = useMutation({
    mutationFn: (d: FaqCreateInput) => {
      const fd = new FormData();
      Object.entries(d).forEach(([k, v]) => fd.append(k, v));
      return createFaq(null, fd);
    },
    onSuccess: () => {
      toast.success('FAQ added');
      createForm.reset({ dentistId, question: '', answer: '' });
      qc.invalidateQueries({ queryKey: ['faqs', dentistId] });
      setIsDrawerOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  /* --------------------- edit form ----------------------- */
  const editForm = useForm<FaqUpdateInput>({
    resolver: zodResolver(faqUpdateSchema),
  });

  const updateMut = useMutation({
    mutationFn: (d: FaqUpdateInput) => {
      const fd = new FormData();
      Object.entries(d).forEach(([k, v]) => fd.append(k, String(v)));
      return updateFaq(null, fd);
    },
    onSuccess: () => {
      toast.success('FAQ updated');
      qc.invalidateQueries({ queryKey: ['faqs', dentistId] });
      setEditingFaq(null);
      setIsDrawerOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  /* ---------------------------- helpers ------------------------------- */
  const mutateSimple = (
    fn: (...args: any[]) => Promise<any>,
    successMsg: string
  ) =>
    useMutation({
      mutationFn: fn,
      onSuccess: () => {
        toast.success(successMsg);
        qc.invalidateQueries({ queryKey: ['faqs', dentistId] });
      },
      onError: (e: any) => toast.error(e.message),
    });

  const delMut = mutateSimple(deleteFaq, 'FAQ deleted');
  const moveMut = useMutation({
    mutationFn: ({ id, delta }: { id: string; delta: 1 | -1 }) =>
      moveFaq(id, delta),
    onSuccess: () => {
      toast.success('FAQ re-ordered');
      qc.invalidateQueries({ queryKey: ['faqs', dentistId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleEditClick = (faq: any) => {
    setEditingFaq(faq);
    editForm.reset({
      dentistId: faq.dentistId,
      id: faq.id,
      order: faq.order,
      question: faq.question,
      answer: faq.answer,
    });
    setIsDrawerOpen(true);
  };

  const handleCreateClick = () => {
    setEditingFaq(null);
    createForm.reset({ dentistId, question: '', answer: '' });
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setEditingFaq(null);
  };

  /* ---------------------------- render -------------------------------- */
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Manage your clinic's FAQs to help patients find answers quickly
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create FAQ
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No FAQs added yet
          </div>
        ) : (
          <ul className="space-y-4">
            {faqs.map((faq, idx) => (
              <li key={faq.id} className="rounded border p-4">
                <p className="font-medium">{faq.question}</p>

                <div className="mt-3 flex gap-2">
                  <IconButton
                    label="Move up"
                    disabled={idx === 0}
                    onClick={() => moveMut.mutate({ id: faq.id, delta: -1 })}
                  >
                    <ArrowUp size={16} />
                  </IconButton>
                  <IconButton
                    label="Move down"
                    disabled={idx === faqs.length - 1}
                    onClick={() => moveMut.mutate({ id: faq.id, delta: 1 })}
                  >
                    <ArrowDown size={16} />
                  </IconButton>
                  <IconButton label="Edit" onClick={() => handleEditClick(faq)}>
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton
                    label="Delete"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this FAQ?'
                        )
                      ) {
                        delMut.mutate(faq.id);
                      }
                    }}
                    danger
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      {/* Drawer for Create/Edit Forms */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        title={editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
        side="right"
        width="w-[600px]"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {editingFaq
              ? 'Edit your frequently asked question and answer'
              : 'Add a new frequently asked question and answer'}
          </p>

          {editingFaq ? (
            <form
              onSubmit={editForm.handleSubmit(data => updateMut.mutate(data))}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Question
                  </label>
                  <textarea
                    {...editForm.register('question')}
                    rows={3}
                    className="w-full rounded border px-3 py-2"
                    placeholder="Enter question..."
                  />
                  {editForm.formState.errors.question && (
                    <p className="mt-1 text-xs text-red-500">
                      {editForm.formState.errors.question.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Answer
                  </label>
                  <textarea
                    {...editForm.register('answer')}
                    rows={5}
                    className="w-full rounded border px-3 py-2"
                    placeholder="Enter answer..."
                  />
                  {editForm.formState.errors.answer && (
                    <p className="mt-1 text-xs text-red-500">
                      {editForm.formState.errors.answer.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDrawerClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    updateMut.isPending || editForm.formState.isSubmitting
                  }
                >
                  {updateMut.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={createForm.handleSubmit(data => createMut.mutate(data))}
              className="space-y-6"
            >
              <input
                type="hidden"
                value={dentistId}
                {...createForm.register('dentistId')}
              />

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Question
                  </label>
                  <textarea
                    {...createForm.register('question')}
                    rows={3}
                    className="w-full rounded border px-3 py-2"
                    placeholder="Enter question..."
                  />
                  {createForm.formState.errors.question && (
                    <p className="mt-1 text-xs text-red-500">
                      {createForm.formState.errors.question.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Answer
                  </label>
                  <textarea
                    {...createForm.register('answer')}
                    rows={5}
                    className="w-full rounded border px-3 py-2"
                    placeholder="Enter answer..."
                  />
                  {createForm.formState.errors.answer && (
                    <p className="mt-1 text-xs text-red-500">
                      {createForm.formState.errors.answer.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDrawerClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMut.isPending || createForm.formState.isSubmitting
                  }
                >
                  {createMut.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create FAQ'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Drawer>
    </Card>
  );
}

/* -------------- tiny helpers ---------------------------------------- */

function IconButton({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'rounded border p-1',
        danger
          ? 'border-red-300 text-red-600 hover:bg-red-50'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  );
}
