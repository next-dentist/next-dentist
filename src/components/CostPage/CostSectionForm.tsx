'use client';

import Editor from '@/components/Editor'; // Assuming you have an Editor component
import LoadingSpinner from '@/components/LoadingSpinner';
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
import { useCostPageSection } from '@/hooks/cost/useCostPageSection';
import { useOpenRouter } from '@/hooks/useOpenRouter';
import { CostSectionFormValues, costSectionSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import MediaPicker from '../MediaPicker';
import SingleImageUploader from './SingleImageUploader';

interface CostSectionFormProps {
  onSubmit?: () => void;
  costPageId: string;
  selectedSection?: {
    id: string;
    title: string;
    content: string | null;
    image: string | null;
    imageAlt: string | null;
  } | null;
  isDrawerOpen: boolean;
}

export default function CostSectionForm({
  onSubmit,
  costPageId,
  selectedSection,
  isDrawerOpen,
}: CostSectionFormProps) {
  const [imageUploaderKey, setImageUploaderKey] = useState<string>('initial');
  const { sendMessage, isLoading: isAiLoading } = useOpenRouter();
  const [aiTarget, setAiTarget] = useState<string | null>(null);

  const form = useForm<CostSectionFormValues>({
    resolver: zodResolver(costSectionSchema),
    defaultValues: {
      costSections: [
        {
          title: '',
          image: '',
          imageAlt: '',
          content: '',
        },
      ],
      costPageId,
    },
  });

  useEffect(() => {
    if (isDrawerOpen) {
      if (selectedSection) {
        form.reset({
          costSections: [
            {
              title: selectedSection.title || '',
              image: selectedSection.image || '',
              imageAlt: selectedSection.imageAlt || '',
              content: selectedSection.content || '',
            },
          ],
          costPageId,
        });
        setImageUploaderKey(`section-${selectedSection.id}-${Date.now()}`);
      } else {
        form.reset({
          costSections: [
            {
              title: '',
              image: '',
              imageAlt: '',
              content: '',
            },
          ],
          costPageId,
        });
        setImageUploaderKey(`new-section-${Date.now()}`);
      }
    }
  }, [selectedSection, form, costPageId, isDrawerOpen]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { create, update, isCreating, isUpdating } =
    useCostPageSection(costPageId);

  const handleFormSubmit = async (data: CostSectionFormValues) => {
    try {
      if (selectedSection) {
        await update({
          id: selectedSection.id,
          data: data.costSections[0],
        });
        toast.success('Cost section updated successfully');
      } else {
        await create(data);
        toast.success('Cost sections created successfully');
      }
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('Error saving cost section:', error);
      toast.error(
        selectedSection
          ? 'Failed to update cost section'
          : 'Failed to create cost sections'
      );
    }
  };

  const getFieldValue = (value: string | null): string => {
    return value || '';
  };

  const generateAIContent = async (fieldName: string) => {
    const title = form.getValues('costSections.0.title');

    if (!title) {
      toast.error('Please enter a title first');
      return;
    }

    setAiTarget(fieldName);

    try {
      const prompt = `Generate content for a cost section titled "${title}" for a dental service. The content should be informative, concise, and suitable for a dental website. Limit the content to 2 paragraphs. do not add title in the content, use HTML tags to format the content. wirte like a  dental expert and professional and use bullet points if needed, use the following format for the content in bullet points: <ul> <li> <ol> <p> <b> `;
      const response = await sendMessage(prompt);
      if (response) {
        const cleanedResponse = response.replace(/^["'](.*)["']$/g, '$1');
        form.setValue('costSections.0.content', cleanedResponse);
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
      {aiTarget === fieldName ? (
        <LoadingSpinner size="sm" />
      ) : (
        <Sparkles
          className={`h-4 w-4 ${
            aiTarget === fieldName
              ? 'animate-pulse text-amber-500'
              : 'text-muted-foreground'
          }`}
        />
      )}
      <span className="sr-only">Generate with AI</span>
    </Button>
  );

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div className="col-span-full space-y-4 rounded-lg border p-4 md:col-span-1 md:p-2">
            <FormField
              control={form.control}
              name="costSections.0.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={getFieldValue(field.value)}
                      placeholder="Title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="costSections.0.content"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Content</FormLabel>
                    <AiButton fieldName="content" />
                  </div>
                  <FormControl>
                    <Editor
                      value={field.value}
                      onChange={newContent =>
                        form.setValue(`costSections.0.content`, newContent)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-full space-y-4 rounded-lg border p-4 md:col-span-1 md:p-2">
            <MediaPicker
              trigger={
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  color="primary"
                >
                  Choose Image From Media Library
                </Button>
              }
              onSelect={url => {
                const imageUrl = Array.isArray(url) ? url[0] : url;
                form.setValue(`costSections.0.image`, imageUrl);
              }}
            />
            <FormField
              control={form.control}
              name="costSections.0.image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <SingleImageUploader
                      key={imageUploaderKey}
                      folderName="cost-sections"
                      imageUrl={
                        field.value && field.value !== ''
                          ? field.value
                          : undefined
                      }
                      imageAlt={form.getValues(`costSections.0.imageAlt`)}
                      onImageUploaded={url =>
                        form.setValue(`costSections.0.image`, url)
                      }
                      onImageDeleted={() =>
                        form.setValue(`costSections.0.image`, '')
                      }
                      onImageUpdated={alt =>
                        form.setValue(`costSections.0.imageAlt`, alt)
                      }
                      title="Cost Section Image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="costSections.0.imageAlt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Alt Text</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={getFieldValue(field.value || '')}
                      placeholder="Image Alt Text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-full flex justify-end gap-4">
            <Button type="submit" disabled={isCreating || isUpdating}>
              {selectedSection ? 'Update Section' : 'Create Section'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
