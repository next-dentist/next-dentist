import {
  useAdminTreatments,
  useCreateTreatmentInstruction,
  useUpdateTreatmentInstruction,
} from "@/hooks/useAdminTreatments";
import { instructionFormSchema, InstructionFormValues } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Instruction } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const useInstructionForm = (
  treatmentId: string,
  initialData?: Instruction | null,
  onClose?: () => void
) => {
  // Create form with zod validation
  const form = useForm<InstructionFormValues>({
    resolver: zodResolver(instructionFormSchema),
    defaultValues: {
      type: initialData?.type || "",
      title: initialData?.title || "",
      content: initialData?.content || "",
      icon: initialData?.icon || "",
      buttonText: initialData?.buttonText || "",
      buttonLink: initialData?.buttonLink || "",
    },
  });

  // For rich text editor content
  const [editorContent, setEditorContent] = useState(
    initialData?.content || ""
  );

  // Treatment data
  const { data: treatment } = useAdminTreatments(treatmentId);
  const [treatmentName, setTreatmentName] = useState<string | null>(null);

  // Mutation hooks
  const { mutate: createInstruction, isPending: isCreating } =
    useCreateTreatmentInstruction();
  const { mutate: updateInstruction, isPending: isUpdating } =
    useUpdateTreatmentInstruction();
  const isPending = isCreating || isUpdating;

  // Update treatment name when data is loaded
  useEffect(() => {
    if (treatment) {
      setTreatmentName(treatment.name);
    }
  }, [treatment]);

  // Form submission handler
  const onSubmit = (values: InstructionFormValues) => {
    const dataToSubmit = {
      ...values,
      buttonLink: values.buttonLink === "" ? null : values.buttonLink,
    };

    if (initialData) {
      updateInstruction(
        { treatmentId, instructionId: initialData.id, data: dataToSubmit },
        { onSuccess: () => onClose && onClose() }
      );
    } else {
      createInstruction(
        { treatmentId, data: dataToSubmit },
        { onSuccess: () => onClose && onClose() }
      );
    }
  };

  return {
    form,
    editorContent,
    setEditorContent,
    treatmentName,
    isPending,
    onSubmit,
  };
};
