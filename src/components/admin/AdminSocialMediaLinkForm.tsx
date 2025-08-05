'use client';

import Drawer from '@/components/Drawer';
import { Button } from '@/components/ui/button';
import {
  useAdminDentistFetch,
  useCreateDentistSocialMedia,
  useDeleteDentistSocialMedia,
} from '@/hooks/useAdminDentistEdit';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  Plus,
  Trash2,
  Twitter,
  Youtube,
} from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const socialMediaSchema = z.object({
  socialMedia: z.array(
    z.object({
      platform: z.string().min(1, 'Platform is required'),
      url: z.string().url('Must be a valid URL'),
    })
  ),
});

type SocialMediaFormValues = z.infer<typeof socialMediaSchema>;

interface SocialMediaLink {
  platform: string;
  url: string;
}

interface AdminSocialMediaLinkFormProps {
  dentistId: string;
}

const platformIcons = {
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  YouTube: Youtube,
};

export function AdminSocialMediaLinkForm({
  dentistId,
}: AdminSocialMediaLinkFormProps) {
  const { data: dentist, isLoading } = useAdminDentistFetch(dentistId);
  const createMutation = useCreateDentistSocialMedia();
  const deleteMutation = useDeleteDentistSocialMedia();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      socialMedia: [{ platform: '', url: '' }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'socialMedia',
  });

  // Parse social media data from socialLinks property
  const socialMedia: SocialMediaLink[] = dentist?.socialLinks
    ? typeof dentist.socialLinks === 'string'
      ? JSON.parse(dentist.socialLinks)
      : Object.entries(dentist.socialLinks as Record<string, string>)
          .filter(([_, url]) => url && url.trim() !== '')
          .map(([platform, url]) => ({
            platform: platform.charAt(0).toUpperCase() + platform.slice(1),
            url,
          }))
    : [];

  // Function to open drawer and populate form with existing links
  const handleOpenDrawer = () => {
    // If there are existing social media links, populate the form with all of them
    if (socialMedia.length > 0) {
      replace(socialMedia);
    } else {
      // If no existing links, start with one empty field
      replace([{ platform: '', url: '' }]);
    }

    setIsOpen(true);
  };

  const onSubmit = async (data: SocialMediaFormValues) => {
    const socialMediaData = {
      dentistId,
      socialLinks: data.socialMedia.reduce(
        (acc, link) => ({
          ...acc,
          [link.platform.toLowerCase()]: link.url,
        }),
        {}
      ),
    };

    try {
      const result = await createMutation.mutateAsync(socialMediaData);
      setIsOpen(false);
      form.reset();
      toast.success('Social media links saved successfully');
    } catch (error) {
      console.error('Error saving social media links:', error);
      toast.error('Failed to save social media links');
    }
  };

  const handleDelete = async (platform: string) => {
    if (
      window.confirm('Are you sure you want to delete this social media link?')
    ) {
      try {
        const currentLinks =
          typeof dentist?.socialLinks === 'string'
            ? JSON.parse(dentist.socialLinks)
            : dentist?.socialLinks || {};

        const updatedLinks = { ...currentLinks };
        delete updatedLinks[platform.toLowerCase()];

        await createMutation.mutateAsync({
          dentistId,
          socialLinks: updatedLinks,
        });

        toast.success('Social media link deleted successfully');
      } catch (error) {
        console.error('Error deleting social media link:', error);
        toast.error('Failed to delete social media link');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-10">
        {/* Show existing links info */}
        {socialMedia.length > 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 font-medium text-blue-900">
              Current Social Media Links ({socialMedia.length})
            </h4>
            <div className="space-y-1">
              {socialMedia.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-blue-700"
                >
                  <span className="font-medium">{link.platform}:</span>
                  <span className="truncate">{link.url}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-blue-600">
              You can edit existing links below or add new ones.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-start gap-4 rounded-lg border p-4"
            >
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name={`socialMedia.${index}.platform`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="Twitter">Twitter</SelectItem>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="YouTube">YouTube</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`socialMedia.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., https://facebook.com/yourpage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="mt-8"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ platform: '', url: '' })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Link
        </Button>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              form.reset();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save All Links'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  const SocialMediaList = () => {
    if (!socialMedia || socialMedia.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          No social media links added yet
        </div>
      );
    }

    return (
      <div className="w-full space-y-4">
        {socialMedia.map((link: SocialMediaLink, index: number) => {
          const IconComponent =
            platformIcons[link.platform as keyof typeof platformIcons];
          return (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center space-x-4">
                {IconComponent && (
                  <IconComponent className="h-6 w-6 text-blue-500" />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{link.platform}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(link.platform)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Manage your social media presence and links
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleOpenDrawer}>
          <Plus className="mr-2 h-4 w-4" />
          Manage Links
        </Button>
      </CardHeader>
      <CardContent>
        <SocialMediaList />
      </CardContent>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Manage Social Media Links"
        side="right"
        width="w-[600px]"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Manage all your social media profiles and links. You can edit
            existing links or add new ones.
          </p>
          <FormContent />
        </div>
      </Drawer>
    </Card>
  );
}
