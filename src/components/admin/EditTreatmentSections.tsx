'use client';

import Drawer from '@/components/Drawer';
import Editor from '@/components/Editor';
import { generateSectionPrompt } from '@/components/EditTreatmentInstructions/utils/aiHelpers';
import {
  useAdminTreatments,
  useCreateTreatmentSection,
  useDeleteTreatmentSection,
  useUpdateTreatmentSection,
} from '@/hooks/useAdminTreatments';
import { useOpenRouter } from '@/hooks/useOpenRouter';
import { sectionFormSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Section } from '@prisma/client';
import { Pencil, PlusCircle, Sparkles, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import MediaPicker from '../MediaPicker'; // Importing MediaPicker
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
type SectionFormValues = z.infer<typeof sectionFormSchema>;

interface EditTreatmentSectionsProps {
  treatmentId: string;
}

function SectionForm({
  treatmentId,
  initialData,
  onClose,
}: {
  treatmentId: string;
  initialData?: Section | null;
  onClose: () => void;
}) {
  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      menuText: initialData?.menuText || '',
      cssId: initialData?.cssId || '',
      content: initialData?.content || '',
      image: initialData?.image || '',
      buttonText: initialData?.buttonText || '',
      buttonLink: initialData?.buttonLink || '',
    },
  });

  const { mutate: createSection, isPending: isCreating } =
    useCreateTreatmentSection();
  const { mutate: updateSection, isPending: isUpdating } =
    useUpdateTreatmentSection();
  const isPending = isCreating || isUpdating;

  const { sendMessage, isLoading: isAiLoading } = useOpenRouter();
  const [aiTarget, setAiTarget] = useState<string | null>(null);

  // Reset form when initialData changes (for editing different sections)
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || '',
        menuText: initialData.menuText || '',
        cssId: initialData.cssId || '',
        content: initialData.content || '',
        image: initialData.image || '',
        buttonText: initialData.buttonText || '',
        buttonLink: initialData.buttonLink || '',
      });
    } else {
      // Reset to empty form when creating new section
      form.reset({
        title: '',
        menuText: '',
        cssId: '',
        content: '',
        image: '',
        buttonText: '',
        buttonLink: '',
      });
    }
  }, [initialData, form]);

  const onSubmit = (values: SectionFormValues) => {
    const dataToSubmit = {
      ...values,
      buttonLink: values.buttonLink === '' ? null : values.buttonLink,
    };

    if (initialData) {
      updateSection(
        { treatmentId, sectionId: initialData.id, data: dataToSubmit },
        {
          onSuccess: onClose,
          onError: error => {
            toast.error(`Failed to update section: ${error.message}`);
          },
        }
      );
    } else {
      createSection(
        { treatmentId, data: dataToSubmit },
        {
          onSuccess: onClose,
          onError: error => {
            toast.error(`Failed to create section: ${error.message}`);
          },
        }
      );
    }
  };

  const generateAIContent = async (fieldName: string) => {
    if (fieldName === 'title') {
      const conceptTitle = form.getValues('title');

      if (!conceptTitle) {
        toast.error("Please enter a concept first (e.g., 'Denture Benefits')");
        return;
      }

      setAiTarget(fieldName);

      try {
        const prompt = generateSectionPrompt(
          fieldName,
          { title: conceptTitle },
          treatmentId
        );
        const response = await sendMessage(prompt);

        if (response) {
          const cleanedResponse = response.replace(/^["'](.*)["']$/g, '$1');
          form.setValue(fieldName as any, cleanedResponse);
          toast.success(`Generated title based on your concept`);
        }
      } catch (error) {
        toast.error(`Failed to generate title: ${error}`);
      } finally {
        setAiTarget(null);
      }
      return;
    }

    const title = form.getValues('title');

    if (!title) {
      toast.error('Please enter a title first');
      return;
    }

    setAiTarget(fieldName);

    try {
      const prompt = generateSectionPrompt(
        fieldName,
        { title: title },
        treatmentId
      );
      const response = await sendMessage(prompt);
      if (response) {
        const cleanedResponse = response.replace(/^["'](.*)["']$/g, '$1');
        form.setValue(fieldName as any, cleanedResponse);
        toast.success(`Generated ${fieldName} content`);
      }
    } catch (error) {
      toast.error(`Failed to generate content: ${error}`);
    } finally {
      setAiTarget(null);
    }
  };

  const AiButton = ({ fieldName }: { fieldName: string }) => (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="h-8 w-8 rounded-full"
      onClick={() => generateAIContent(fieldName)}
      disabled={isAiLoading || !!aiTarget}
    >
      <Sparkles
        className={`h-4 w-4 ${
          aiTarget === fieldName
            ? 'animate-pulse text-amber-500'
            : 'text-muted-foreground'
        }`}
      />
      <span className="sr-only">Generate with AI</span>
    </Button>
  );

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
                <div className="flex items-center justify-between">
                  <FormLabel>Title *</FormLabel>
                  <AiButton fieldName="title" />
                </div>
                <FormControl>
                  <Input
                    placeholder="Section Title or concept (e.g., 'Denture Benefits')"
                    {...field}
                    disabled={aiTarget === 'title'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Content *</FormLabel>
                  <AiButton fieldName="content" />
                </div>
                <FormControl>
                  <Editor
                    value={field.value}
                    onChange={newContent => field.onChange(newContent)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="menuText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Menu Text (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Text for navigation menu"
                    {...field}
                    value={getFieldValue(field.value)}
                    disabled={aiTarget === 'menuText'}
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
            name="cssId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CSS ID (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., about-section (for linking)"
                    {...field}
                    value={getFieldValue(field.value)}
                    disabled={aiTarget === 'cssId'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image (Optional)</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <MediaPicker
                      onSelect={url => {
                        const imageUrl = Array.isArray(url) ? url[0] : url;
                        form.setValue('image', imageUrl);
                      }}
                      trigger={
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          size="lg"
                        >
                          {form.watch('image')
                            ? '📷 Change Image'
                            : '📁 Choose Image From Media Library'}
                        </Button>
                      }
                    />

                    {/* Image Preview */}
                    {form.watch('image') && (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Image
                              src={form.watch('image') || ''}
                              alt="Section Image Preview"
                              className="h-24 w-24 rounded-md object-cover shadow-sm"
                              width={96}
                              height={96}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Current Image
                            </p>
                            <p className="mt-1 text-xs break-all text-gray-500">
                              {form.watch('image')?.split('/').pop() ||
                                'Unknown filename'}
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => form.setValue('image', '')}
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Remove Image
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buttonText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Text (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Learn More"
                    {...field}
                    value={getFieldValue(field.value)}
                    disabled={aiTarget === 'buttonText'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buttonLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Link (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/page"
                    {...field}
                    value={getFieldValue(field.value)}
                    disabled={aiTarget === 'buttonLink'}
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
            disabled={!!aiTarget}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !!aiTarget}>
            {isPending
              ? initialData
                ? 'Saving...'
                : 'Creating...'
              : initialData
                ? 'Save Changes'
                : 'Create Section'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function EditTreatmentSections({
  treatmentId,
}: EditTreatmentSectionsProps) {
  const { data: treatment, isLoading, error } = useAdminTreatments(treatmentId);

  const { mutate: deleteSection, isPending: isDeleting } =
    useDeleteTreatmentSection();

  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const handleDelete = (sectionId: string, sectionTitle: string) => {
    toast.warning(
      `Are you sure you want to delete the section "${sectionTitle}"?`,
      {
        action: {
          label: 'Delete',
          onClick: () => deleteSection({ treatmentId, sectionId }),
        },
        cancel: {
          label: 'Cancel',
          onClick: () => {},
        },
        duration: 10000,
      }
    );
  };

  if (isLoading) {
    return <div>Loading treatment sections...</div>;
  }

  if (!treatment) {
    return <div>No treatment data found.</div>;
  }

  const sections: Section[] = treatment.sections || [];

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Treatment Page Sections</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddDrawerOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Add New Section"
        side="right"
        width="w-[800px]"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Enter the details for the new page section.
          </p>
          <SectionForm
            treatmentId={treatmentId}
            onClose={() => setIsAddDrawerOpen(false)}
          />
        </div>
      </Drawer>

      {sections.length > 0 ? (
        <div className="space-y-3">
          {sections.map(section => (
            <div
              key={section.id}
              className="flex items-start justify-between rounded-md border p-3 hover:bg-gray-50"
            >
              <div className="mr-4 flex-1 overflow-hidden">
                <span className="font-medium">{section.title}</span>
                {section.menuText && (
                  <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                    Menu: {section.menuText}
                  </span>
                )}
                {section.cssId && (
                  <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-600">
                    ID: #{section.cssId}
                  </span>
                )}
                <p className="mt-1 max-w-[500px] truncate text-sm text-gray-600">
                  {section.content}
                </p>
                {section.buttonText && section.buttonLink && (
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="mt-1 h-auto p-0"
                  >
                    <a
                      href={section.buttonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {section.buttonText}
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex flex-shrink-0 items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingSection({ ...section })}
                  className="hover:bg-gray-200"
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Drawer
                  isOpen={editingSection?.id === section.id}
                  onClose={() => setEditingSection(null)}
                  title={`Edit Section: ${section.title}`}
                  side="right"
                  width="w-[800px]"
                >
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Update the details for this section.
                    </p>
                    <SectionForm
                      treatmentId={treatmentId}
                      initialData={section}
                      onClose={() => setEditingSection(null)}
                    />
                  </div>
                </Drawer>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(section.id, section.title)}
                  disabled={isDeleting}
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No sections associated with this treatment yet. Click "Add Section" to
          add one.
        </p>
      )}
    </div>
  );
}
