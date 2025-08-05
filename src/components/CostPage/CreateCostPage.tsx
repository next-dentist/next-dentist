'use client';

import SingleImageUploader from '@/components/CostPage/SingleImageUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useCostPage } from '@/hooks/cost/useCostPage';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required').optional(),
  image: z.string().optional(),
  imageAlt: z.string().min(1, 'Image alt text is required').optional(),
  seoTitle: z.string().min(1, 'SEO title is required').optional(),
  seoDescription: z.string().min(1, 'SEO description is required').optional(),
  seoExtra: z.string().optional(),
  relatedKeys: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateCostPage() {
  const { createCostPage } = useCostPage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      image: '',
      imageAlt: '',
      seoTitle: '',
      seoDescription: '',
      seoExtra: '',
      relatedKeys: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'relatedKeys' as never,
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Update slug when title changes
  const updateSlugFromTitle = (title: string) => {
    if (title) {
      const generatedSlug = generateSlug(title);
      form.setValue('slug', generatedSlug);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Add all form fields to FormData
      Object.entries({
        ...data,
        image: imageUrl,
        relatedKeys: JSON.stringify(data.relatedKeys || []),
      }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value as string);
        }
      });

      // Ensure valid JSON for seoExtra if provided
      if (data.seoExtra && data.seoExtra.trim() !== '') {
        try {
          JSON.parse(data.seoExtra);
        } catch (error) {
          toast.error('Invalid JSON in SEO Extra field');
          setIsSubmitting(false);
          return;
        }
      }

      // Use the mutation function from useCostPage
      await createCostPage(formData);

      // Navigate to the cost pages list
      router.push('/admin/cost-pages');
    } catch (error) {
      console.error('Error creating cost page:', error);
      toast.error('Failed to create cost page. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Cost Page</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter cost page title"
                          onChange={e => {
                            field.onChange(e);
                            updateSlugFromTitle(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter page slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter page content"
                      className="min-h-[150px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormItem>
                <FormLabel>Image</FormLabel>
                <SingleImageUploader
                  folderName="cost-pages"
                  imageUrl={imageUrl || undefined}
                  imageAlt={form.getValues('imageAlt')}
                  onImageUploaded={url => {
                    setImageUrl(url);
                    form.setValue('image', url);
                  }}
                  onImageDeleted={() => {
                    setImageUrl(null);
                    form.setValue('image', '');
                  }}
                  onImageUpdated={alt => {
                    form.setValue('imageAlt', alt);
                  }}
                  title="Cost Page Image"
                />
              </FormItem>

              <FormField
                control={form.control}
                name="imageAlt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Alt Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter image alt text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter SEO title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter SEO description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="seoExtra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Extra (JSON) - Optional</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='{"key": "value"}'
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <p className="text-muted-foreground text-sm">
                    Enter valid JSON or leave empty
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Related Keys</FormLabel>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <FormControl>
                      <Input
                        placeholder="Enter related key"
                        {...form.register(`relatedKeys.${index}` as const)}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append('')}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Related Key
                </Button>
              </div>
            </FormItem>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/cost-pages')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Cost Page'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
