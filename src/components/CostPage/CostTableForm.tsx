'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Editor from '@/components/Editor';
import MediaPicker from '@/components/MediaPicker';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SingleImageUploader from './SingleImageUploader';

import LoadingSpinner from '@/components/LoadingSpinner';
import { currencyConfig } from '@/config';
import { useCostPageTable } from '@/hooks/cost/useCostPageTable';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';
import { useOpenRouter } from '@/hooks/useOpenRouter';
import { parseCost } from '@/lib/utils';
import { CostTableFormValues, costTableSchema } from '@/schemas';

/* ---------- Types ---------- */

type Currency = (typeof currencyConfig.list)[number];

interface CostTableFormProps {
  onSubmit?: () => void;
  costPageId: string;
  isDrawerOpen: boolean;

  selectedTable?: {
    id: string;
    title: string;
    titleUrl?: string | null;
    content: string;
    image?: string | null;
    imageAlt?: string | null;
    currencyOne?: string | null;
    currencyTwo?: string | null;
    currencyThree?: string | null;
    costOne?: string | null;
    costTwo?: string | null;
    costThree?: string | null;
    tableSetId?: string | null;
  } | null;

  tableSetId?: string | null;
}

/* ---------- Component ---------- */

export default function CostTableForm({
  onSubmit,
  costPageId,
  selectedTable,
  tableSetId,
  isDrawerOpen,
}: CostTableFormProps) {
  /* ---------- RHF ---------- */
  const form = useForm<CostTableFormValues>({
    resolver: zodResolver(costTableSchema),
    defaultValues: {
      costTables: [
        {
          title: '',
          titleUrl: '',
          image: '',
          imageAlt: '',
          content: '',
          currencyOne: 'INR',
          currencyTwo: 'USD',
          currencyThree: 'GBP',
          costOne: '',
          costTwo: '',
          costThree: '',
          tableSetId: tableSetId ?? undefined,
        },
      ],
      costPageId,
    },
  });

  /* plug-in automatic currency logic (auto-writes costTwo & costThree) */
  useCurrencyConversion(form);

  /* Add currency symbol to Cost 1 input */
  useEffect(() => {
    const costOne = form.getValues('costTables.0.costOne');
    const currencyOne = form.getValues('costTables.0.currencyOne');

    if (!costOne || !currencyOne) return;

    // Get currency symbol
    const currencySymbol = currencyConfig.list.find(
      c => c.id === currencyOne
    )?.symbol;
    if (!currencySymbol) return;

    // Check if the value already has the currency symbol
    if (costOne.startsWith(currencySymbol)) return;

    // Add currency symbol if it's not already there
    const parsed = parseCost(costOne);
    if (!parsed) return;

    if (parsed.isRange) {
      form.setValue(
        'costTables.0.costOne',
        `${currencySymbol}${parsed.min.toLocaleString()} – ${currencySymbol}${parsed.max.toLocaleString()}`
      );
    } else {
      form.setValue(
        'costTables.0.costOne',
        `${currencySymbol}${parsed.value.toLocaleString()}`
      );
    }
  }, [
    form.watch('costTables.0.costOne'),
    form.watch('costTables.0.currencyOne'),
  ]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  /* ---------- DB mutate hooks ---------- */
  const { create, update, isCreating, isUpdating } =
    useCostPageTable(costPageId);

  /* ---------- Drawer open ⇢ preload data ---------- */
  const [imageUploaderKey, setImageUploaderKey] = useState('initial');

  const { sendMessage, isLoading: isAiLoading } = useOpenRouter();
  const [aiTarget, setAiTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;

    if (selectedTable) {
      /* edit existing row */
      form.reset({
        costTables: [
          {
            title: selectedTable.title ?? '',
            titleUrl: selectedTable.titleUrl ?? '',
            image: selectedTable.image ?? '',
            imageAlt: selectedTable.imageAlt ?? '',
            content: selectedTable.content ?? '',
            currencyOne: selectedTable.currencyOne ?? 'INR',
            currencyTwo: selectedTable.currencyTwo ?? 'USD',
            currencyThree: selectedTable.currencyThree ?? 'GBP',
            costOne: selectedTable.costOne ?? '',
            costTwo: selectedTable.costTwo ?? '',
            costThree: selectedTable.costThree ?? '',
            tableSetId: selectedTable.tableSetId ?? tableSetId ?? undefined,
          },
        ],
        costPageId,
      });
      setImageUploaderKey(`table-${selectedTable.id}-${Date.now()}`);
    } else {
      /* new row */
      form.reset({
        costTables: [
          {
            title: '',
            titleUrl: '',
            image: '',
            imageAlt: '',
            content: '',
            currencyOne: 'INR',
            currencyTwo: 'USD',
            currencyThree: 'GBP',
            costOne: '',
            costTwo: '',
            costThree: '',
            tableSetId: tableSetId ?? undefined,
          },
        ],
        costPageId,
      });
      setImageUploaderKey(`new-table-${Date.now()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTable, tableSetId, costPageId, isDrawerOpen]);

  /* ---------- helpers ---------- */
  const val = (v: string | null | undefined) => v ?? '';

  /* ---------- submit ---------- */
  async function handleFormSubmit(data: CostTableFormValues) {
    try {
      if (selectedTable) {
        await update({
          id: selectedTable.id,
          data: {
            costTables: [
              { ...data.costTables[0], tableSetId: tableSetId ?? undefined },
            ],
            costPageId,
          },
        });
        toast.success('Cost table updated successfully');
      } else {
        await create({
          ...data,
          costTables: data.costTables.map(t => ({
            ...t,
            tableSetId: tableSetId ?? undefined,
          })),
        });
        toast.success('Cost table created successfully');
      }
      onSubmit?.();
    } catch (err) {
      console.error(err);
      toast.error(
        selectedTable
          ? 'Failed to update cost table'
          : 'Failed to create cost table'
      );
    }
  }

  const generateAIContent = async (fieldName: string) => {
    const title = form.getValues('costTables.0.title');

    if (!title) {
      toast.error('Please enter a title first');
      return;
    }

    setAiTarget(fieldName);

    try {
      const prompt = `Generate short intro sentence for "${title}", it should be in 70 characters max. do not add anything else, like title, or anything else.`;
      const response = await sendMessage(prompt);
      if (response) {
        const cleanedResponse = response.replace(/^["'](.*)["']$/g, '$1');
        form.setValue('costTables.0.content', cleanedResponse);
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

  /* ---------- JSX ---------- */
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4 md:space-y-2"
      >
        {/* ---------- MAIN GRID (title / content / image) ---------- */}
        {form.getValues('costTables').map((_, index) => (
          <div key={index} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* — left column — */}
            <div className="space-y-4 rounded-lg border p-4 md:space-y-2 md:p-2">
              <FormField
                control={form.control}
                name={`costTables.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={val(field.value)}
                        placeholder="Title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`costTables.${index}.titleUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={val(field.value)}
                        placeholder="Title URL"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`costTables.${index}.content`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Content</FormLabel>
                      <AiButton fieldName="content" />
                    </div>
                    <FormControl>
                      <Editor
                        value={field.value}
                        onChange={v =>
                          form.setValue(`costTables.${index}.content`, v)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* — right column — */}
            <div className="space-y-4 rounded-lg border p-4 md:space-y-2 md:p-2">
              <MediaPicker
                onSelect={url => {
                  const imageUrl = Array.isArray(url) ? url[0] : url;
                  form.setValue(`costTables.${index}.image`, imageUrl);
                  // Update the image alt text when a new image is selected
                  form.setValue(
                    `costTables.${index}.imageAlt`,
                    'Cost Table Image'
                  );
                }}
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
              />
              <FormField
                control={form.control}
                name={`costTables.${index}.image`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <SingleImageUploader
                        key={imageUploaderKey}
                        folderName="cost-tables"
                        imageUrl={field.value || undefined}
                        imageAlt={form.getValues(
                          `costTables.${index}.imageAlt`
                        )}
                        onImageUploaded={url =>
                          form.setValue(`costTables.${index}.image`, url)
                        }
                        onImageDeleted={() =>
                          form.setValue(`costTables.${index}.image`, '')
                        }
                        onImageUpdated={alt =>
                          form.setValue(`costTables.${index}.imageAlt`, alt)
                        }
                        title="Cost Table Image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`costTables.${index}.imageAlt`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Alt Text</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={val(field.value)}
                        placeholder="Image Alt Text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        {/* ---------- Currency pickers ---------- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(['currencyOne', 'currencyTwo', 'currencyThree'] as const).map(
            (name, i) => (
              <FormField
                key={name}
                control={form.control}
                name={`costTables.0.${name}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Currency ${i + 1}`}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencyConfig.list.map((c: Currency) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} ({c.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          )}
        </div>

        {/* ---------- Cost inputs ---------- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(['costOne', 'costTwo', 'costThree'] as const).map((name, i) => (
            <FormField
              key={name}
              control={form.control}
              name={`costTables.0.${name}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Cost ${i + 1}${i ? ' (auto)' : ''}`}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={val(field.value)}
                      placeholder={`Cost ${i + 1}`}
                      readOnly={i !== 0}
                      className={i !== 0 ? 'bg-gray-50' : ''}
                      onBlur={e => {
                        if (i === 0) {
                          const value = e.target.value;
                          const currencyOne = form.getValues(
                            'costTables.0.currencyOne'
                          );
                          const currencySymbol = currencyConfig.list.find(
                            c => c.id === currencyOne
                          )?.symbol;

                          if (!value || !currencySymbol) {
                            field.onBlur();
                            return;
                          }

                          // For ranges like "40,000 - 60,000"
                          if (value.includes('-')) {
                            const parts = value
                              .split('-')
                              .map(part => part.trim());
                            if (parts.length === 2) {
                              // Add currency symbol to both parts if not already present
                              const part1 = parts[0].startsWith(currencySymbol)
                                ? parts[0]
                                : `${currencySymbol}${parts[0]}`;
                              const part2 = parts[1].startsWith(currencySymbol)
                                ? parts[1]
                                : `${currencySymbol}${parts[1]}`;
                              const formattedValue = `${part1} - ${part2}`;
                              form.setValue(
                                'costTables.0.costOne',
                                formattedValue
                              );
                            }
                          } else if (!value.startsWith(currencySymbol)) {
                            // For single values like "40,000"
                            form.setValue(
                              'costTables.0.costOne',
                              `${currencySymbol}${value}`
                            );
                          }
                        }
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || isCreating || isUpdating}
        >
          {selectedTable ? 'Update' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
