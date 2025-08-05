import { useOpenRouter } from "@/hooks/useOpenRouter";
import { InstructionFormValues } from "@/schemas";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import {
  cleanAIResponse,
  ensureMaxWords,
  generateInstructionPrompt,
} from "../utils/aiHelpers";

export const useInstructionAI = (
  form: UseFormReturn<InstructionFormValues>,
  treatmentName: string | null,
  setEditorContent?: (content: string) => void
) => {
  const [aiTarget, setAiTarget] = useState<string | null>(null);
  const { sendMessage, isLoading: isAiLoading } = useOpenRouter();

  const generateAIContent = async (fieldName: string) => {
    // For title field, special handling for concept validation
    if (fieldName === "title") {
      const conceptTitle = form.getValues("title");

      if (!conceptTitle) {
        toast.error(
          "Please enter a concept first (e.g., 'Brushing After Surgery')"
        );
        return;
      }
    } else {
      // For other fields, we need a title
      const title = form.getValues("title");
      if (!title) {
        toast.error("Please enter a title first");
        return;
      }
    }

    const formValues = {
      title: form.getValues("title"),
      type: form.getValues("type") || "",
    };

    setAiTarget(fieldName);

    try {
      const prompt = generateInstructionPrompt(
        fieldName,
        formValues,
        treatmentName
      );
      const response = await sendMessage(prompt);

      if (response) {
        const cleanedResponse = cleanAIResponse(response);

        // Special handling for title to ensure it's max 3 words
        if (fieldName === "title") {
          const shortenedResponse = ensureMaxWords(cleanedResponse, 3);
          form.setValue("title", shortenedResponse);
          toast.success(
            shortenedResponse !== cleanedResponse
              ? `Generated concise title (shortened to 3 words)`
              : `Generated concise title`
          );
        } else {
          if (fieldName === "content" && setEditorContent) {
            setEditorContent(cleanedResponse);
          }
          form.setValue(fieldName as any, cleanedResponse);
          toast.success(`Generated ${fieldName} content`);
        }
      }
    } catch (error) {
      toast.error(`Failed to generate content: ${error}`);
    } finally {
      setAiTarget(null);
    }
  };

  return {
    aiTarget,
    isAiLoading,
    generateAIContent,
  };
};
