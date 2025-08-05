'use client';

import { siteConfig } from '@/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { JsonValue } from '@prisma/client/runtime/library';
import { ChevronsUpDown, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Control, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
import { Textarea } from '@/components/ui/textarea';
import { useCostPage } from '@/hooks/cost/useCostPage';
import MediaPicker from '../MediaPicker';
import SingleImageUploader from './SingleImageUploader';

interface CostPage {
  id: string;
  title: string;
  slug: string | null;
  content: string | null;
  image: string | null;
  imageAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoExtra: JsonValue;
  relatedKeys: string[] | string | null;
  city: string | null;
}

interface Dentist {
  id: string;
  name: string;
  city: string;
  // ... other properties
}

interface SearchData {
  dentists: Dentist[];
}

type CostPageResponse = CostPage | { error: string };

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required').optional(),
  image: z.string().optional(),
  imageAlt: z.string().min(1, 'Image alt text is required').optional(),
  seoTitle: z.string().min(1, 'SEO title is required').optional(),
  seoDescription: z.string().min(1, 'SEO description is required').optional(),
  seoExtra: z.string().optional(),
  relatedKeys: z.array(z.string()),
  city: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CostPageFormProps {
  costPageId?: string; // Optional - if provided, we're in edit mode
}

export default function CostPageForm({ costPageId }: CostPageFormProps) {
  const { createCostPage, updateCostPage, useFetchCostPageById } =
    useCostPage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const isEditMode = !!costPageId;

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
      city: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control as Control<FormValues>,
    name: 'relatedKeys' as never,
  });

  // Use the query hook directly in the component
  const { data: costPageData, isLoading } = useFetchCostPageById(costPageId);

  // Fetch cities from searchData.json
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoadingCities(true);
        const response = await fetch('/searchData.json');
        const searchData: SearchData = await response.json();

        // Extract unique cities from dentists data
        const cities = Array.from(
          new Set(
            searchData.dentists
              .map(dentist => dentist.city?.trim())
              .filter(city => city && city.length > 0)
          )
        ).sort();

        setAvailableCities(cities);
      } catch (error) {
        console.error('Error fetching cities:', error);
        toast.error('Failed to load cities');
        // Fallback to siteConfig cities if fetch fails
        setAvailableCities(siteConfig.cities.map(city => city.name));
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // Populate form when cost page data is available
  useEffect(() => {
    if (costPageData && !('error' in costPageData)) {
      const costPage = costPageData;
      // Populate form with existing data
      form.reset({
        title: costPage.title || '',
        slug: costPage.slug || '',
        content: costPage.content || '',
        image: costPage.image || '',
        imageAlt: costPage.imageAlt || '',
        seoTitle: costPage.seoTitle || '',
        seoDescription: costPage.seoDescription || '',
        seoExtra: costPage.seoExtra?.toString() || '',
        relatedKeys: Array.isArray(costPage.relatedKeys)
          ? costPage.relatedKeys
          : typeof costPage.relatedKeys === 'string'
            ? JSON.parse(costPage.relatedKeys)
            : [],
        city: costPage.city || '',
      });

      // Set image URL if it exists
      if (costPage.image) {
        setImageUrl(costPage.image);
      }
    }
  }, [costPageData, form]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Update slug when title changes (only if the slug hasn't been manually edited)
  const updateSlugFromTitle = (title: string) => {
    if (title && !form.getValues('slug')) {
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

      if (isEditMode && costPageId) {
        // Update existing cost page
        await updateCostPage({ formData, id: costPageId });
      } else {
        // Create new cost page
        await createCostPage(formData);
      }

      // ping google sitemap

      toast.success('Cost page created successfully');
      router.push('/admin/cost-pages');
    } catch (error) {
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} cost page:`,
        error
      );
      toast.error(
        `Failed to ${isEditMode ? 'update' : 'create'} cost page. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isLoadingCities) {
    return (
      <div className="flex justify-center p-8">
        Loading {isLoading ? 'cost page data' : 'cities data'}...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Cost Page' : 'Create Cost Page'}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? 'Update the details of this cost page'
            : 'Fill in the details to create a new cost page'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title </FormLabel>
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormItem>
              <FormLabel>Image</FormLabel>
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
                  setImageUrl(imageUrl); // Update imageUrl state
                  form.setValue('image', imageUrl); // Update form value
                }}
              />
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          {/* cities */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        {field.value || 'Select city'}
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandInput placeholder="Search city" />
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {availableCities.map(city => (
                            <CommandItem
                              key={city}
                              onSelect={() => {
                                field.onChange(city);
                              }}
                            >
                              {city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
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
                      {...form.register(`relatedKeys.${index}`)}
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
              {isSubmitting
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                  ? 'Update Cost Page'
                  : 'Create Cost Page'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
