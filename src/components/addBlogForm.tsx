'use client';

import { generateBlogContentPrompt } from '@/components/EditTreatmentInstructions/utils/aiHelpers';
import Editor from '@/components/Editor';
import { useAdminBlog } from '@/hooks/useAdminBlog';
import { useOpenRouter } from '@/hooks/useOpenRouter';
import { generateSlug } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ImageUploader from './ImageUploader';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const formSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(70, 'Title must be less than 70 characters'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published', 'scheduled']),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  imageAlt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoExtra: z.string().optional(),
  seoKeyword: z.string().optional(),
  slug: z.string().optional(),
});

const AddBlogForm = ({ blogId }: { blogId?: string }) => {
  const { data: session } = useSession();
  const authorId = session?.user?.id;
  const router = useRouter();
  const { sendMessage, isLoading: isAiLoading } = useOpenRouter();
  const [aiTarget, setAiTarget] = useState<string | null>(null);

  const {
    createBlogMutate,
    updateBlogMutate,
    isCreating,
    isUpdating,
    isCreateSuccess,
    isUpdateSuccess,
    createError,
    updateError,
    useFetchBlogById,
  } = useAdminBlog();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      status: 'draft',
      image: '',
      imageAlt: '',
      seoTitle: '',
      seoDescription: '',
      seoExtra: '',
      seoKeyword: '',
      slug: '',
    },
  });

  // Auto-generate slug when title changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title') {
        const title = value.title as string;
        if (title) {
          form.setValue('slug', generateSlug(title), { shouldValidate: true });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, generateSlug]);

  // Fetch blog data if editing
  const { data: existingBlog, isLoading: isBlogLoading } = useFetchBlogById(
    blogId || ''
  );

  // Set form values when editing
  useEffect(() => {
    if (existingBlog) {
      form.reset({
        title: existingBlog.title || '',
        content: existingBlog.content || '',
        status:
          (existingBlog.status as 'draft' | 'published' | 'scheduled') ||
          'draft',
        image: existingBlog.image || '',
        imageAlt: existingBlog.imageAlt || '',
        seoTitle: existingBlog.seoTitle || '',
        seoDescription: existingBlog.seoDescription || '',
        seoExtra: existingBlog.seoExtra
          ? JSON.stringify(existingBlog.seoExtra)
          : '',
        seoKeyword: existingBlog.seoKeyword || '',
        slug: existingBlog.slug || '',
      });
    }
  }, [existingBlog, form]);

  const generateAIContent = async (fieldName: string) => {
    const title = form.getValues('title');

    if (!title) {
      toast.error('Please enter a title first');
      return;
    }

    setAiTarget(fieldName);

    try {
      const prompt = generateBlogContentPrompt(fieldName, {
        title,
      });
      const response = await sendMessage(prompt);
      if (response) {
        const cleanedResponse = response.replace(/^["'](.*)["']$/g, '$1');
        form.setValue(
          fieldName as keyof z.infer<typeof formSchema>,
          cleanedResponse,
          { shouldValidate: true }
        );
        toast.success(`Generated ${fieldName} content`);
      }
    } catch (error) {
      toast.error(`Failed to generate ${fieldName}: ${error}`);
    } finally {
      setAiTarget(null);
    }
  };

  // AI Button for text fields
  const AiButton = ({ fieldName }: { fieldName: string }) => (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="h-8 w-8 rounded-full"
      onClick={() => generateAIContent(fieldName)}
      disabled={isAiLoading || !!aiTarget}
      tabIndex={-1}
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

  // Add mutation callbacks
  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      toast.success(
        blogId ? 'Blog updated successfully!' : 'Blog created successfully!'
      );
      router.push('/admin/blogs');
    }
  }, [isCreateSuccess, isUpdateSuccess, blogId, router]);

  useEffect(() => {
    if (createError || updateError) {
      const error = createError || updateError;
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save blog post. Please try again.'
      );
    }
  }, [createError, updateError]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!authorId) {
      toast.error('You must be logged in to create/edit a blog post');
      return;
    }

    try {
      // Parse seoExtra string back to JSON if it exists
      const submitData = {
        ...values,
        seoExtra: values.seoExtra ? JSON.parse(values.seoExtra) : undefined,
        image: values.image || undefined,
        content: values.content || '', // Ensure content is never undefined
        slug: values.slug || generateSlug(values.title), // Ensure slug is generated if not provided
      };

      if (blogId) {
        // Update existing blog
        updateBlogMutate({
          id: blogId,
          ...submitData,
          authorId,
        });
      } else {
        // Create new blog
        createBlogMutate({
          ...submitData,
          authorId,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save blog post. Please try again.'
      );
    }
  };

  if (blogId && isBlogLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-medium">Loading blog post...</div>
          <div className="text-muted-foreground text-sm">
            Please wait while we fetch the blog data.
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-4xl shadow-lg">
      <CardHeader className="from-primary to-primary/90 bg-gradient-to-r">
        <CardTitle className="text-center text-3xl font-semibold text-white">
          {blogId ? 'Edit Blog Post' : 'Create a New Blog Post'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
              <div className="space-y-6">
                {/* Title with AI */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Title</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter blog title"
                            {...field}
                            className="focus:ring-primary pr-10 focus:ring-2"
                          />
                          <div className="absolute top-1/2 right-2 -translate-y-1/2">
                            <AiButton fieldName="title" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
                {/* Slug Field */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Slug</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="blog-post-url-slug"
                            {...field}
                            value={field.value || ''}
                            className="focus:ring-primary pr-10 focus:ring-2"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
                {/* Image and Image Alt */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Featured Image
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <ImageUploader
                              onImageUploaded={url => {
                                field.onChange(url);
                                form.setValue('image', url, {
                                  shouldValidate: true,
                                });
                              }}
                              onImageRemoved={() => {
                                field.onChange('');
                                form.setValue('image', '', {
                                  shouldValidate: true,
                                });
                              }}
                              initialImageUrl={field.value || undefined}
                              aspectRatio={16 / 9}
                              maxSize={2}
                              allowedTypes={[
                                'image/jpeg',
                                'image/png',
                                'image/webp',
                              ]}
                              imageClassName="rounded-lg"
                              showPreview={true}
                              className="w-full"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageAlt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Image Alt Text
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter image alt text"
                              {...field}
                              value={field.value || ''}
                              className="focus:ring-primary pr-10 focus:ring-2"
                            />
                            <div className="absolute top-1/2 right-2 -translate-y-1/2">
                              <AiButton fieldName="imageAlt" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
                {/* SEO Fields */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">SEO Title</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter SEO title"
                              {...field}
                              className="focus:ring-primary pr-10 focus:ring-2"
                            />
                            <div className="absolute top-1/2 right-2 -translate-y-1/2">
                              <AiButton fieldName="seoTitle" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          SEO Description
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter SEO description"
                              {...field}
                              className="focus:ring-primary pr-10 focus:ring-2"
                            />
                            <div className="absolute top-1/2 right-2 -translate-y-1/2">
                              <AiButton fieldName="seoDescription" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoExtra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          SEO Extra (JSON)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter SEO extra as JSON"
                              {...field}
                              value={field.value || ''}
                              className="focus:ring-primary pr-10 focus:ring-2"
                            />
                            <div className="absolute top-1/2 right-2 -translate-y-1/2">
                              <AiButton fieldName="seoExtra" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoKeyword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          SEO Keyword
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter SEO keyword"
                              {...field}
                              className="focus:ring-primary pr-10 focus:ring-2"
                            />
                            <div className="absolute top-1/2 right-2 -translate-y-1/2">
                              <AiButton fieldName="seoKeyword" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            {/* Content with AI */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="font-medium">Content</FormLabel>
                    <AiButton fieldName="content" />
                  </div>
                  <FormControl>
                    <Editor
                      value={field.value}
                      onChange={newContent =>
                        form.setValue('content', newContent, {
                          shouldValidate: true,
                        })
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
            {/* Status */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="focus:ring-primary focus:ring-2">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
            </div>
            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isCreating || isUpdating}
                className="min-w-[100px] hover:bg-gray-100"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isCreating || isUpdating
                  ? 'Submitting...'
                  : blogId
                    ? 'Update Blog Post'
                    : 'Create Blog Post'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddBlogForm;
