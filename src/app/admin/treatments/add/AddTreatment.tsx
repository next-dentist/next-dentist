// Add Treatment Page
'use client';
import ImageUploader from '@/components/ImageUploader';
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
import { useAdminTreatmentAdd } from '@/hooks/useAdminTreatmentAdd';
import { generateSlug } from '@/lib/utils';
import { TreatmentFormValues, treatmentSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function AddTreatmentClient() {
  const { mutate, isLoading, isError, isSuccess, error, errorDetails, reset } =
    useAdminTreatmentAdd();

  const router = useRouter();

  const form = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      name: '',
      slug: '',
      duration: '',
      relatedKeys: '',
      description: '',
      image: '',
      video: '',
      imageCaption: '',
      imageCaptionLink: '',
      imageTopRightDescription: '',
      imageTopRightLink: '',
      imageTopRightText: '',
      imageTopRightLinkText: '',
    },
  });

  // Watch the name field and always update slug to match
  const nameValue = form.watch('name');

  useEffect(() => {
    form.setValue('slug', generateSlug(nameValue || ''), { shouldValidate: true });
    // eslint-disable-next-line
  }, [nameValue]);

  const onSubmit = (values: TreatmentFormValues) => {
    mutate(values, {
      onSuccess: () => {
        toast.success('Treatment added successfully!');
        form.reset();
        // Redirect to /admin/treatments after successful add
        setTimeout(() => {
          router.push('/admin/treatments');
        }, 500); // slight delay to allow toast to show
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to add treatment');
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add Treatment</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Treatment Name" {...field} />
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
                  <Input
                    placeholder="treatment-slug"
                    {...field}
                    value={field.value || ''}
                    // Slug is always auto-generated, so no manual edit
                    readOnly
                  />
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
                  <Input placeholder="e.g. 30 minutes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relatedKeys"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Keys</FormLabel>
                <FormControl>
                  <Input placeholder="Comma separated keys" {...field} value={field.value || ''} />
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
                  <Textarea placeholder="Description" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Use ImageUploader with initialImageUrl and onImageRemoved for better form integration */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUploader
                    onImageUploaded={field.onChange}
                    onImageRemoved={() => field.onChange('')}
                    initialImageUrl={field.value || undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="video"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL</FormLabel>
                <FormControl>
                  <Input placeholder="Video URL" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageCaption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Caption</FormLabel>
                <FormControl>
                  <Input placeholder="Image Caption" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageCaptionLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Caption Link</FormLabel>
                <FormControl>
                  <Input placeholder="Image Caption Link" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageTopRightDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Top Right Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Image Top Right Description"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageTopRightLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Top Right Link</FormLabel>
                <FormControl>
                  <Input placeholder="Image Top Right Link" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageTopRightText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Top Right Text</FormLabel>
                <FormControl>
                  <Input placeholder="Image Top Right Text" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageTopRightLinkText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Top Right Link Text</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Image Top Right Link Text"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isError && (
            <div className="text-red-500">
              {error?.message}
              {errorDetails &&
                Array.isArray(errorDetails) &&
                errorDetails.map((err: any, idx: number) => <div key={idx}>{err.message}</div>)}
            </div>
          )}

          {/* Remove the success message since we redirect after success */}
          {/* {isSuccess && <div className="text-green-600">Treatment added successfully!</div>} */}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Treatment'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset();
                reset();
              }}
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
