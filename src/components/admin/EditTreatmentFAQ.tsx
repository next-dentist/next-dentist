'use client';

import Drawer from '@/components/Drawer';
import Editor from '@/components/Editor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AI_INSTRUCTIONS } from '@/config';
import {
  useAdminTreatments,
  useCreateTreatmentFAQ,
  useDeleteTreatmentFAQ,
  useUpdateTreatmentFAQ,
} from '@/hooks/useAdminTreatments';
import { useOpenRouter } from '@/hooks/useOpenRouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { FAQ } from '@prisma/client';
import { Loader2, Pencil, PlusCircle, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

type FAQFormValues = z.infer<typeof faqSchema>;

interface FAQFormProps {
  treatmentId: string;
  initialData?: FAQ | null;
  onClose: () => void;
}

function FAQForm({ treatmentId, initialData, onClose }: FAQFormProps) {
  const { mutate: createFAQ, isPending: isCreating } = useCreateTreatmentFAQ();
  const { mutate: updateFAQ, isPending: isUpdating } = useUpdateTreatmentFAQ();
  const { sendMessage, isLoading: isAiLoading } = useOpenRouter();
  const [aiTarget, setAiTarget] = useState<string | null>(null);

  const form = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: initialData?.question || '',
      answer: initialData?.answer || '',
    },
  });

  const onSubmit = (values: FAQFormValues) => {
    if (initialData) {
      updateFAQ({
        treatmentId,
        faqId: initialData.id,
        data: values,
      });
    } else {
      createFAQ({
        treatmentId,
        data: values,
      });
    }
    onClose();
  };

  const generateAIContent = async (fieldName: string) => {
    const treatmentName = form.getValues('question');

    if (fieldName === 'question' && !treatmentName) {
      toast.error('Please enter a topic for the question first');
      return;
    }

    if (fieldName === 'answer' && !form.getValues('question')) {
      toast.error('Please enter a question first');
      return;
    }

    setAiTarget(fieldName);

    let prompt = '';
    switch (fieldName) {
      case 'question':
        prompt = `You can take reference from the following instructions: ${AI_INSTRUCTIONS.map(
          instruction => instruction.description
        )}. Generate a clear, concise short and simple question for a dental Question about "${treatmentName}"`;
        break;
      case 'answer':
        prompt = `Write a helpful, informative answer to the ${form.getValues(
          'question'
        )} question. 
        The answer should be clear, reassuring, and use patient-friendly language. 
        Keep it concise but comprehensive, around 2-3 sentences. 
        ${AI_INSTRUCTIONS.map(instruction => instruction.description)}`;
        break;
      default:
        prompt = `Generate appropriate content for ${fieldName} related to dental FAQs. ${AI_INSTRUCTIONS.map(
          instruction => instruction.description
        )}`;
    }

    try {
      const response = await sendMessage(prompt);
      if (response) {
        const cleanedResponse = response.replace(/^["'](.*)["']$/g, '$1');
        form.setValue(fieldName as any, cleanedResponse);
        toast.success(
          `Generated ${
            fieldName === 'question' ? 'question' : 'answer'
          } content`
        );
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
        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
      ) : (
        <Sparkles className="text-muted-foreground h-4 w-4" />
      )}
      <span className="sr-only">Generate with AI</span>
    </Button>
  );

  const isPending = isCreating || isUpdating;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div className="col-span-full space-y-4 rounded-lg border p-4 md:col-span-1 md:p-2">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Question</FormLabel>
                  <AiButton fieldName="question" />
                </div>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter a question..."
                    disabled={aiTarget === 'question'}
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
            name="answer"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Answer</FormLabel>
                  <AiButton fieldName="answer" />
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
                : 'Create FAQ'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface EditTreatmentFAQProps {
  treatmentId: string;
}

export default function EditTreatmentFAQ({
  treatmentId,
}: EditTreatmentFAQProps) {
  const { data: treatment, isLoading, error } = useAdminTreatments(treatmentId);
  const { mutate: deleteFAQ, isPending: isDeleting } = useDeleteTreatmentFAQ();

  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  const handleDelete = (faqId: string, question: string) => {
    toast.warning(`Are you sure you want to delete the FAQ "${question}"?`, {
      action: {
        label: 'Delete',
        onClick: () => deleteFAQ({ treatmentId, faqId }),
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
      duration: 10000,
    });
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading FAQs...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-center text-red-500">
        Error loading FAQs: {error.message}
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="p-4 text-center text-gray-500">
        No treatment data found.
      </div>
    );
  }

  const faqs: FAQ[] = treatment.faq || [];

  return (
    <Card className={`w-full`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddDrawerOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Add New FAQ"
        side="right"
        width="w-[800px]"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Enter the details for the new FAQ or use AI to generate content.
          </p>
          <FAQForm
            treatmentId={treatmentId}
            onClose={() => setIsAddDrawerOpen(false)}
          />
        </div>
      </Drawer>

      <div className="space-y-3">
        {faqs.map(faq => (
          <div
            key={faq.id}
            className="flex items-start justify-between rounded-md border p-3 transition-colors hover:bg-gray-50"
          >
            <div className="mr-4 flex-1 overflow-hidden">
              <span className="font-medium">{faq.question}</span>
              <p className="mt-1 line-clamp-2 text-sm whitespace-pre-wrap text-gray-600">
                {faq.answer}
              </p>
            </div>

            <div className="flex flex-shrink-0 items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingFAQ(faq)}
                className="hover:bg-gray-200"
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Drawer
                isOpen={editingFAQ?.id === faq.id}
                onClose={() => setEditingFAQ(null)}
                title="Edit FAQ"
                side="right"
                width="w-[800px]"
              >
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Update the question and answer or use AI to improve content.
                  </p>
                  <FAQForm
                    treatmentId={treatmentId}
                    initialData={editingFAQ}
                    onClose={() => setEditingFAQ(null)}
                  />
                </div>
              </Drawer>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(faq.id, faq.question)}
                disabled={isDeleting}
                className="text-red-500 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="rounded-md border border-dashed py-8 text-center text-gray-500">
            <p>No FAQs added yet.</p>
            <p className="mt-1 text-sm">
              Click "Add FAQ" to create your first question and answer.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
