import { useOpenRouter } from "@/hooks/useOpenRouter";
import { SectionFormValues } from "@/schemas";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { generateSectionPrompt } from "../utils/aiHelpers";

export const useSectionsAI = (
  form: UseFormReturn<SectionFormValues>,
  treatmentName: string | null
) => {
  const [aiTarget, setAiTarget] = useState<string | null>(null);
  const { sendMessage, isLoading: isAiLoading } = useOpenRouter();

  const generateAIContent = async (fieldName: string) => {
    // For title field, special handling for concept validation
    if (fieldName === "title") {
      const conceptTitle = form.getValues("title");

      if (!conceptTitle) {
        toast.error("Please enter a concept first (e.g., 'Denture Benefits')");
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
      content: form.getValues("content") || "",
    };

    setAiTarget(fieldName);

    try {
      let prompt = "";

      // Use the helper function for title and content
      if (fieldName === "title" || fieldName === "content") {
        prompt = generateSectionPrompt(fieldName, formValues, treatmentName);
      }
      const response = await sendMessage(prompt);

      if (response) {
        const cleanedResponse = response.replace(/^["'](.*)["']$/g, "$1");
        form.setValue(fieldName as any, cleanedResponse);
        toast.success(`Generated ${fieldName} content`);
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
