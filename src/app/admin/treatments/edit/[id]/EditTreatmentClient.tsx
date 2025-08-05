'use client';

import AdminTreatmentVideo from '@/components/admin/AdminTreatmentVideo';
import EditTreatmentCost from '@/components/admin/EditTreatmentCost';
import EditTreatmentFAQ from '@/components/admin/EditTreatmentFAQ';
import EditTreatmentSections from '@/components/admin/EditTreatmentSections';
import Editor from '@/components/Editor';
import EditTreatmentInstructions from '@/components/EditTreatmentInstructions/EditTreatmentInstructions';
import ImageUploader from '@/components/ImageUploader';
import MediaPicker from '@/components/MediaPicker';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import AdminTreatmentSeo from '@/components/admin/AdminTreatmentSeo';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AI_INSTRUCTIONS } from '@/config';
import { useOpenRouter } from '@/hooks/useOpenRouter';
import { useTreatmentEdit } from '@/hooks/useTreatmentEdit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cost } from '@prisma/client';
import { ArrowUpRight, Loader2, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Define the form schema with Zod
const treatmentFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  image: z.string().optional(),
  duration: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  beforeAfter: z.string().optional(),
});

type TreatmentFormValues = z.infer<typeof treatmentFormSchema>;

export default function EditTreatmentClient({ id }: { id: string }) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { mutate: editTreatment, isLoading } = useTreatmentEdit();
  const [costs, setCosts] = useState<Cost[]>([]);
  const [editorContent, setEditorContent] = useState('');
  const { sendMessage, isLoading: isAiLoading } = useOpenRouter();
  const [aiTarget, setAiTarget] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentFormSchema),
    defaultValues: {
      name: '',
      image: '',
      duration: '',
      slug: '',
      description: '',
      beforeAfter: '',
    },
  });

  useEffect(() => {
    // Fetch the treatment data to pre-fill the form
    const fetchTreatment = async () => {
      try {
        const response = await fetch(`/api/admin/treatments/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch treatment data');
        }
        const data = await response.json();
        setCosts(data.treatment.costs);
        setEditorContent(data.treatment.description || '');

        // Reset form with fetched data
        form.reset({
          name: data.treatment.name || '',
          image: data.treatment.image || '',
          duration: data.treatment.duration || '',
          slug: data.treatment.slug || '',
          description: data.treatment.description || '',
          beforeAfter: data.treatment.beforeAfter || '',
        });
      } catch (error) {
        console.error('Error fetching treatment:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchTreatment();
  }, [id, form]);

  const onSubmit = (values: TreatmentFormValues) => {
    editTreatment({ treatmentId: id, data: values });
  };

  const generateAIContent = async () => {
    const treatmentName = form.getValues('name');

    if (!treatmentName) {
      toast.error('Please enter a treatment name first');
      return;
    }

    setAiTarget('description');

    const prompt = `Write a short (max 50 words), patient-friendly description for the dental treatment "${treatmentName}". Focus ONLY on describing this specific treatment, its benefits and process. DO NOT mention any specific dental practice, company name, or location information. Reference the following instructions: ${AI_INSTRUCTIONS.map(
      instruction => instruction.description
    )} `;

    try {
      const response = await sendMessage(prompt);
      if (response) {
        const cleanedResponse = response.replace(/^["'](.*)["']$/g, '$1');
        setEditorContent(cleanedResponse);
        form.setValue('description', cleanedResponse);
        toast.success(`Generated description content`);
      }
    } catch (error) {
      toast.error(`Failed to generate content: ${error}`);
    } finally {
      setAiTarget(null);
    }
  };

  const AiButton = () => (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="h-8 w-8 rounded-full"
      onClick={generateAIContent}
      disabled={isAiLoading || !!aiTarget}
    >
      {aiTarget === 'description' ? (
        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
      ) : (
        <Sparkles className="text-muted-foreground h-4 w-4" />
      )}
      <span className="sr-only">Generate with AI</span>
    </Button>
  );

  const handleRemoveImage = () => {
    form.setValue('image', '');
    toast.success('Image removed');
  };

  const handleEditorChange = (newValue: string) => {
    setEditorContent(newValue);
    form.setValue('description', newValue);
  };

  if (isInitialLoading) {
    return <div className="py-8 text-center">Loading treatment data...</div>;
  }

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
      {/* titlebar and button to view treatment page */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Treatment</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/treatments/${form.getValues('slug')}`} target="_blank">
            View Treatment
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="basis-1/3 rounded-lg bg-white p-6 shadow-md">
          <AdminTreatmentSeo treatmentId={id} />
        </div>
        <div className="basis-1/3 rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-6 text-2xl font-bold">Edit Treatment</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Treatment Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input {...field} type="hidden" />

                          {/* Current Image Preview */}
                          {field.value && (
                            <div className="relative inline-flex flex-col gap-2">
                              <div className="relative">
                                <Image
                                  src={field.value}
                                  alt="Treatment Image"
                                  width={200}
                                  height={150}
                                  className="rounded-lg border object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                                  title="Remove image"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <p className="text-sm text-gray-600">
                                Current image
                              </p>
                            </div>
                          )}

                          {/* Image Selection Options */}
                          <div className="flex flex-col gap-3">
                            {/* Media Picker */}
                            <MediaPicker
                              onSelect={url => {
                                const imageUrl = Array.isArray(url)
                                  ? url[0]
                                  : url;
                                field.onChange(imageUrl);
                                toast.success(
                                  'Image selected from media library'
                                );
                              }}
                              trigger={
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full"
                                  size="lg"
                                >
                                  📁 Choose from Media Library
                                </Button>
                              }
                              title="Choose Treatment Image"
                              description="Select an image from your media library for this treatment."
                            />

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                              <div className="flex-1 border-t border-gray-200"></div>
                              <span className="bg-white px-2 text-sm text-gray-500">
                                or
                              </span>
                              <div className="flex-1 border-t border-gray-200"></div>
                            </div>

                            {/* Upload New Image */}
                            <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
                              <p className="mb-3 text-center text-sm text-gray-600">
                                Upload a new image
                              </p>
                              <ImageUploader
                                onImageUploaded={imageUrl => {
                                  field.onChange(imageUrl);
                                  toast.success(
                                    'New image uploaded successfully'
                                  );
                                }}
                                treatmentId={id}
                              />
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Enhanced Description Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Description Editor</FormLabel>
                  <AiButton />
                </div>
                <div
                  className={`${aiTarget === 'description' ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <Editor
                    value={editorContent}
                    onChange={handleEditorChange}
                    autoClean={true}
                    showPreview={false}
                    pasteMode="replace"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  💡 Tip: Use the HTML tab for advanced editing, or paste
                  content from other sources - it will be automatically cleaned!
                </p>
              </div>

              <FormField
                control={form.control}
                name="beforeAfter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Before/After</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={isLoading || !!aiTarget}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </div>
        <div className="basis-1/3 rounded-lg bg-white p-6 shadow-md">
          <EditTreatmentCost treatmentId={id} />
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="basis-1/2 rounded-lg bg-white p-6 shadow-md">
          <EditTreatmentInstructions treatmentId={id} />
        </div>
        <div className="basis-1/2 rounded-lg bg-white p-6 shadow-md">
          <EditTreatmentSections treatmentId={id} />
        </div>
      </div>
      <EditTreatmentFAQ treatmentId={id} />

      <AdminTreatmentVideo treatmentMetaId={id} />
    </div>
  );
}
