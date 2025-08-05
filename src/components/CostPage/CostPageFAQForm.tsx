'use client';

import Editor from '@/components/Editor';
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
import { Textarea } from '@/components/ui/textarea';
import { AI_INSTRUCTIONS } from '@/config';
import { useCreateCostFAQ, useUpdateCostFAQ } from '@/hooks/cost/useCostFAQ';
import { useOpenRouter } from '@/hooks/useOpenRouter';
import { costFaqSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CostPageFAQFormProps {
  costPageId: string;
  selectedFAQ?: {
    id: string;
    question: string;
    answer: string;
  } | null;
  onSubmit: () => void;
}

export default function CostPageFAQForm({
  costPageId,
  selectedFAQ,
  onSubmit,
}: CostPageFAQFormProps) {
  const { sendMessage, isLoading: isAiLoading } = useOpenRouter();
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);

  const form = useForm({
    resolver: zodResolver(costFaqSchema),
    defaultValues: {
      question: selectedFAQ?.question || '',
      answer: selectedFAQ?.answer || '',
      costPageId,
    },
  });

  const { mutate: createCostFAQ, isPending: isCreating } =
    useCreateCostFAQ(costPageId);
  const { mutate: updateCostFAQ, isPending: isUpdating } =
    useUpdateCostFAQ(costPageId);

  const handleSubmit = useCallback(
    (data: { question: string; answer: string }) => {
      const formData = {
        ...data,
        costPageId,
      };

      if (selectedFAQ) {
        updateCostFAQ(
          {
            id: selectedFAQ.id,
            data: formData,
          },
          {
            onSuccess: () => {
              form.reset({ question: '', answer: '', costPageId });
              onSubmit();
            },
          }
        );
      } else {
        createCostFAQ(formData, {
          onSuccess: () => {
            form.reset({ question: '', answer: '', costPageId });
            onSubmit();
          },
        });
      }
    },
    [createCostFAQ, updateCostFAQ, selectedFAQ, costPageId, onSubmit, form]
  );

  const generateAnswer = async () => {
    const question = form.getValues('question');
    if (!question.trim()) {
      toast.error('Please enter a question first');
      return;
    }

    try {
      setIsGeneratingAnswer(true);
      const prompt = `Generate a professional answer for the dental cost question: "${question}". The answer should be informative, concise, and suitable for a dental website. Use HTML tags to format the content. Write like a dental expert and professional. Use the following format: <ul> <li> <ol> <p> <b> ${AI_INSTRUCTIONS.find(instruction => instruction.id === 1)?.description}, do not add anything else, like title, or anything else. only answer the question, do not add anything else.`;
      const response = await sendMessage(prompt);
      if (response) {
        const cleanedResponse = response.replace(/^["'](.*)["']$/g, '$1');
        form.setValue('answer', cleanedResponse);
        toast.success('Generated answer');
      }
    } catch (error) {
      toast.error(`Failed to generate answer: ${error}`);
    } finally {
      setIsGeneratingAnswer(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your question"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Answer</FormLabel>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={generateAnswer}
                  disabled={isAiLoading || isGeneratingAnswer}
                >
                  {isGeneratingAnswer ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Sparkles
                      className={`h-4 w-4 ${
                        isGeneratingAnswer
                          ? 'animate-pulse text-amber-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  )}
                  <span className="sr-only">Generate with AI</span>
                </Button>
              </div>
              <FormControl>
                <Editor
                  value={field.value}
                  onChange={newContent => form.setValue('answer', newContent)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isCreating || isUpdating}
        >
          {(isCreating || isUpdating) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {selectedFAQ ? 'Update FAQ' : 'Create FAQ'}
        </Button>
      </form>
    </Form>
  );
}
