import {
  Cost,
  FAQ,
  Instruction,
  Section,
  TreatmentImages,
  TreatmentMeta,
  TreatmentVideos,
} from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner"; // Assuming you use sonner for notifications

// Define a more specific type for the treatment data including relations
type TreatmentWithRelations = TreatmentMeta & {
  costs: Cost[];
  faq: FAQ[];
  instructions: Instruction[];
  sections: Section[];
  images: TreatmentImages[];
  videos: TreatmentVideos[];
};

// Hook to fetch a single treatment by ID
export const useAdminTreatments = (id: string | null) => {
  // Use queryClient for potential invalidation later if needed
  const queryClient = useQueryClient();

  return useQuery<TreatmentWithRelations, Error>({
    // Only run the query if the id is not null
    queryKey: ["treatment", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Treatment ID is required");
      }
      const response = await axios.get<{ treatment: TreatmentWithRelations }>(
        `/api/admin/treatments/${id}`
      );
      // The API returns the treatment nested under the 'treatment' key
      return response.data.treatment;
    },
    enabled: !!id, // Ensure the query only runs when id is available
  });
};

// Renamed hook to update any part of the treatment using PATCH
export const useUpdateTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any, // Define a more specific success response type if available
    Error,
    { id: string; data: Partial<TreatmentMeta> } // Accepts id and data payload
  >({
    mutationFn: async ({ id, data }) => {
      const response = await axios.patch(`/api/admin/treatments/${id}`, data); // Use PATCH and send data
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Treatment updated successfully");
      // Invalidate queries related to the specific treatment and the list
      queryClient.invalidateQueries({ queryKey: ["treatment", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["treatments"] }); // Assuming 'treatments' is the key for the list
    },
    onError: (error) => {
      toast.error(
        `Failed to update treatment: ${error.message || "Unknown error"}`
      );
    },
  });
};

// Hook to delete a treatment
export const useDeleteTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any, // Define a more specific success response type if available
    Error,
    string // Accepts only the id
  >({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/admin/treatments/${id}`);
      return response.data;
    },
    onSuccess: (data, id) => {
      toast.success(data?.message || "Treatment deleted successfully");
      // Invalidate queries related to the specific treatment and the list
      queryClient.invalidateQueries({ queryKey: ["treatment", id] });
      queryClient.invalidateQueries({ queryKey: ["treatments"] }); // Assuming 'treatments' is the key for the list
    },
    onError: (error) => {
      toast.error(
        `Failed to delete treatment: ${error.message || "Unknown error"}`
      );
    },
  });
};

// Hook to CREATE a new cost for a treatment
export const useCreateTreatmentCost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { cost: Cost }, // Expected success response type
    Error,
    { treatmentId: string; data: Partial<Omit<Cost, "id" | "treatmentMetaId">> } // Input type
  >({
    mutationFn: async ({ treatmentId, data }) => {
      const response = await axios.post(
        `/api/admin/treatments/${treatmentId}/costs`,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success("Cost created successfully");
      // Invalidate the specific treatment query to refetch costs
      queryClient.invalidateQueries({
        queryKey: ["treatment", variables.treatmentId],
      });
    },
    onError: (error) => {
      toast.error(`Failed to create cost: ${error.message || "Unknown error"}`);
    },
  });
};

// Hook to UPDATE an existing cost
export const useUpdateTreatmentCost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { cost: Cost }, // Expected success response type
    Error,
    { treatmentId: string; costId: string; data: Partial<Cost> } // Input type
  >({
    mutationFn: async ({ treatmentId, costId, data }) => {
      const response = await axios.patch(
        `/api/admin/treatments/${treatmentId}/costs/${costId}`,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success("Cost updated successfully");
      // Invalidate the specific treatment query to refetch costs
      queryClient.invalidateQueries({
        queryKey: ["treatment", variables.treatmentId],
      });
    },
    onError: (error) => {
      toast.error(`Failed to update cost: ${error.message || "Unknown error"}`);
    },
  });
};

// Hook to DELETE a cost
export const useDeleteTreatmentCost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any, // Success response type (adjust if API returns specific data)
    Error,
    { treatmentId: string; costId: string } // Input type
  >({
    mutationFn: async ({ treatmentId, costId }) => {
      const response = await axios.delete(
        `/api/admin/treatments/${treatmentId}/costs/${costId}`
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success("Cost deleted successfully");
      // Invalidate the specific treatment query to refetch costs
      queryClient.invalidateQueries({
        queryKey: ["treatment", variables.treatmentId],
      });
    },
    onError: (error) => {
      toast.error(`Failed to delete cost: ${error.message || "Unknown error"}`);
    },
  });
};

// --- INSTRUCTION HOOKS ---

// Hook to CREATE a new instruction for a treatment
export const useCreateTreatmentInstruction = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { instruction: Instruction }, // Expected success response type from POST route
    Error,
    {
      treatmentId: string;
      data: Partial<Omit<Instruction, "id" | "treatmentMetaId">>;
    } // Input type
  >({
    mutationFn: async ({ treatmentId, data }) => {
      const response = await axios.post(
        `/api/admin/treatments/${treatmentId}/instructions`,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(
        data?.instruction?.title || "Instruction created successfully"
      );
      // Invalidate the specific treatment query to refetch instructions
      queryClient.invalidateQueries({
        queryKey: ["treatment", variables.treatmentId],
      });
    },
    onError: (error) => {
      // Attempt to parse more specific error details if available
      const errorMsg =
        (error as any)?.response?.data?.error ||
        error.message ||
        "Unknown error";
      const errorDetails = (error as any)?.response?.data?.details;
      let description = errorMsg;
      if (errorDetails) {
        // Format Zod errors nicely if present
        description += `: ${JSON.stringify(errorDetails)}`;
      }
      toast.error("Failed to create instruction", { description });
    },
  });
};

// Hook to UPDATE an existing instruction
export const useUpdateTreatmentInstruction = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { instruction: Instruction }, // Expected success response type from PATCH route
    Error,
    { treatmentId: string; instructionId: string; data: Partial<Instruction> } // Input type
  >({
    mutationFn: async ({ treatmentId, instructionId, data }) => {
      const response = await axios.patch(
        `/api/admin/treatments/${treatmentId}/instructions/${instructionId}`,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(
        data?.instruction?.title || "Instruction updated successfully"
      );
      // Invalidate the specific treatment query to refetch instructions
      queryClient.invalidateQueries({
        queryKey: ["treatment", variables.treatmentId],
      });
    },
    onError: (error) => {
      const errorMsg =
        (error as any)?.response?.data?.error ||
        error.message ||
        "Unknown error";
      const errorDetails = (error as any)?.response?.data?.details;
      let description = errorMsg;
      if (errorDetails) {
        description += `: ${JSON.stringify(errorDetails)}`;
      }
      toast.error("Failed to update instruction", { description });
    },
  });
};

// Hook to DELETE an instruction
export const useDeleteTreatmentInstruction = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any, // Success response type from DELETE route (adjust if specific data is returned)
    Error,
    { treatmentId: string; instructionId: string } // Input type
  >({
    mutationFn: async ({ treatmentId, instructionId }) => {
      const response = await axios.delete(
        `/api/admin/treatments/${treatmentId}/instructions/${instructionId}`
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Instruction deleted successfully");
      // Invalidate the specific treatment query to refetch instructions
      queryClient.invalidateQueries({
        queryKey: ["treatment", variables.treatmentId],
      });
    },
    onError: (error) => {
      const errorMsg =
        (error as any)?.response?.data?.error ||
        error.message ||
        "Unknown error";
      toast.error("Failed to delete instruction", { description: errorMsg });
    },
  });
};

// --- SECTION HOOKS ---

// Hook to CREATE a new section for a treatment
export const useCreateTreatmentSection = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { section: Section }, // Expected success response type from POST route
    Error,
    {
      treatmentId: string;
      data: Partial<Omit<Section, "id" | "treatmentMetaId">>;
    } // Input type
  >({
    mutationFn: async ({ treatmentId, data }) => {
      const response = await axios.post(
        `/api/admin/treatments/${treatmentId}/sections`,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.section?.title || "Section created successfully");
      // Invalidate the specific treatment query to refetch sections
      queryClient.invalidateQueries({
        queryKey: ["treatment", variables.treatmentId],
      });
    },
    onError: (error) => {
      toast.error(
        `Failed to create section: ${error.message || "Unknown error"}`
      );
    },
  });
};

// Hook to UPDATE an existing section
export const useUpdateTreatmentSection = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { section: Section }, // Expected success response type from PATCH route
    Error,
    { treatmentId: string; sectionId: string; data: Partial<Section> } // Input type
  >({
    mutationFn: async ({ treatmentId, sectionId, data }) => {
      const response = await axios.patch(
        `/api/admin/treatments/${treatmentId}/sections/${sectionId}`,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.section?.title || "Section updated successfully");
      // Invalidate the specific treatment query to refetch sections
      queryClient.invalidateQueries({
        queryKey: ["treatment", variables.treatmentId],
      });
    },
    onError: (error) => {
      toast.error(
        `Failed to update section: ${error.message || "Unknown error"}`
      );
    },
  });
};

// Hook to DELETE a section
export const useDeleteTreatmentSection = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean }, // Expected success response type from DELETE route
    Error,
    { treatmentId: string; sectionId: string } // Input type
  >({
    mutationFn: async ({ treatmentId, sectionId }) => {
      const response = await axios.delete(
        `/api/admin/treatments/${treatmentId}/sections/${sectionId}`
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Section deleted successfully");
      // Invalidate the specific treatment query to refetch sections
      queryClient.invalidateQueries({
        queryKey: ["treatment", variables.treatmentId],
      });
    },
    onError: (error) => {
      toast.error(
        `Failed to delete section: ${error.message || "Unknown error"}`
      );
    },
  });
};

// --- FAQ HOOKS ---
// Hook to CREATE a new FAQ for a treatment
export const useCreateTreatmentFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { faq: FAQ }, // Expected success response type from POST route
    Error,
    {
      treatmentId: string;
      data: Partial<Omit<FAQ, "id" | "treatmentMetaId">>;
    } // Input type
  >({
    mutationFn: async ({ treatmentId, data }) => {
      const response = await axios.post(
        `/api/admin/treatments/${treatmentId}/faq`,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success("FAQ created successfully");
      // Invalidate the specific treatment query to refetch FAQs
      queryClient.invalidateQueries({
        queryKey: ["treatment", variables.treatmentId],
      });
    },
    onError: (error) => {
      toast.error(`Failed to create FAQ: ${error.message || "Unknown error"}`);
    },
  });
};

// Hook to UPDATE an existing FAQ
export const useUpdateTreatmentFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { faq: FAQ }, // Expected success response type
    Error,
    { treatmentId: string; faqId: string; data: Partial<FAQ> } // Input type
  >({
    mutationFn: async ({ treatmentId, faqId, data }) => {
      const response = await axios.put(
        `/api/admin/treatments/${treatmentId}/faq/${faqId}`,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success("FAQ updated successfully");
      // Invalidate the specific treatment query to refetch FAQs
      queryClient.invalidateQueries({
        queryKey: ["treatment", variables.treatmentId],
      });
    },
    onError: (error) => {
      toast.error(`Failed to update FAQ: ${error.message || "Unknown error"}`);
    },
  });
};

// Hook to DELETE a FAQ
export const useDeleteTreatmentFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string }, // Success response type
    Error,
    { treatmentId: string; faqId: string } // Input type
  >({
    mutationFn: async ({ treatmentId, faqId }) => {
      const response = await axios.delete(
        `/api/admin/treatments/${treatmentId}/faq/${faqId}`
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success("FAQ deleted successfully");
      // Invalidate the specific treatment query to refetch FAQs
      queryClient.invalidateQueries({
        queryKey: ["treatment", variables.treatmentId],
      });
    },
    onError: (error) => {
      toast.error(`Failed to delete FAQ: ${error.message || "Unknown error"}`);
    },
  });
};
